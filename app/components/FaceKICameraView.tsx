import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
// import { launchImageLibrary } from 'react-native-image-picker';
import faceKIAPI from '../services/faceKI/faceKI.service';
import styles from './FaceKICameraView.styles';

const FaceKiCameraView = () => {
  const devices = useCameraDevices();
  const device = devices.front;
  const [photo, setPhoto] = useState<any>(false);

  useEffect(() => {
    (async () => {
      // const result = await launchImageLibrary({ mediaType: 'photo' });
      // @ts-ignore
      // setPhoto(result);
    })();
  }, []);

  useEffect(() => {
    if (photo) {
      faceKIAPI.enrollUser({ name: 'Alek', image: photo }).then(() => {});
    }
  }, [photo]);

  if (device == null) {
    return <Text>Camera is not ready. Loading...</Text>;
  }

  return <Camera style={styles.image} device={device} isActive={true} />;
};

export default FaceKiCameraView;
