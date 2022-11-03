import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { SafeAreaView, ScrollView, View } from 'react-native';
import SignatureView, { SignatureViewRef } from 'react-native-signature-canvas';
import { RootStackParamList } from '../../AuthNav';
import RoundedButton from '../../components/RoundedButton';
import { required } from '../../utils/useFormHelper/rules';
import styles, { webStyle } from './ESignatureFormScreen.styles';
import { Heading } from '../../components/typography';
import { useAppSelector } from '../../hooks';
import { Input } from '../../utils/useFormHelper/useFormHelper';

type Props = NativeStackScreenProps<RootStackParamList, 'ESignatureForm'>;

import config from '../../config';

export const ESignatureFormScreen: React.FC<Props> = () => {
  console.log(config);
  const signatureRef = useRef<SignatureViewRef>(null);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const { firstName, lastName, mobile, accountName } = useAppSelector(state => state.signUp);
  const { email } = useAppSelector(state => state.web3);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      name: `${firstName} ${lastName}`,
      walletName: accountName,
      email,
      phone: mobile,
      street: '',
      city: '',
      state: '',
      zipCode: '',
    },
  });

  const handleConfirm = handleSubmit(() => {
    signatureRef.current?.readSignature();
  });

  const handleOK = (signature: string) => {
    console.log('OK', signature);
  };

  const handleEmpty = () => {
    console.log('Empty');
  };

  const handleClear = () => {
    signatureRef.current?.clearSignature();
    console.log('clear success!');
  };

  const handleBegin = () => {
    setScrollEnabled(false);
  };

  const handleEnd = () => {
    setScrollEnabled(true);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: '#fff',
      }}
    >
      <ScrollView
        contentContainerStyle={{
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
        scrollEnabled={scrollEnabled}
      >
        <View style={{ marginHorizontal: 24 }}>
          <Heading style={{ marginBottom: 8 }}>Draw Signature</Heading>

          <View>
            <View style={styles.row}>
              <View style={styles.rowHalf}>
                <Input control={control} name="name" label="Name" rules={{ required }} />
              </View>
              <View style={styles.rowHalf}>
                <Input control={control} name="walletName" label="Wallet Name" />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.rowHalf}>
                <Input control={control} name="email" label="Email" rules={{ required }} />
              </View>
              <View style={styles.rowHalf}>
                <Input control={control} name="phone" label="PhoneNumber" rules={{ required }} />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.rowHalf}>
                <Input control={control} name="street" label="Street" rules={{ required }} />
              </View>
              <View style={styles.rowHalf}>
                <Input control={control} name="city" label="City" rules={{ required }} />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.rowHalf}>
                <Input control={control} name="state" label="State" rules={{ required }} />
              </View>
              <View style={styles.rowHalf}>
                <Input control={control} name="zipCode" label="Zip Code" rules={{ required }} />
              </View>
            </View>
            <View
              style={{
                borderWidth: 1,
                borderColor: '#000000',
                backgroundColor: '#000000',
              }}
            >
              <SignatureView
                ref={signatureRef}
                webStyle={webStyle}
                style={{ height: 150 }}
                onOK={handleOK}
                onBegin={handleBegin}
                onEnd={handleEnd}
                onEmpty={handleEmpty}
              />
            </View>
            <View style={styles.buttonRow}>
              <RoundedButton title="Clear" onPress={handleClear} />
              <RoundedButton title="Sign" onPress={handleConfirm} disabled={isSubmitting} />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ESignatureFormScreen;
