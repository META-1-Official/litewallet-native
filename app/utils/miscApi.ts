const BASEURL = 'http://65.21.242.70:3333';

enum ENDPOINT {
  _signUp = '/api/signUp',
  _getHistory = '/api/getHistory',
  _getNotifications = '/api/getNotifications',
}

interface forAccount {
  accountName: string;
}

interface iEndpoint<T extends ENDPOINT, X> {
  path: T;
  args: X;
}

type CallDataT =
  | iEndpoint<ENDPOINT._signUp, forAccount>
  | iEndpoint<ENDPOINT._getNotifications, forAccount>
  | iEndpoint<ENDPOINT._getHistory, getHistoryArgs>;

export async function call<T = any>(calldata: CallDataT) {
  return fetch(BASEURL + calldata.path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(calldata.args),
  }).then(r => r.json() as Promise<T>);
}

export async function signUp(args: forAccount) {
  return await call({
    path: ENDPOINT._signUp,
    args,
  });
}

type getHistoryArgs = forAccount & { skip_size: number };
export async function getHistory(args: getHistoryArgs) {
  return await call<{ data: number[] }>({
    path: ENDPOINT._getHistory,
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
  return await call<Notification[]>({
    path: ENDPOINT._getNotifications,
    args,
  });
}

export const createPaperWalletLink = (...args: any[]) => {
  const payload = Buffer.from(args.join(' '), 'utf-8').toString('base64');
  const baseurl = `${BASEURL}/paperwallet#`;
  return baseurl + payload;
};
