import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/core';
import { Text, View, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera } from 'react-native-vision-camera';
import { CameraPermissionStatus } from 'react-native-vision-camera/src/Camera';
import { RootNavigationProp } from '../App';
import RoundedButton from '../components/RoundedButton';
import FaceKiCameraView from '../components/FaceKICameraView';

const FaceKIScreen = ({ route, navigation }) => {
  const nav = useNavigation<RootNavigationProp>();
  const onClick = () => nav.navigate('FaceKI');
  const [cameraPermission, setCameraPermission] = useState<CameraPermissionStatus>();
  const { key, firstName, lastName, mobile, accountName } = route.params;

  // useEffect(() => {
  //   const getCameraPermission = async () => {
  //     const permission = await Camera.getCameraPermissionStatus();
  //     setCameraPermission(permission);
  //   };
  //   getCameraPermission().catch(console.error);
  // }, []);
  //
  // useEffect(() => {
  //   if (cameraPermission === 'denied') {
  //     Linking.openSettings();
  //   } else if (cameraPermission === 'not-determined') {
  //     const requestCameraPermission = async () => {
  //       const permission = await Camera.requestCameraPermission();
  //       setCameraPermission(permission);
  //     };
  //     requestCameraPermission().catch(console.error);
  //   }
  // }, [cameraPermission]);

  return (
    <View
      style={{
        flex: 1,
        height: '100%',
        width: '100%',
        position: 'absolute',
        left: 0,
        top: 0,
        paddingBottom: 40,
      }}
    >
      <Text>{cameraPermission}</Text>
      {/*{cameraPermission === 'authorized' && <FaceKiCameraView />}*/}
      <FaceKiCameraView mobile={mobile} />
    </View>
  );
};

export default FaceKIScreen;
