import { ErrorParser } from '../app/utils/errorUtils';

describe('Test blockchain error parsing', () => {
  it('Handle insufficient balance error', () => {
    const err = new Error(
      "Execution error: Assert Exception: abo->get_balance() >= -delta: Insufficient Balance: alina-dcruz's balance of 0 META1 is less than required 0.00002 META1 bitshares-crypto bshdfuslahjdfhasldjkfhasdf",
    );
    const res = ErrorParser(err);
    expect(res.message).toBe(
      "Insufficient Balance: alina-dcruz's balance of 0 META1 is less than required 0.00002 META1",
    );
  });

  it('Handle other error', () => {
    const err = new Error(
      'Execution error: Assert Exception: abo->get_balance() >= -delta bitshares-crypto bshdfuslahjdfhasldjkfhasdf',
    );
    const res = ErrorParser(err);
    expect(res.message).toBe('Execution error: Assert Exception: abo->get_balance() >= -delta');
  });

  it('Handle non-chain error', () => {
    const txt = 'Bruh momento erroro';
    const err = new Error(txt);
    const res = ErrorParser(err);
    expect(res.message).toBe(txt);
  });
});
