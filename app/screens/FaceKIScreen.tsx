import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/core';
import { Text, View, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera } from 'react-native-vision-camera';
import { CameraPermissionStatus } from 'react-native-vision-camera/src/Camera';
import { RootNavigationProp } from '../App';
import RoundedButton from '../components/RoundedButton';
import FaceKiCameraView from '../components/FaceKICameraView';

const FaceKIScreen = () => {
  const nav = useNavigation<RootNavigationProp>();
  const onClick = () => nav.navigate('FaceKI');
  const [cameraPermission, setCameraPermission] = useState<CameraPermissionStatus>();

  useEffect(() => {
    const getCameraPermission = async () => {
      const permission = await Camera.getCameraPermissionStatus();
      setCameraPermission(permission);
    };
    getCameraPermission().catch(console.error);
  }, []);

  useEffect(() => {
    if (cameraPermission === 'denied') {
      Linking.openSettings();
    } else if (cameraPermission === 'not-determined') {
      const requestCameraPermission = async () => {
        const permission = await Camera.requestCameraPermission();
        setCameraPermission(permission);
      };
      requestCameraPermission().catch(console.error);
    }
  }, [cameraPermission]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
      }}
    >
      <View style={{ alignSelf: 'stretch' }}>
        <Text>{cameraPermission}</Text>
        {cameraPermission === 'authorized' && <FaceKiCameraView />}
        <RoundedButton title="Capture photo" onPress={onClick} />
      </View>
    </SafeAreaView>
  );
};

export default FaceKIScreen;
