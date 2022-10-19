import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text } from 'react-native';
import { Camera, PhotoFile, useCameraDevices } from 'react-native-vision-camera';
import { RootNavigationProp } from '../AuthNav';
import { useAppDispatch, useAppSelector } from '../hooks';
import { faceKIVerify } from '../store/signUp/signUp.actions';
import styles from './FaceKICameraView.styles';
import Loader from './Loader';
import RoundedButton from './RoundedButton';

interface Props {
  firstName: string;
  lastName: string;
  accountName: string;
  mobile: string;
  email: string;
  privateKey: string;
}

const FaceKiCameraView = ({ email }: Props) => {
  const nav = useNavigation<RootNavigationProp>();
  const dispatch = useAppDispatch();
  const devices = useCameraDevices();
  const device = devices.front;
  const [photo, setPhoto] = useState<any>(false);
  const camera = useRef<Camera>(null);
  const { faceKIStatus } = useAppSelector(state => state.signUp);

  useEffect(() => {
    if (faceKIStatus) {
      nav.navigate('FaceKISuccess');
      setTimeout(() => setPhoto(false), 200);
    }
  }, [faceKIStatus, nav]);

  if (device == null) {
    return <Text>Camera is not ready. Loading...</Text>;
  }

  const verifyHandler = async () => {
    if (camera?.current) {
      const capture: PhotoFile = await camera.current.takePhoto();
      setPhoto(capture);

      const image = capture.path;
      dispatch(faceKIVerify({ image, email }));
    } else {
      console.warn('Camera is not available');
    }
  };

  if (photo) {
    return <Loader />;
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
          />
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
              Next, we will setup your Biometric two factor authentication, to ensure the security
              of your wallet
            </Text>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
              <RoundedButton styles={{ flex: 1 }} title="Cancel" onPress={() => nav.goBack()} />
              <RoundedButton styles={{ flex: 1 }} title="Verify" onPress={verifyHandler} />
            </View>
          </View>
        </>
      )}
    </View>
  );
};

export default FaceKiCameraView;
