import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { RootStackParamList } from '../../AuthNav';
import FaceKiCameraView from '../../components/FaceKICameraView';
import Loader from '../../components/Loader';
import { useAppDispatch, useAppSelector } from '../../hooks';
import useCameraPermission from '../../hooks/useCameraPermission';
import { getFASToken, getFASMigrationStatus } from '../../store/faceKI/faceKI.actions';
import { clearFaceKI } from '../../store/faceKI/faceKI.reducer';

const CAMERA_PERMISSION_STATUS_AUTHORIZED = 'authorized';

type Props = NativeStackScreenProps<RootStackParamList, 'FaceKI'>;

const FaceKIScreen: React.FC<Props> = () => {
  const dispatch = useAppDispatch();

  const { privateKey, email } = useAppSelector(state => state.web3);
  const { token } = useAppSelector(state => state.faceKI);
  const { accountName: signUpAccountName } = useAppSelector(state => state.signUp);
  const { accountName: signInAccountName } = useAppSelector(state => state.signIn);
  const isSigning = !!signInAccountName;
  const [task, setTask] = useState<'verify' | 'register'>(isSigning ? 'verify' : 'register');
  const account = signInAccountName || signUpAccountName;

  const cameraPermission = useCameraPermission();
  const isCameraAvailable = cameraPermission === CAMERA_PERMISSION_STATUS_AUTHORIZED;

  useEffect(() => {
    dispatch(clearFaceKI());
    dispatch(getFASMigrationStatus('alex-30@yopmail.com'))
      .unwrap()
      .then(({ doesUserExistsInFAS, wasUserEnrolledInOldBiometric }) => {
        // case of migration
        if (!doesUserExistsInFAS && wasUserEnrolledInOldBiometric) {
          dispatch(getFASToken({ account, email, task }));
        } else {
          dispatch(getFASToken({ account, email, task }));
        }
      });
  }, []);

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
      {isCameraAvailable && (
        <FaceKiCameraView privateKey={privateKey} email={email} task={task} token={token} />
      )}
    </View>
  );
};

export default FaceKIScreen;
