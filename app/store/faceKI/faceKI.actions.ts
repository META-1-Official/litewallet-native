import { createAsyncThunk } from '@reduxjs/toolkit';
import { Platform } from 'react-native';
import Toast from 'react-native-toast-message';
import { createUser, getUser } from '../../services/eSignature.services';
import faceKIAPI, { FaceKIVerifyParams } from '../../services/faceKI/faceKI.service';

const enroll = async (
  image: string,
  name: string,
  withNewAccount: { email: string; faceKIID: string } | undefined = undefined,
) => {
  console.log('Enroll with new account? ', withNewAccount);
  const enrollStatus = await faceKIAPI.enrollUser({ image, name });
  if (enrollStatus.status === 'Enroll OK') {
    Toast.show({
      type: 'success',
      text1: enrollStatus.status,
      text2: 'You have been enrolled!',
    });
    if (withNewAccount) {
      const userCreationStatus = await createUser(withNewAccount.email, withNewAccount.faceKIID);
      if (userCreationStatus) {
        Toast.show({
          type: 'success',
          text1: 'User has been updated with new email!',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'User has not been updated with new email!',
          text2: 'Please try again!',
        });
        return { status: 'error', image: '' };
      }
    }
    return {
      status: 'success',
      image: Platform.OS === 'android' ? `file://${image}` : image,
    };
  }
  Toast.show({
    type: 'info',
    text1: enrollStatus.status,
  });
  return { status: 'error', image: '' };
};

const somethingWentWrong = (error: string) => {
  console.error(error);
  Toast.show({
    type: 'error',
    text1: 'Something went wrong!',
    text2: 'Please try again!',
  });
};

export const faceKIVerify = createAsyncThunk(
  'signUp/faceKIVerify',
  async ({ image, email, privateKey }: FaceKIVerifyParams) => {
    console.log('Start with email, privateKey, image', email, privateKey, image);
    if (image.length === 0 || email.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Name or Email is empty!',
        text2: 'Please try to put name or email again.',
      });
    }
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
      if (verifyStatus.status === 'Verify OK') {
        console.log('!!!', verifyStatus.name, email);
        Toast.show({
          type: 'success',
          text1: verifyStatus.status,
          text2: 'You have been verified!',
        });
        const kycProfile = await getUser(email);
        if (kycProfile) {
          console.error('This email has already been used for another wallet.');
          Toast.show({
            type: 'error',
            text1: 'This email has already been used for another wallet.',
            text2: 'Please use different email for new wallet creation.',
          });
        } else {
          try {
            console.log('Using new email: ', email);
            const newName = `${verifyStatus.name},${email}`;
            console.log('Removing user with old name: ', verifyStatus.name);
            const removingStatus = await faceKIAPI.removeUser(verifyStatus.name);
            if (removingStatus) {
              const faceKIID = `usr_${email}_${privateKey}`;
              return await enroll(image, newName, { email, faceKIID });
            } else {
              somethingWentWrong(`User hasn't been removed. RemovingStatus: ${removingStatus}`);
            }
          } catch (error) {
            somethingWentWrong(error as string);
          }
        }
      } else {
        Toast.show({
          type: 'info',
          text1: verifyStatus.status,
        });
        return await enroll(image, email);
      }
    }
    return { status: 'error', image: '' };
  },
);
