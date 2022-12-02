import { createAsyncThunk } from '@reduxjs/toolkit';
import { Platform } from 'react-native';
import { createUser, getUser } from '../../services/eSignature.services';
import FaceKIService, { FaceKIVerifyParams } from '../../services/faceKI/faceKI.service';
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
  async ({ image, email, privateKey }: FaceKIVerifyParams) => {
    console.log('SignUp verification');
    // Check params
    if (image.length === 0 || email.length === 0) {
      handleParamsError({ image, email, privateKey });
      return ERROR_STATE;
    } else {
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
          // Check if email exists in emailList of verified user
          const userEmailList = verifyStatus.name?.split(',');
          if (userEmailList.includes(email)) {
            handleVerifyOk(verifyStatus);
            return successState(image);
          } else {
            // Get user if email is not in email list
            const kycProfile = await getUser(email);
            if (kycProfile) {
              handleUsedEmail();
              return ERROR_STATE;
            } else {
              // Add email to emailList for current user
              const emailList = `${verifyStatus.name},${email}`;
              // Enroll new user with updated name | updating p1
              const enrollStatus = await FaceKIService.enrollUser({ image, name: emailList });
              if (enrollStatus.status !== Enrollment.EnrollOk) {
                // Remove user with new name | updating p1 | !Danger!
                const removingStatus = await FaceKIService.removeUser({ name: emailList });
                if (!removingStatus) {
                  somethingWentWrong(`User has been removed. RemovingStatus: ${removingStatus}`);
                  return ERROR_STATE;
                }
                handleEnrollError();
                return ERROR_STATE;
              } else {
                // Remove user with previous name | updating p1 | !Danger!
                const removingStatus = await FaceKIService.removeUser({ name: verifyStatus.name });
                if (!removingStatus) {
                  somethingWentWrong(`User has been removed. RemovingStatus: ${removingStatus}`);
                  return ERROR_STATE;
                }
                // Create new eSignature user with current email
                const faceKIID = `usr_${email}_${privateKey}`;
                const userCreationStatus = await createUser(email, faceKIID);
                if (userCreationStatus.result) {
                  // Success | User created
                  handleEnrollOk(userCreationStatus.status);
                  return successState(image);
                } else {
                  somethingWentWrong("User hasn't been created on eSignature.");
                  return ERROR_STATE;
                }
              }
            }
          }
        } else {
          // Verification has failed | Get eSignature user to check if email is used
          const kycProfile = await getUser(email);
          if (kycProfile) {
            handleUsedEmail();
            return ERROR_STATE;
          } // else
          // Enroll new user with new email
          const enrollStatus = await FaceKIService.enrollUser({ image, name: email });
          if (enrollStatus.status === Enrollment.EnrollOk) {
            // Create new user in ESignature
            const faceKIID = `usr_${email}_${privateKey}`;
            const userCreationStatus = await createUser(email, faceKIID);
            if (userCreationStatus.result) {
              handleEnrollOk(userCreationStatus.status);
              return successState(image);
            }
            // Remove user from ESignature
            const removingStatus = await FaceKIService.removeUser(verifyStatus.name);
            somethingWentWrong(`User has been removed. RemovingStatus: ${removingStatus}`);
            return ERROR_STATE;
          }
          handleEnrollError();
          return ERROR_STATE;
        }
      }
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
      const userEmailList = kycProfile.member1Name.split(',');
      if (!userEmailList.includes(accountName)) {
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
