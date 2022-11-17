import { createAsyncThunk } from '@reduxjs/toolkit';
import { Platform } from 'react-native';
import { createUser, getUser } from '../../services/eSignature.services';
import faceKIAPI, { FaceKIVerifyParams } from '../../services/faceKI/faceKI.service';
import { Enrollment, Liveness, Verify } from '../../services/faceKI/types';
import {
  handleParamsError,
  handleSpoof,
  handleFaceAttributes,
  handleUsedEmail,
  handleEnrollOk,
  handleEnrollError,
  handleVerifyOk,
  somethingWentWrong,
} from './actionHelpers';

const ERROR_STATE = { status: 'error', image: '' };
const successState = (image: string) => ({
  status: 'success',
  image: Platform.OS === 'android' ? `file://${image}` : image,
});

export const faceKIVerifyOnSignup = createAsyncThunk(
  'signUp/faceKIVerify',
  async ({ image, email, privateKey }: FaceKIVerifyParams) => {
    // Check params
    if (image.length === 0 || email.length === 0) {
      handleParamsError({ image, email, privateKey });
      return ERROR_STATE;
    }
    // Check liveliness
    const livelinessStatus = await faceKIAPI.livelinessCheck({ image });
    if (livelinessStatus.data.liveness !== Liveness.Genuine) {
      handleSpoof(livelinessStatus.data);
      return ERROR_STATE;
    }
    handleFaceAttributes(livelinessStatus.data);
    // Verify
    const verifyStatus = await faceKIAPI.verifyUser({ image });
    if (verifyStatus.status !== Verify.VerifyOk) {
      // Get user
      const kycProfile = await getUser(email);
      if (kycProfile) {
        handleUsedEmail();
        return ERROR_STATE;
      }
      // Enroll user
      const enrollStatus = await faceKIAPI.enrollUser({ image, name: email });
      if (enrollStatus.status === Enrollment.EnrollOk) {
        // Create new user in ESignature
        const faceKIID = `usr_${email}_${privateKey}`;
        const userCreationStatus = await createUser(email, faceKIID);
        if (userCreationStatus.result) {
          handleEnrollOk(userCreationStatus.status);
          return successState(image);
        }
        // Remove user from ESignature
        const removingStatus = await faceKIAPI.removeUser(verifyStatus.name);
        somethingWentWrong(`User has been removed. RemovingStatus: ${removingStatus}`);
        return ERROR_STATE;
      }
      handleEnrollError();
      return ERROR_STATE;
    }
    // Check email in emailList of verified user
    const userEmailList = verifyStatus.name?.split(',');
    if (userEmailList.includes(email)) {
      handleVerifyOk(verifyStatus);
      return successState(image);
    }
    // Get user if email is not in email list
    const kycProfile = await getUser(email);
    if (kycProfile) {
      handleUsedEmail();
      return ERROR_STATE;
    }
    // Add email to emailList for current user
    const emailList = `${verifyStatus.name},${email}`;
    // Remove current user with previous name
    const removingStatus = await faceKIAPI.removeUser(verifyStatus.name);
    if (!removingStatus) {
      somethingWentWrong(`User has been removed. RemovingStatus: ${removingStatus}`);
      return ERROR_STATE;
    }
    // Enroll user
    const enrollStatus = await faceKIAPI.enrollUser({ image, name: emailList });
    if (enrollStatus.status !== Enrollment.EnrollOk) {
      handleEnrollError();
      return ERROR_STATE;
    }
    // Update user with new email
    const faceKIID = `usr_${email}_${privateKey}`;
    const userCreationStatus = await createUser(email, faceKIID);
    if (!userCreationStatus.result) {
      // Remove user from ESignature 2
      const removingStatus2 = await faceKIAPI.removeUser(verifyStatus.name);
      somethingWentWrong(`User has been removed. RemovingStatus: ${removingStatus2}`);
      return ERROR_STATE;
    }
    // Success | User created
    handleEnrollOk(userCreationStatus.status);
    return successState(image);
  },
);
