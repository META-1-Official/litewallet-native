import throttle from 'lodash.throttle';
//@ts-ignore
import Api from 'meta1dex/dist/api';
type WSState = 'open' | 'closed' | 'error';
type CallbackT = (s: WSState) => void;
const handler = (callback: CallbackT, oCallback: any) =>
  throttle((status: WSState) => {
    throttle;
    console.log('HOOKED STATUS', status);
    callback(status);
    return oCallback(status);
  }, 1000);

export const setupOnStatusCallbackHook = (callback: CallbackT) => {
  const apiInst: any = Api.getApis().instance();
  const oCallback = apiInst.statusCb;
  apiInst.setRpcConnectionStatusCallback(handler(callback, oCallback));
};
