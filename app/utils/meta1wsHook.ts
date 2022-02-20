//@ts-ignore
import Api from 'meta1dex/dist/api';
type WSState = 'open' | 'closed' | 'error';
export const setupOnStatusCallbackHook = (callback: (s: WSState) => void) => {
  const apiInst: any = Api.getApis().instance();
  const oCallback = apiInst.statusCb;
  apiInst.setRpcConnectionStatusCallback((status: WSState) => {
    console.log('HOOKED STATUS', status);
    callback(status);
    return oCallback(status);
  });
};
