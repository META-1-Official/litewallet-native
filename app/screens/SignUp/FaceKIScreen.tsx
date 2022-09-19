import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { CameraPermissionStatus } from 'react-native-vision-camera/src/Camera';
import FaceKiCameraView from '../../components/FaceKICameraView';
import { useAppSelector } from '../../hooks';

const FaceKIScreen = () => {
  const [cameraPermission] = useState<CameraPermissionStatus>();
  const { privateKey, firstName, lastName, mobile, accountName, email } = useAppSelector(
    state => state.signUp,
  );

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
      <FaceKiCameraView
        mobile={mobile}
        privateKey={privateKey}
        accountName={accountName}
        email={email}
        firstName={firstName}
        lastName={lastName}
      />
    </View>
  );
};

export default FaceKIScreen;
