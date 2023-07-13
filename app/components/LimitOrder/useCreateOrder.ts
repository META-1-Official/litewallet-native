import useAppSelector from '../../hooks/useAppSelector';
import { placeLimitOrder } from '../../services/meta1Api';
import { catchError, getPassword, Timeout } from '../../utils';
import { useNewLoaderModal } from '../LoaderModal';
import { useShowModal } from '../SuccessModal';
import { OrderType } from './types';

const useCreateOrder = (toGive: any, toGet: any, type: OrderType) => {
  const loaderModal = useNewLoaderModal();
  const { accountName } = useAppSelector(state => state.wallet);
  const successModal = useShowModal();

  const getAccountInfo = async () => ({
    accountName,
    password: await getPassword(),
  });

  const fn = (price: number, amount: number) => async () => {
    const accountInfo = await getAccountInfo();
    if (!accountInfo.password) {
      return;
    }
    loaderModal.open();
    const to = await Timeout(
      placeLimitOrder(accountInfo as any, {
        toGet,
        toGive,
        totalPrice: type === OrderType.Sell ? price : 1 / price,
        amount,
      }),
      `Place Limit Order - ${type}`,
    );
    loaderModal.close();
    successModal(`Successfully placed ${type} order`, () => {});
    return to;
  };
  return {
    fn: (price: number, amount: number) =>
      catchError(fn(price, amount), {
        anyway: () => {
          loaderModal.close();
          console.log('All done');
        },
        errorMiddleware: (err: Error) => {
          if (err.message === 'Amount equal 0!') {
            err.message = 'Total too small';
          }
          return err;
        },
      }),
  };
};

export default useCreateOrder;
