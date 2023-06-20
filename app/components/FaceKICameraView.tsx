import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Platform, ImageBackground } from 'react-native';
import Toast from 'react-native-toast-message';
import { Camera, CameraDevice, PhotoFile, useCameraDevices } from 'react-native-vision-camera';
import { RootNavigationProp } from '../AuthNav';
import { useAppDispatch, useAppSelector } from '../hooks';
import { useStore } from '../store';
import { faceKIVerifyOnSignup, faceKIVerifyOnSignIn } from '../store/faceKI/faceKI.actions';
import { login } from '../store/signIn/signIn.actions';
import { authorize } from '../store/wallet/wallet.reducers';
import styles from './FaceKICameraView.styles';
import Loader from './Loader';
import RoundedButton from './RoundedButton';
import { faceFrameAsset } from '../../assets/';

interface Props {
  email: string;
  privateKey: string;
}

const takePhoto = async (camera: Camera) => {
  if (Platform.OS === 'android') {
    const capture: PhotoFile = await camera.takeSnapshot({
      quality: 50,
      skipMetadata: true,
    });
    if (capture) {
      return capture;
    }
  }
  return await camera.takePhoto({
    qualityPrioritization: 'speed',
    skipMetadata: true,
  });
};

const FaceKiCameraView = ({ email, privateKey }: Props) => {
  const nav = useNavigation<RootNavigationProp>();
  const dispatch = useAppDispatch();
  const auth = useStore(state => state.authorize);
  const [cameraDevice, setCameraDevice] = useState<CameraDevice | undefined>();
  const devices = useCameraDevices();
  const device =
    cameraDevice || devices.front || devices.back || devices.external || devices.unspecified;
  const [photo, setPhoto] = useState<PhotoFile | undefined>();
  const camera = useRef<Camera>(null);
  const { accountName: signUpAccountName } = useAppSelector(state => state.signUp);
  const { accountName: signInAccountName } = useAppSelector(state => state.signIn);
  const { idToken, appPubKey } = useAppSelector(state => state.web3);
  const isSigning = !!signInAccountName;
  const accountName = signInAccountName || signUpAccountName;

  useEffect(() => {
    if (Platform.OS === 'android') {
      Camera.getAvailableCameraDevices().then(availableDevices => {
        const frontDevices = availableDevices.filter(dev => dev.position === 'front');
        const wideAngleCamera = frontDevices.filter(dev =>
          dev.devices.includes('ultra-wide-angle-camera'),
        );
        setCameraDevice(wideAngleCamera[0]);
      });
    }
  }, []);

  const loginHandler = () => {
    dispatch(login({ accountName, email, idToken, appPubKey }))
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

  const verifyHandler = async () => {
    if (camera?.current) {
      const capture = await takePhoto(camera.current);
      setPhoto(capture);
      try {
        const params = {
          image: capture.path,
          email,
          privateKey,
          accountName,
        };
        const actionVerify = isSigning ? faceKIVerifyOnSignIn : faceKIVerifyOnSignup;
        dispatch(actionVerify(params))
          .unwrap()
          .then(promiseResolvedValue => {
            if (promiseResolvedValue.status === 'error') {
              setPhoto(undefined);
              console.log('Photo has been removed!');
            } else {
              if (isSigning) {
                loginHandler();
              } else {
                nav.navigate('FaceKISuccess');
                setTimeout(() => setPhoto(undefined), 200);
              }
            }
          })
          .catch(promiseRejectedValue => {
            console.log('Something went wrong!', promiseRejectedValue);
            setPhoto(undefined);
            console.log('Photo has been removed!');
          });
      } catch (err) {
        console.error('!ERROR: ', err);
      }
    } else {
      console.warn('Camera is not available');
    }
  };

  if (device == null) {
    return <Text>Camera is not ready. Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      {!photo && (
        <>
          <Camera
            style={styles.camera}
            ref={camera}
            device={device}
            isActive={true}
            photo={true}
            preset={Platform.OS === 'android' ? 'medium' : 'high'}
          />
          <ImageBackground source={faceFrameAsset} resizeMode="cover" style={styles.faceFrame} />
          <View style={{ position: 'absolute', top: 20 }}>
            <Text style={{ color: '#fff', fontSize: 22, textAlign: 'center', lineHeight: 30 }}>
              Bio-Metric 2 Factor Authentication
            </Text>
            <Text style={{ color: '#fff', fontSize: 16, textAlign: 'center', lineHeight: 30 }}>
              Position your face in the oval
            </Text>
          </View>
          <View style={styles.frame}>
            <View style={styles.leftTop} />
            <View style={styles.rightTop} />
            <View style={styles.leftBottom} />
            <View style={styles.rightBottom} />
          </View>

          <View
            style={{
              position: 'absolute',
              bottom: 0,
            }}
          >
            <Text
              style={{
                color: '#FFC000',
                fontSize: 16,
                textAlign: 'center',
                lineHeight: 22,
                paddingBottom: 20,
              }}
            >
              Please authenticate your biometrics to complete {isSigning ? 'log in.' : 'sign up.'}
            </Text>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
              <RoundedButton styles={{ flex: 1 }} title="Cancel" onPress={() => nav.goBack()} />
              <RoundedButton styles={{ flex: 1 }} title="Verify" onPress={verifyHandler} />
            </View>
          </View>
        </>
      )}
      {photo && <Loader />}
    </View>
  );
};

export default FaceKiCameraView;
