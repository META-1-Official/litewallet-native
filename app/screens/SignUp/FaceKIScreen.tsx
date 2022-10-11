import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { CameraPermissionStatus } from 'react-native-vision-camera/src/Camera';
import { RootStackParamList } from '../../AuthNav';
import FaceKiCameraView from '../../components/FaceKICameraView';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { clearFaceKI } from '../../store/signUp/signUp.reducer';

type Props = NativeStackScreenProps<RootStackParamList, 'FaceKI'>;

const FaceKIScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const [cameraPermission] = useState<CameraPermissionStatus>();
  const { privateKey, firstName, lastName, mobile, accountName, email } = useAppSelector(
    state => state.signUp,
  );

  useEffect(() => {
    return navigation.addListener('focus', () => {
      dispatch(clearFaceKI());
    });
  }, [navigation]);

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
