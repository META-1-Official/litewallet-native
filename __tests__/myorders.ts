import { FullHistoryOrder, getHistoricalOrders } from '../app/services/meta1Api';
import Meta1, { iLimitOrder } from '../app/utils/meta1dexTypes';
import config from '../app/config';
import { isOpen, isResolved } from '../app/utils/historyUtils';
import { canceledFrozen, expired, filledFake, filledFrozen, openFrozen } from './frozenData';

// Temporarily override console.log
const consoleLogHook = async (fn: () => any) => {
  const oConsoleLog = console.log;
  console.log = () => {};
  await fn();
  console.log = oConsoleLog;
};

let open: iLimitOrder[];
let openAsHistory: FullHistoryOrder = new Map();
describe('Correctly Reject orders', () => {
  beforeAll(async () => {
    await consoleLogHook(async () => await Meta1.connect(config.META1_CONNECTION_URL));
    open = await Meta1.db.get_limit_orders('META1', 'USDT', 1);

    while (openAsHistory.size === 0) {
      const seller: string = open.pop()!.seller;
      openAsHistory = await getHistoricalOrders(seller);
    }

    const first = [...openAsHistory.values()][0];
    const id = first.order.limit_order_create_operation.result.object_id_type;
    open = [{ id } as any];
  });

  afterAll(async () => {
    await consoleLogHook(async () => await Meta1.disconnect());
  });
  describe('isOpen', () => {
    it('Accepts open order', async () => {
      const v = openAsHistory.get(open[0].id)!;
      const { canceled, filled } = v;
      const order = v.order.limit_order_create_operation;
      const ret = isOpen(canceled, filled, order);
      expect(ret).toBe(false);
    });

    it('Accepts open order (frozen)', () => {
      const v = openFrozen as any;
      const { canceled, filled } = v;
      const order = v.order.limit_order_create_operation;
      const ret = isOpen(canceled, filled, order);
      expect(ret).toBe(false);
    });

    it('Rejects canceled order', async () => {
      const v = [...openAsHistory.entries()].find(e => e[1].canceled)![1];
      const { canceled, filled } = v;
      const order = v.order.limit_order_create_operation;
      const ret = isOpen(canceled, filled, order);
      expect(ret).toBe(true);
    });

    it('Rejects canceled order (frozen)', async () => {
      const v = canceledFrozen as any;
      const { canceled, filled } = v;
      const order = v.order.limit_order_create_operation;
      const ret = isOpen(canceled, filled, order);
      expect(ret).toBe(true);
    });

    it('Rejects filled order', async () => {
      const v = [...openAsHistory.entries()].find(e => e[1].filled.length)![1];
      const { canceled, filled } = v;
      const order = v.order.limit_order_create_operation;
      const ret = isOpen(canceled, filled, order);
      expect(ret).toBe(true);
    });

    it('Rejects filled order (frozen)', async () => {
      const v = filledFrozen as any;
      const { canceled, filled } = v;
      const order = v.order.limit_order_create_operation;
      const ret = isOpen(canceled, filled, order);
      expect(ret).toBe(true);
    });
    it('Rejects filled order (fake)', async () => {
      const v = filledFake as any;
      const { canceled, filled } = v;
      const order = v.order.limit_order_create_operation;
      const ret = isOpen(canceled, filled, order);
      expect(ret).toBe(true);
    });
    it('Rejects expired order (fake)', async () => {
      const v = expired as any;
      const { canceled, filled } = v;
      const order = v.order.limit_order_create_operation;
      const ret = isOpen(canceled, filled, order);
      expect(ret).toBe(true);
    });
  });
  //----------------
  describe('isResolved', () => {
    it('Rejects open order', async () => {
      const v = openAsHistory.get(open[0].id)!;
      const { canceled, filled } = v;
      const order = v.order.limit_order_create_operation;
      const ret = isResolved(canceled, filled, order);
      expect(ret).toBe(true);
    });

    it('Rejects open order (frozen)', () => {
      const v = openFrozen as any;
      const { canceled, filled } = v;
      const order = v.order.limit_order_create_operation;
      const ret = isResolved(canceled, filled, order);
      expect(ret).toBe(true);
    });

    it('Accepts canceled order', async () => {
      const v = [...openAsHistory.entries()].find(e => e[1].canceled)![1];
      const { canceled, filled } = v;
      const order = v.order.limit_order_create_operation;
      const ret = isResolved(canceled, filled, order);
      expect(ret).toBe(false);
    });

    it('Accepts canceled order (frozen)', async () => {
      const v = canceledFrozen as any;
      const { canceled, filled } = v;
      const order = v.order.limit_order_create_operation;
      const ret = isResolved(canceled, filled, order);
      expect(ret).toBe(false);
    });

    it('Accepts filled order', async () => {
      const v = [...openAsHistory.entries()].find(e => e[1].filled.length)![1];
      const { canceled, filled } = v;
      const order = v.order.limit_order_create_operation;
      const ret = isResolved(canceled, filled, order);
      expect(ret).toBe(false);
    });

    it('Accepts filled order (frozen)', async () => {
      const v = filledFrozen as any;
      const { canceled, filled } = v;
      const order = v.order.limit_order_create_operation;
      const ret = isResolved(canceled, filled, order);
      expect(ret).toBe(false);
    });
    it('Accepts filled order (fake)', async () => {
      const v = filledFake as any;
      const { canceled, filled } = v;
      const order = v.order.limit_order_create_operation;
      const ret = isResolved(canceled, filled, order);
      expect(ret).toBe(false);
    });
    it('Accepts expired order (fake)', async () => {
      const v = expired as any;
      const { canceled, filled } = v;
      const order = v.order.limit_order_create_operation;
      const ret = isResolved(canceled, filled, order);
      expect(ret).toBe(false);
    });
  });
});
