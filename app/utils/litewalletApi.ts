import { Alert, Platform } from 'react-native';
import { Asset } from 'react-native-image-picker';
import config from '../config';
import { useStore } from '../store';

const HOST = config.litewalletApiHost;

enum Method {
  _getUserData = '/getUserData',
  _saveAvatar = '/saveAvatar',
  _deleteAvatar = '/deleteAvatar',
  _signUp = '/api/signUp',
  _getHistory = '/api/getHistory',
  _getNotifications = '/api/getNotifications',
}

type Ret<T> = { message: T };
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
  | iEndpoint<Method._getHistory, getHistoryArgs>;

const getAuthHeader = () => {
  const token = useStore.getState().token;
  if (!token) {
    // TODO: Refresh token
  }

  return { Authorization: `Bearer ${token}` };
};

async function Call<T = any>(args: CallDataT, auth = true) {
  const isFormData = (x: unknown): x is FormData => x instanceof FormData;

  const authHeader = auth ? getAuthHeader() : {};
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

  const { message } = await Call<Ret<string>>({
    method: Method._saveAvatar,
    args: fd,
  });

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
  return await Call<Notification[]>({
    method: Method._getNotifications,
    args,
  });
}
