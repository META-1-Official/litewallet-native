import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import WebView from 'react-native-webview';
import { RootStackParamList } from '../../AuthNav';
import FaceKiCameraView from '../../components/FaceKICameraView';
import Loader from '../../components/Loader';
import { useAppDispatch, useAppSelector } from '../../hooks';
import useCameraPermission from '../../hooks/useCameraPermission';
import { getFASToken, getFASMigrationStatus } from '../../store/faceKI/faceKI.actions';
import { clearFaceKI } from '../../store/faceKI/faceKI.reducer';

const CAMERA_PERMISSION_STATUS_AUTHORIZED = 'authorized';

type Props = NativeStackScreenProps<RootStackParamList, 'FaceKI'>;

const FaceKIScreen: React.FC<Props> = () => {
  const dispatch = useAppDispatch();
  const wvRef = useRef<WebView | null>(null);
  const { privateKey, email } = useAppSelector(state => state.web3);
  const { token } = useAppSelector(state => state.faceKI);
  const { accountName: signUpAccountName } = useAppSelector(state => state.signUp);
  const { accountName: signInAccountName } = useAppSelector(state => state.signIn);
  const isSigning = !!signInAccountName;
  const [task, setTask] = useState<'verify' | 'register'>(isSigning ? 'verify' : 'register');
  const account = signInAccountName || signUpAccountName;

  const cameraPermission = useCameraPermission();
  const isCameraAvailable = cameraPermission === CAMERA_PERMISSION_STATUS_AUTHORIZED;

  useEffect(() => {
    dispatch(clearFaceKI());
    dispatch(getFASMigrationStatus('alex-30@yopmail.com'))
      .unwrap()
      .then(({ doesUserExistsInFAS, wasUserEnrolledInOldBiometric }) => {
        // case of migration
        if (!doesUserExistsInFAS && wasUserEnrolledInOldBiometric) {
          dispatch(getFASToken({ account, email, task }));
        } else {
          dispatch(getFASToken({ account, email, task }));
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
          injectedJavaScript={''}
          onMessage={event => {
            console.log('NATIVEAPP >>>>', event.nativeEvent.data);
          }}
          onError={() => {}}
          onRenderProcessGone={() => {}}
        />
      )}
    </View>
  );
};

export default FaceKIScreen;
