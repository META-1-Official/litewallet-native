import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ContentSlider, { Backdrop } from '../components/ContentSlider';
import RoundedButton from '../components/RoundedButton';
import { useAppDispatch } from '../hooks';
import { clearFaceKI } from '../store/faceKI/faceKI.reducer';
import { clearSignInInfo } from '../store/signIn/signIn.reducer';
import { clearSignUpState } from '../store/signUp/signUp.reducer';
import { clearWeb3AuthData } from '../store/web3/web3.reducer';
import { colors } from '../styles/colors';
import { RootStackParamList } from '../AuthNav';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const CreateWalletPress = () => navigation.navigate('Legal');
  const LinkWalletPress = () => navigation.navigate('LinkWallet');
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    return navigation.addListener('focus', () => {
      console.log('Wiping store...');
      dispatch(clearSignUpState());
      dispatch(clearWeb3AuthData());
      dispatch(clearFaceKI());
      dispatch(clearSignInInfo());
    });
  }, [navigation]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
      }}
    >
      <Backdrop scrollX={scrollX} />

      <ContentSlider scrollX={scrollX} />
      <View style={{ alignSelf: 'stretch' }}>
        <RoundedButton title="Create META Wallet" onPress={CreateWalletPress} />

        <RoundedButton
          title="Link META Wallet"
          onPress={LinkWalletPress}
          styles={styles.LinkWalletStyle}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  LinkWalletStyle: {
    color: colors.BrandYellow,
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
});

export default WelcomeScreen;
