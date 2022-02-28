import React from 'react';
import { SafeAreaView, Text } from 'react-native';
import { useNewLoaderModal } from '../components/LoaderModal';
import { useStore } from '../store';
import { catchError, Timeout } from '../utils';
import RoundedButton from '../components/RoundedButton';
import { useShowModal } from '../components/SuccessModal';
const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(() => resolve(), ms));

export const useCreateOrder = () => {
  const loader = useNewLoaderModal();
  const { accountName, password } = useStore();
  const modal = useShowModal();
  console.log(accountName, password);
  const fn = () => async () => {
    loader.open();
    const to = await Timeout(sleep(5000), `Sheesh`);
    loader.close();
    modal('Done!', () => {});
    return to;
  };
  return {
    fn: () =>
      catchError(fn(), {
        anyway: () => {},
        errorMiddleware: (err: Error) => {
          if (err.message === 'Amount equal 0!') {
            err.message = 'Total too small';
          }
          return err;
        },
      }),
  };
};

const Sandbox = () => {
  const { fn } = useCreateOrder();
  return (
    <>
      <SafeAreaView>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}> Sandbox </Text>
        <Text> Node env: {process.env.NODE_ENV}</Text>
        <RoundedButton title="Show loader modal for 5 second" onPress={() => fn()} />
      </SafeAreaView>
    </>
  );
};

export default Sandbox;
