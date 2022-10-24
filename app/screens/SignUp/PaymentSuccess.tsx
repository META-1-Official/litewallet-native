import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import Toast from 'react-native-toast-message';
import { RootStackParamList } from '../../AuthNav';
import Loader from '../../components/Loader';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { useStore } from '../../store';
import { getAccountPaymentStatus, registerAccount } from '../../store/signUp/signUp.actions';

type Props = NativeStackScreenProps<RootStackParamList, 'PaymentSuccess'>;

export const PaymentSuccess = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();
  // todo: move it to actions
  const authorize = useStore(state => state.authorize);
  const { email, accountName, passKey, mobile, lastName, firstName } = useAppSelector(
    state => state.signUp,
  );

  // check payment status
  useEffect(() => {
    dispatch(getAccountPaymentStatus(email))
      .unwrap()
      .then(user => {
        console.log('PromiseResult: ', user);
        if (user && user.status?.isSign) {
          if (user.status?.isPayed || user.status?.isPayedByCrypto) {
            console.log('Payments: ', user.pays);
            // todo: check for user.pays.find((el) => el.customerId === user.status.facekiID
            dispatch(
              registerAccount({
                accountName,
                passKey,
                mobile,
                email,
                firstName,
                lastName,
              }),
            )
              .unwrap()
              .then(registrationStatus => {
                if (registrationStatus) {
                  authorize(accountName, passKey);
                }
              })
              .catch(() => {
                navigation.goBack();
                Toast.show({
                  type: 'error',
                  text1: "Account hasn't been created!",
                  text2: 'Something went wrong!',
                });
              });
          } else {
            navigation.goBack();
            Toast.show({
              type: 'error',
              text1: "Account hasn't been created!",
              text2: 'Please pay 1$ for account',
            });
          }
        } else {
          navigation.goBack();
          Toast.show({
            type: 'error',
            text1: "Account hasn't been created!",
            text2: 'Please sign the document',
          });
        }
      });
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: '#fff',
      }}
    >
      <Loader />
    </SafeAreaView>
  );
};

export default PaymentSuccess;
