import { createAsyncThunk } from '@reduxjs/toolkit';
import { Platform } from 'react-native';
import Toast from 'react-native-toast-message';
import { createUser, getUser } from '../../services/eSignature.services';
import faceKIAPI, { FaceKIVerifyParams } from '../../services/faceKI/faceKI.service';
import {
  Enrollment,
  Liveness,
  Verify,
  FaceAttributes,
  VerifyResponse,
} from '../../services/faceKI/types';

const enrollNewUser = async (image: string, name: string) => {
  const faceKIID = `usr_${email}_${privateKey}`;
  console.log('Enroll with new faceKIID: ', faceKIID);

  const enrollStatus = await faceKIAPI.enrollUser({ image, name });
  if (enrollStatus.status === Enrollment.EnrollOk) {
    const userCreationStatus = await createUser(email, faceKIID);
    if (userCreationStatus) {
      Toast.show({
        type: 'success',
        text1: 'User has been updated with new email!',
      });
      return {
        status: 'success',
        image: Platform.OS === 'android' ? `file://${image}` : image,
      };
    } else {
      Toast.show({
        type: 'error',
        text1: 'User has not been updated with new email!',
        text2: 'Please try again!',
      });
      return { status: 'error', image: '' };
    }
  }
};

const somethingWentWrong = (error: string) => {
  console.error(error);
  Toast.show({
    type: 'error',
    text1: 'Something went wrong!',
    text2: 'Please try again!',
  });
};

const handleSpoof = (faceAttributes: FaceAttributes) => {
  const toClose = 'You are too close to the camera.';
  const tryAgain = 'Liveliness is spoof try again!';
  if (faceAttributes.box.h > 120) {
    Toast.show({
      type: 'error',
      text1: toClose,
      text2: tryAgain,
    });
    console.error(faceAttributes.liveness, toClose, tryAgain);
  } else {
    Toast.show({
      type: 'error',
      text1: faceAttributes.data.liveness,
      text2: faceAttributes.data.result,
    });
    console.error(faceAttributes.data.liveness, faceAttributes.data.result, tryAgain);
  }
};

const handleFaceAttributes = (faceAttributes: FaceAttributes) => {
  Toast.show({
    type: 'info',
    text1: faceAttributes.liveness,
    text2: faceAttributes.result,
  });
};

const handleVerifyOk = (response: VerifyResponse) => {
  console.log('FaceKi verify:', response.data.name);
  Toast.show({
    type: 'success',
    text1: response.data.status,
    text2: 'You have been verified!',
  });
};

export const faceKIVerifyOnSignup = createAsyncThunk(
  'signUp/faceKIVerify',
  async ({ image, email, accountName, privateKey }: FaceKIVerifyParams) => {
    console.log('Start with email, privateKey, image', email, privateKey, image);
    if (image.length === 0 || email.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Name or Email is empty!',
        text2: 'Please try to put name or email again.',
      });
    }

    const livelinessStatus = await faceKIAPI.livelinessCheck({ image });
    if (livelinessStatus.data.liveness !== Liveness.Genuine) {
      handleSpoof(livelinessStatus.data);
    } else {
      handleFaceAttributes(livelinessStatus.data);

      const verifyStatus = await faceKIAPI.verifyUser({ image });
      if (verifyStatus.status === Verify.VerifyOk) {
        handleVerifyOk(verifyStatus);

        console.log('Using new email: ', email);
        const newName = `${verifyStatus.name},${email}`;
        console.log('Removing user with old name: ', verifyStatus.name, 'new name: ', newName);

        const removingStatus = await faceKIAPI.removeUser(verifyStatus.name);
        if (removingStatus) {
          return await enrollNewUser(image, newName);
        } else {
          somethingWentWrong(`User hasn't been removed. RemovingStatus: ${removingStatus}`);
        }
      } else {
        Toast.show({
          type: 'info',
          text1: verifyStatus.status,
        });
        const enrollStatus = await faceKIAPI.enrollUser({ image, name: email });
        if (enrollStatus.status === Enrollment.EnrollOk) {
          const faceKIID = `usr_${email}_${privateKey}`;
          console.log('Enroll with new faceKIID: ', faceKIID);

          const userCreationStatus = await createUser(email, faceKIID);
          if (userCreationStatus) {
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
            const removingStatus = await faceKIAPI.removeUser(verifyStatus.name);
            somethingWentWrong(`User has been removed. RemovingStatus: ${removingStatus}`);
          }
        }
      }
    }
    return { status: 'error', image: '' };
  },
);

export const faceKIVerifyOnSignIn = createAsyncThunk(
  'signUp/faceKIVerify',
  async ({ image, email, accountName, privateKey, isSigning }: FaceKIVerifyParams) => {
    console.log('Start with email, privateKey, image', email, privateKey, image);
    if (image.length === 0 || email.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Name or Email is empty!',
        text2: 'Please try to put name or email again.',
      });
    }
    if (isSigning) {
      const kycProfile = await getUser(email);
      if (kycProfile.member1Name !== accountName) {
        console.error('Wallet not found!');
        Toast.show({
          type: 'error',
          text1: 'Wallet not found!',
        });
        if (!kycProfile.member1Name) {
          console.error('Email and wallet name are not matched.', kycProfile);
          Toast.show({
            type: 'error',
            text1: 'Email and wallet name are not matched.',
          });
        }
        return { status: 'error', image: '' };
      }
    }
    const livelinessStatus = await faceKIAPI.livelinessCheck({ image });
    if (livelinessStatus.data.liveness === Liveness.Spoof) {
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
      if (verifyStatus.status === Verify.VerifyOk) {
        if (isSigning) {
          const userEmailList = verifyStatus.name?.split(',');
          if (userEmailList.includes(email)) {
            Toast.show({
              type: 'success',
              text1: verifyStatus.status,
              text2: 'You have been verified!',
            });
            return {
              status: 'success',
              image: Platform.OS === 'android' ? `file://${image}` : image,
            };
          } else {
            Toast.show({
              type: 'error',
              text1: verifyStatus.status,
              text2:
                'FaceKi verification passed but you are using different email. Please use right email',
            });
            return { status: 'error', image: '' };
          }
        }
        console.log('FaceKi verify:', verifyStatus.name, email);
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
            throw error;
          }
        }
      } else {
        if (isSigning) {
          Toast.show({
            type: 'error',
            text1: 'We can not verify you because you never enrolled with your face yet.',
          });
        } else {
          Toast.show({
            type: 'info',
            text1: verifyStatus.status,
          });
          return await enroll(image, email);
        }
      }
    }
    return { status: 'error', image: '' };
  },
);
