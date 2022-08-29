import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image } from 'react-native';
import { Camera, PhotoFile, useCameraDevices } from 'react-native-vision-camera';
import { RootNavigationProp } from '../App';
// import { launchImageLibrary } from 'react-native-image-picker';
import faceKIAPI from '../services/faceKI/faceKI.service';
import { livelinessCheck, verifyUser } from '../store/faceKI/faceKI.actions';
import styles from './FaceKICameraView.styles';
import RoundedButton from './RoundedButton';

const FaceKiCameraView = ({ mobile, privateKey, accountName }) => {
  const devices = useCameraDevices();
  const device = devices.front;
  const [photo, setPhoto] = useState<any>(false);
  const nav = useNavigation<RootNavigationProp>();
  const camera = useRef<Camera>(null);

  // useEffect(() => {
  //   (async () => {
  // const result = await launchImageLibrary({ mediaType: 'photo' });
  // @ts-ignore
  // setPhoto(result);
  // })();
  // }, []);

  // useEffect(() => {
  //   if (photo) {
  //     faceKIAPI.enrollUser({ name: 'Alek', image: photo }).then(() => {});
  //   }
  // }, [photo]);

  if (device == null) {
    return <Text>Camera is not ready. Loading...</Text>;
  }

  const verifyHandler = async () => {
    if (camera?.current) {
      const capture: PhotoFile = await camera.current.takePhoto();
      setPhoto(capture);

      const image = capture.path;
      console.log('!!!Photo captured');
      console.log('!Path: ', capture.path);

      console.log('!!!Before liveness checking');
      const livelinessStatus = await faceKIAPI.livelinessCheck({ image });
      console.log('!!!After liveness checking');

      if (livelinessStatus.data.liveness === 'Spoof') {
        console.warn('!!!Spoof - Try again');
        nav.goBack();
      } else {
        console.log('!!!!! before verify');
        const verifyStatus = await faceKIAPI.verifyUser({ image });
        console.log('!!!!! after verify');

        if (verifyStatus.data.status === 'Verify OK' && verifyStatus.data.name === mobile) {
          console.log('You have been already enrolled!');
          console.log('!!!!!!!!Response:', verifyStatus);
          nav.navigate('FaceKISuccess', {
            status: verifyStatus.data,
            path: capture.path,
            accountName,
            privateKey,
          });
        } else {
          console.log('!!!!! before enrolled');
          const enrollStatus = await faceKIAPI.enrollUser({ image, name: mobile });
          console.log('!!!!! after enrolled');

          if (enrollStatus.data.status === 'Enroll OK') {
            console.log('User has been successfully enrolled!');
            nav.navigate('FaceKISuccess', {
              status: enrollStatus.data,
              path: capture.path,
              accountName,
              privateKey,
            });
          } else {
            nav.goBack();
          }
        }
      }
    } else {
      console.warn('Camera is not available');
    }
  };

  return (
    <View style={styles.container}>
      {!photo && (
        <Camera style={styles.camera} ref={camera} device={device} isActive={true} photo={true} />
      )}
      {photo && <Image style={{ width: '100%', height: '115%' }} source={{ uri: photo.path }} />}
      {!photo && (
        <>
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
      {photo && <Text style={{ position: 'absolute', bottom: 40 }}>Loading...</Text>}
    </View>
  );
};

export default FaceKiCameraView;
