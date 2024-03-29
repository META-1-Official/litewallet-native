import React, { useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { useNewLoaderModal } from '../components/LoaderModal';
import { Options, useOptions, useStore } from '../store';
import { catchError, Timeout } from '../utils';
import RoundedButton from '../components/RoundedButton';
import { useShowModal } from '../components/SuccessModal';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { NETWORK } from '@env';
import RNRestart from 'react-native-restart';
import { CountryPicker } from '../components/CountryPicker';
import { getToken, signUp } from '../services/litewalletApi';

const resolves = (ms: number) => new Promise<void>(resolve => setTimeout(() => resolve(), ms));
const rejects = (ms: number) => new Promise<void>((_, reject) => setTimeout(() => reject(), ms));

export const useCreateOrder = (exec: any) => {
  const loader = useNewLoaderModal();
  const { accountName, password } = useStore();
  const modal = useShowModal();
  console.log(accountName, password);
  const fn = () => async () => {
    loader.open();
    const to = await Timeout(exec(5000), 'Sheesh');
    loader.close();
    loader.close = () => console.log('NOPE');
    modal('Done!', () => {});
    return to;
  };
  return {
    fn: () =>
      catchError(fn(), {
        anyway: () => {
          console.log('Should close');
          console.log(loader.close);
          loader.close();
        },
        errorMiddleware: (err: Error) => {
          if (err && err.message === 'Amount equal 0!') {
            err.message = 'Total too small';
          }
          return err;
        },
      }),
  };
};

const DoDa = () => {
  const [on, setOn] = useState(true);
  return (
    <>
      <RoundedButton title="Set enabled" onPress={() => setOn(false)} />
      <RoundedButton title="Set disabled" onPress={() => setOn(true)} disabled={on} />
    </>
  );
};
const Sandbox = () => {
  const nav = useNavigation<any>();
  const ok = useCreateOrder(resolves);
  const err = useCreateOrder(rejects);
  const [country, setCountry] = useState('none');
  const { accountName, password } = useStore();
  const { firstTimeSet } = useOptions();
  return (
    <>
      <SafeAreaView>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}> Sandbox </Text>
        <Text> Node env: {process.env.NODE_ENV}</Text>
        <Text> isTestnet: {(NETWORK === 'TESTNET').toString()}</Text>
        <Text> Options: {JSON.stringify(Options(), null, 4)}</Text>
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          <RoundedButton title="Show modal" onPress={() => nav.navigate('SbxModal')} />
          <RoundedButton
            title="Show loader modal for 5 second (resolves)"
            onPress={() => ok.fn()}
          />
          <RoundedButton
            title="Show loader modal for 5 second (throws)"
            onPress={() => err.fn()}
          />
          <DoDa />
          <RoundedButton title="Restart app" onPress={() => RNRestart.Restart()} />
          <Text> Country Picker Res: {country}</Text>
          <RoundedButton
            title="Show Country picker"
            onPress={() =>
              nav.navigate('CountryPickerModal', {
                callback: (s: any) => setCountry(s),
              })
            }
          />
          <RoundedButton title="Set first time true" onPress={() => firstTimeSet(true)} />
          <RoundedButton
            title="Login"
            onPress={() =>
              getToken({
                accountName,
                password,
              })
                .then(e => console.log(e))
                .catch(e => console.log(e))
            }
          />
          <RoundedButton
            title="SignuUp"
            onPress={() =>
              signUp({
                accountName,
              })
                .then(e => console.log(e))
                .catch(e => console.log(e))
            }
          />
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const SandboxModal = () => {
  const nav = useNavigation();
  const ok = useCreateOrder(resolves);
  const err = useCreateOrder(rejects);

  return (
    <View
      style={{
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.3)',
      }}
    >
      <SafeAreaView style={{ height: '100%' }}>
        <Pressable onPress={() => nav.goBack()} style={{ height: '50%' }} />
        <View
          style={{
            height: '50%',
            marginTop: 'auto',
            backgroundColor: '#fff',
            borderRadius: 32,
            padding: 24,
          }}
        >
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Sandbox Modal</Text>
          <RoundedButton
            title="Show loader modal for 5 second (resolves)"
            onPress={() => ok.fn()}
          />
          <RoundedButton
            title="Show loader modal for 5 second (throws)"
            onPress={() => err.fn()}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

const Stack = createStackNavigator();
const SandboxNav = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Sandbox} />
      <Stack.Screen
        name="SbxModal"
        component={SandboxModal}
        options={{ presentation: 'transparentModal', headerShown: false }}
      />
      <Stack.Screen
        name="CountryPickerModal"
        component={CountryPicker}
        initialParams={{ callback: (res: any) => console.log(res) }}
        options={{ presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
};

export default SandboxNav;
