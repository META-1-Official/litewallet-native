import throttle from 'lodash.throttle';
import { Alert, Platform } from 'react-native';
import { Asset } from 'react-native-image-picker';
import { promptPromise } from '.';
import config from '../config';
import { useStore } from '../store';

const HOST = config.litewalletApiHost;

enum Method {
  _getUserData = '/getUserData',
  _saveAvatar = '/saveAvatar',
  _deleteAvatar = '/deleteAvatar',
  _signUp = '/signUp',
  _getHistory = '/getHistory',
  _getNotifications = '/getNotifications',
  _login = '/login',
}

type Ret<T> = { message: T; error?: string };
type login = { login: string };
type getUserDataResponse = Ret<{
  id: number;
  userAvatar: string;
  login: string;
  currency: string;
}>;

interface forAccount {
  accountName: string;
}

type getHistoryArgs = forAccount & { skip_size: number };
type AuthArgs = forAccount & { password: string };
interface iEndpoint<T extends Method, X> {
  method: T;
  args: X;
}
type CallDataT =
  | iEndpoint<Method._getUserData, login>
  | iEndpoint<Method._deleteAvatar, login>
  | iEndpoint<Method._saveAvatar, FormData>
  | iEndpoint<Method._signUp, forAccount>
  | iEndpoint<Method._getNotifications, forAccount>
  | iEndpoint<Method._getHistory, getHistoryArgs>
  | iEndpoint<Method._login, AuthArgs>;

async function refreshToken() {
  const { accountName, password: storedPass, setToken } = useStore.getState();

  const password = storedPass
    ? storedPass
    : await promptPromise(
        'Enter password',
        'Password is required for this operation',
        'secure-text',
      ).then(e => e || '');

  const token = await getToken({ accountName, password });
  setToken(token);

  return token;
}

interface JWTTimed {
  iat: number;
  exp: number;
}

const unixtime = (n: number) => new Date(n * 1000);

function expired(token: string) {
  const [header, payload, sig] = token.split('.');

  if (!header || !payload || !sig) {
    // Not even a valid token
    return true;
  }

  const data: JWTTimed = JSON.parse(Buffer.from(payload, 'base64').toString());

  return unixtime(data.exp) < new Date();
}

const getAuthHeader = async () => {
  let token = useStore.getState().token;
  if (!token) {
    // TODO: Refresh token for real, like if the password is wrong
    token = await refreshToken();
  }

  if (expired(token)) {
    token = await refreshToken();
  }

  return { Authorization: `Bearer ${token}` };
};

async function Call<T = any>(args: CallDataT, auth = true) {
  const isFormData = (x: unknown): x is FormData => x instanceof FormData;

  const authHeader = auth ? await getAuthHeader() : {};
  const options: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader,
    },
    body: JSON.stringify(args.args),
  };

  if (isFormData(args.args)) {
    options.headers = {
      'Content-Type': 'multipart/form-data',
      ...authHeader,
    };
    options.body = args.args;
  }

  // prettier-ignore
  return fetch(`${HOST}${args.method}`, options)
          .then(r => r.json() as Promise<T>);
}

/**
 * Get current authenticated users avatar
 * @returns {string} users avatar url,
 */
export async function loadAvatar() {
  const { accountName } = useStore.getState();
  const { message } = await Call<getUserDataResponse>({
    method: Method._getUserData,
    args: {
      login: accountName,
    },
  });
  return `${HOST}/public/${message.userAvatar}`;
}

/**
 * Update current authenticated users avatar
 * @returns {void}
 */
export async function uploadAvatar(photo: Asset) {
  const { accountName, setAvatar } = useStore.getState();

  const fd = new FormData();
  fd.append('login', accountName);
  fd.append('file', {
    name: photo.fileName,
    type: photo.type,
    uri: Platform.OS === 'ios' ? photo.uri!.replace('file://', '') : photo.uri!,
  });

  const { message, error } = await Call<Ret<string>>({
    method: Method._saveAvatar,
    args: fd,
  });

  if (error) {
    return console.error(`${error}: ${message}`);
  }

  setAvatar(`${HOST}/public/${message}`);
}

const RemoveAlert = () =>
  new Promise(resolve =>
    Alert.alert('Remove avatar', 'Are you sure you want to continue', [
      {
        text: 'Cancel',
        onPress: () => resolve(false),
        style: 'cancel',
      },
      { text: 'OK', onPress: () => resolve(true) },
    ]),
  );

/**
 * Deletes current authenticated users avatar
 * @returns {void}
 */
export async function removeAvatar() {
  try {
    const { accountName, setAvatar } = useStore.getState();

    const ok = await RemoveAlert();
    if (!ok) {
      return;
    }

    await Call<void>({
      method: Method._deleteAvatar,
      args: {
        login: accountName,
      },
    });
    setAvatar('');
  } catch (e) {
    console.warn(e);
    Alert.alert('Something went wrong');
  }
}

export async function signUp(args: forAccount) {
  return await Call(
    {
      method: Method._signUp,
      args,
    },
    false,
  );
}

export async function getHistory(args: getHistoryArgs) {
  return await Call<{ data: number[] }>({
    method: Method._getHistory,
    args,
  });
}

export interface Notification {
  id: number;
  content: string;
  type: 'USER' | 'GLOBAl';
  userId: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export async function getNotifications(args: forAccount) {
  const ret = await Call<Notification[]>({
    method: Method._getNotifications,
    args,
  });
  return Array.isArray(ret) ? ret : [];
}

type LoginRes = {
  success: 'success' | 'fail';
  token: string;
  accountName: string;
};

const err = throttle(() => Alert.alert('Authentication error'), 3e5); // Only one in five mins
const authError = (e: any) => [console.log(e), err()] && null;
export async function getToken(args: AuthArgs) {
  const res = await Call<LoginRes>(
    {
      method: Method._login,
      args,
    },
    false,
  ).catch(authError);

  return res?.token || '';
}
