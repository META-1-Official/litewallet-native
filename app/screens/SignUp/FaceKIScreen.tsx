import { useNavigation } from '@react-navigation/core';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import Toast from 'react-native-toast-message';
import WebView from 'react-native-webview';
import { RootNavigationProp, RootStackParamList } from '../../AuthNav';
import Loader from '../../components/Loader';
import { useAppDispatch, useAppSelector } from '../../hooks';
import useCameraPermission from '../../hooks/useCameraPermission';
import { TASK } from '../../services/litewallet.services';
import { useStore } from '../../store';
import { fasEnroll, getFASMigrationStatus, getFASToken } from '../../store/faceKI/faceKI.actions';
import { clearFaceKI, setFasToken } from '../../store/faceKI/faceKI.reducer';
import { login } from '../../store/signIn/signIn.actions';
import { authorize } from '../../store/wallet/wallet.reducers';

const CAMERA_PERMISSION_STATUS_AUTHORIZED = 'authorized';

type Props = NativeStackScreenProps<RootStackParamList, 'FaceKI'>;

const FaceKIScreen: React.FC<Props> = () => {
  const nav = useNavigation<RootNavigationProp>();
  const dispatch = useAppDispatch();
  const auth = useStore(state => state.authorize);
  const wvRef = useRef<WebView | null>(null);
  const { privateKey: privKey, email, idToken, appPubKey } = useAppSelector(state => state.web3);
  const { token } = useAppSelector(state => state.faceKI);
  const { accountName: signUpAccountName } = useAppSelector(state => state.signUp);
  const { accountName: signInAccountName } = useAppSelector(state => state.signIn);
  const isSigning = !!signInAccountName;
  const accountName = signInAccountName || signUpAccountName;
  const [task, setTask] = useState<TASK>(isSigning ? TASK.VERIFY : TASK.REGISTER);

  const cameraPermission = useCameraPermission();
  const isCameraAvailable = cameraPermission === CAMERA_PERMISSION_STATUS_AUTHORIZED;

  const loginHandler = (fasToken: string) => {
    dispatch(login({ accountName, email, idToken, appPubKey, fasToken }))
      .unwrap()
      .then(loginDetails => {
        console.log('Logged in successfully! loginDetails: ', loginDetails);
        dispatch(authorize({ accountName, email, token: loginDetails.token }));
        auth();
      })
      .catch(error => {
        Toast.show({
          type: 'error',
          text1: 'Something went wrong!',
          text2: 'Try to login again.',
        });
        console.error(error);
      });
  };

  useEffect(() => {
    dispatch(clearFaceKI());
    dispatch(getFASMigrationStatus(email))
      .unwrap()
      .then(({ doesUserExistsInFAS, wasUserEnrolledInOldBiometric }) => {
        // in case of verify
        if (task === TASK.VERIFY) {
          if (!doesUserExistsInFAS) {
            if (wasUserEnrolledInOldBiometric) {
              // if user doesn't exist in new biometric and exists in old biometric
              // TODO: FAS Migration
              dispatch(getFASToken({ account: accountName, email, task }));
            } else {
              // if user doesn't exist in new and old biometric
              // TODO: Account Migration from old blockchain
              dispatch(getFASToken({ account: accountName, email, task }));
            }
          } else {
            // if user exists in new biometric
            dispatch(getFASToken({ account: accountName, email, task }));
          }
        } else {
          // case of register
          if (!doesUserExistsInFAS) {
            // if user doesn't exist in new biometric | usual registration
            dispatch(getFASToken({ account: accountName, email, task: TASK.REGISTER }));
          } else {
            // if user exists in new biometric | verify instead of register
            setTask(TASK.VERIFY);
            dispatch(getFASToken({ account: accountName, email, task: TASK.VERIFY }));
          }
        }
      });
  }, []);

  useEffect(() => {
    console.log(token);
  }, [token]);

  const isReady = isCameraAvailable && task && email && token;

  return (
    <View
      style={{
        flex: 1,
        height: '110%',
        width: '100%',
        position: 'absolute',
        left: 0,
        top: 0,
        paddingBottom: 40,
      }}
    >
      {!isReady && <Loader />}
      {isReady && (
        <WebView
          ref={wvRef}
          source={{
            uri: `https://bio-int.dev.cryptomailsvc.io?task=${task}&email=${email}&token=${token}`,
          }}
          originWhitelist={['*']}
          mediaPlaybackRequiresUserAction={false}
          allowsInlineMediaPlayback={true}
          domStorageEnabled={true}
          javaScriptEnabled={true}
          injectedJavaScript={''}
          onMessage={event => {
            const { data } = JSON.parse(event.nativeEvent.data);
            console.log('>>>>', data);
            if (data.message === 'success' && data.token) {
              console.log('asd!!!');
              dispatch(setFasToken(data.token));
              if (isSigning) {
                // case of login
                console.log('login');
                loginHandler(data.token);
              } else {
                // case of registration
                if (task === TASK.REGISTER) {
                  // case of registration new account for new email
                  dispatch(fasEnroll({ email, privKey, fasToken: data.token }))
                    .unwrap()
                    .then(({ message }) => {
                      if (message === 'Successfully Enrolled') {
                        Toast.show({ type: 'success', text1: message });
                        nav.navigate('Passkey');
                      } else {
                        console.error(message);
                        Toast.show({ type: 'error', text1: message });
                      }
                    })
                    .catch(error => {
                      console.error(error);
                      Toast.show({ type: 'error', text1: 'Biometric Server Error' });
                    });
                } else {
                  // case when register new account for the same email
                  nav.navigate('Passkey');
                }
              }
            }
          }}
          onError={() => {
            console.log('on Error');
          }}
          onRenderProcessGone={() => {}}
        />
      )}
    </View>
  );
};

export default FaceKIScreen;
