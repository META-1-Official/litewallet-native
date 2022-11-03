import { createAsyncThunk } from '@reduxjs/toolkit';
import { Platform } from 'react-native';
import Toast from 'react-native-toast-message';
import faceKIAPI, { FaceKIVerifyParams } from '../../services/faceKI/faceKI.service';

export const faceKIVerify = createAsyncThunk(
  'signUp/faceKIVerify',
  async ({ image, email }: FaceKIVerifyParams) => {
    const livelinessStatus = await faceKIAPI.livelinessCheck({ image });
    if (livelinessStatus.data.liveness === 'Spoof') {
      Toast.show({
        type: 'error',
        text1: livelinessStatus.data.liveness,
        text2: livelinessStatus.data.result,
      });
      console.error(
        livelinessStatus.data.liveness,
        livelinessStatus.data.result,
        'Liveliness is spoof try again!',
      );
    } else {
      Toast.show({
        type: 'info',
        text1: livelinessStatus.data.liveness,
        text2: livelinessStatus.data.result,
      });
      const verifyStatus = await faceKIAPI.verifyUser({ image });
      if (verifyStatus.status === 'Verify OK' && verifyStatus.name === email) {
        Toast.show({
          type: 'success',
          text1: verifyStatus.status,
          text2: 'You have been verified!',
        });
        return { status: 'success', image: Platform.OS === 'android' ? `file://${image}` : image };
      } else {
        Toast.show({
          type: 'info',
          text1: verifyStatus.status,
        });
        const enrollStatus = await faceKIAPI.enrollUser({ image, name: email });
        if (enrollStatus.status === 'Enroll OK') {
          Toast.show({
            type: 'success',
            text1: enrollStatus.status,
            text2: 'You have been enrolled!',
          });
          return {
            status: 'success',
            image: Platform.OS === 'android' ? `file://${image}` : image,
          };
        } else {
          Toast.show({
            type: 'info',
            text1: enrollStatus.status,
          });
        }
      }
    }
    return { status: 'error', image: '' };
  },
);
