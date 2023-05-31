import { createAsyncThunk } from '@reduxjs/toolkit';
import { Platform } from 'react-native';
import { getUser } from '../../services/eSignature.services';
import FaceKIService, { FaceKIVerifyParams } from '../../services/faceKI/faceKI.service';
import { Liveness, Verify } from '../../services/faceKI/types';
import {
  handleParamsError,
  handleSpoof,
  handleFaceAttributes,
  handleEnrollOk,
  handleEnrollError,
  handleEmailNotMatchedWithUser,
  handleNeverBeenEnrolled,
  handleVerifyError,
} from './actionHelpers';

const ERROR_STATE = { status: 'error', image: '' };
const successState = (image: string) => ({
  status: 'success',
  image: Platform.OS === 'android' ? `file://${image}` : image,
});

export const faceKIVerifyOnSignup = createAsyncThunk(
  'faceKI/Verify/signUp',
  async ({ image, email }: FaceKIVerifyParams) => {
    console.log('SignUp verification');
    const enrollStatus = await FaceKIService.enrollUser({ image, email });

    if (!enrollStatus) {
      handleEnrollError();
      return ERROR_STATE;
    } else {
      if (['Successfully Enrolled', 'Already Enrolled'].includes(enrollStatus.message)) {
        handleEnrollOk(enrollStatus.message);
        return successState(image);
      }
      handleEnrollError();
      return ERROR_STATE;
    }
  },
);

export const faceKIVerifyOnSignIn = createAsyncThunk(
  'faceKI/Verify/signIn',
  async ({ image, email, privateKey, accountName }: FaceKIVerifyParams) => {
    console.log('SignIn verification');
    if (image.length === 0 || email.length === 0 || accountName?.length === 0) {
      handleParamsError({ image, accountName, email, privateKey });
      return ERROR_STATE;
    }
    // Get user
    const kycProfile = await getUser(email);
    if (!kycProfile?.member1Name) {
      handleEmailNotMatchedWithUser();
      return ERROR_STATE;
    } else {
      const kycProfileWalletList = kycProfile.member1Name.split(',');
      if (!kycProfileWalletList.includes(accountName)) {
        handleEmailNotMatchedWithUser();
        return ERROR_STATE;
      }
      // todo: handle this case
    }
    // Check liveliness
    const livelinessStatus = await FaceKIService.livelinessCheck({ image });
    if (livelinessStatus.data.liveness !== Liveness.Genuine) {
      handleSpoof(livelinessStatus.data);
      return ERROR_STATE;
    } else {
      handleFaceAttributes(livelinessStatus.data);
      // Verify
      const verifyStatus = await FaceKIService.verifyUser({ image });
      if (verifyStatus.status === Verify.VerifyOk) {
        const userEmailList = verifyStatus.name.split(',');
        if (userEmailList.includes(email)) {
          return successState(image);
        } else {
          handleVerifyError();
          return ERROR_STATE;
        }
      } else {
        handleNeverBeenEnrolled();
        return ERROR_STATE;
      }
    }
  },
);
