export function isError(e: unknown): e is Error {
  return e instanceof Error;
}

type Eparser = (e: Error) => [Error, boolean];
export function ErrorParser(e: Error) {
  const parsers: Eparser[] = [consumeTxInfo, InsufficientBalance];

  for (const p of parsers) {
    try {
      const [r, fin] = p(e);
      e = r;
      if (fin) {
        break;
      }
    } catch (_) {
      console.warn(_);
    }
  }
  return e;
}

const applyMsg = (e: Error, cb: (_: string) => string, fin = false): ReturnType<Eparser> => {
  e.message = cb(e.message).trim();
  return [e, fin];
};

const mkMutMsg =
  (cb: (_: string) => string): Eparser =>
  e =>
    applyMsg(e, cb);

const mkMutMsgFinal =
  (cb: (_: string) => string): Eparser =>
  e =>
    applyMsg(e, cb, true);

const consumeTxInfo = mkMutMsg(m => m.split('bitshares-crypto')[0]);
const InsufficientBalance = mkMutMsgFinal(m => {
  console.log('!err:', m);
  if (m.indexOf('Insufficient Balance:') !== -1) {
    return 'Insufficient Balance';
  }
  if (m.indexOf('Insufficient balance:') !== -1) {
    return 'Insufficient Balance';
  }
  throw new Error('Token not found');
});
