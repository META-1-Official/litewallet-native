import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { RootStackParamList } from '../../AuthNav';
import FaceKiCameraView from '../../components/FaceKICameraView';
import Loader from '../../components/Loader';
import { useAppDispatch, useAppSelector } from '../../hooks';
import useCameraPermission from '../../hooks/useCameraPermission';
import { faceKIAuth } from '../../store/faceKI/faceKI.actions';
import { clearFaceKI } from '../../store/faceKI/faceKI.reducer';

type Props = NativeStackScreenProps<RootStackParamList, 'FaceKI'>;

const FaceKIScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();

  const { privateKey, email } = useAppSelector(state => state.web3);

  const cameraPermission = useCameraPermission();
  const isCameraAvailable = cameraPermission === 'authorized';

  useEffect(() => {
    return navigation.addListener('focus', () => {
      dispatch(clearFaceKI());
      dispatch(faceKIAuth());
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
      {!isCameraAvailable && <Loader />}
      {isCameraAvailable && <FaceKiCameraView privateKey={privateKey} email={email} />}
    </View>
  );
};

export default FaceKIScreen;
