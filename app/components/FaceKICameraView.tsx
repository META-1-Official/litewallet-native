import { useNavigation } from '@react-navigation/core';
import React, { useRef, useState } from 'react';
import { View, Text, Platform, Image } from 'react-native';
import { Camera, PhotoFile, useCameraDevices } from 'react-native-vision-camera';
import { RootNavigationProp } from '../AuthNav';
import { useAppDispatch } from '../hooks';
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

const FaceKiCameraView = ({ email }: Props) => {
  const nav = useNavigation<RootNavigationProp>();
  const dispatch = useAppDispatch();
  const devices = useCameraDevices();
  const device = devices.front || devices.back || devices.external || devices.unspecified;
  const [photo, setPhoto] = useState<PhotoFile | undefined>();
  const camera = useRef<Camera>(null);

  const verifyHandler = async () => {
    if (camera?.current) {
      const capture = await takePhoto(camera.current);
      setPhoto(capture);
      dispatch(faceKIVerify({ image: capture.path, email }))
        .unwrap()
        .then(promiseResolvedValue => {
          if (promiseResolvedValue.status === 'error') {
            setPhoto(undefined);
            console.log('Photo has been removed!');
          } else {
            nav.navigate('FaceKISuccess');
            // setTimeout(() => setPhoto(undefined), 200);
          }
        })
        .catch(promiseRejectedValue => {
          console.log('Something went wrong!', promiseRejectedValue);
          setPhoto(undefined);
          console.log('Photo has been removed!');
        });
    } else {
      console.warn('Camera is not available');
    }
  };

  if (device == null) {
    return <Text>Camera is not ready. Loading...</Text>;
  }

  if (photo) {
    return (
      <>
        <Image
          style={{
            width: '100%',
            height: '115%',
            position: 'absolute',
          }}
          source={{
            uri: Platform.OS === 'android' ? `file://${photo.path}` : photo?.path,
          }}
        />
        <Loader />
      </>
    );
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
