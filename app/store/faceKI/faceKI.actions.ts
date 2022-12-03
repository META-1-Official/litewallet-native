import { createAsyncThunk } from '@reduxjs/toolkit';
import { Platform } from 'react-native';
import { createUser, getToken, getUser, updateUser } from '../../services/eSignature.services';
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
  handleUsedWallet,
} from './actionHelpers';

const ERROR_STATE = { status: 'error', image: '' };
const successState = (image: string) => ({
  status: 'success',
  image: Platform.OS === 'android' ? `file://${image}` : image,
});

export const faceKIVerifyOnSignup = createAsyncThunk(
  'faceKI/Verify/signUp',
  async ({ image, email, privateKey, accountName }: FaceKIVerifyParams) => {
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
        if (verifyStatus.status === Verify.VerifyOk && Number(verifyStatus.score) === 1) {
          // Get user data in case of user verified successfully
          const kycProfile = await getUser(email);
          // Check if email exists in emailList of verified user
          const userEmailList = verifyStatus.name?.split(',');
          if (userEmailList.includes(email)) {
            if (kycProfile.member1Name) {
              const kycProfileWalletList = kycProfile.member1Name.split(',');
              // todo: remove this condition in case of issue - when wallet doesn't exist in blockchain but exist in kycProfile
              // Check if user accountName exist in kycProfile.member1Name
              // if (kycProfileWalletList.includes(accountName)) {
              // handleUsedWallet();
              // return ERROR_STATE;
              // }
              const newMember1Name = kycProfileWalletList.includes(accountName)
                ? kycProfile.member1Name
                : kycProfileWalletList.push(accountName).join(',');
              // Update kycProfile with new wallet name
              const token = (await getToken(email)).headers.authorization as string;
              const updateStatus = await updateUser(email, { member1Name: newMember1Name }, token);
              if (updateStatus) {
                handleVerifyOk(verifyStatus);
                return successState(image);
              }
              somethingWentWrong('Updating kyc profile failed');
              return ERROR_STATE;
            }
            // Else if kycProfile doesn't exist
            somethingWentWrong("KycProfile doesn't exist");
            return ERROR_STATE;
          } else {
            // Check user existence in case user email is not in email list
            if (kycProfile) {
              handleUsedEmail();
              return ERROR_STATE;
            } else {
              // Add email to emailList for current user
              const emailList = `${verifyStatus.name},${email}`;
              // Enroll new user with updated name | updating p1
              const enrollStatus = await FaceKIService.enrollUser({ image, name: emailList });
              if (enrollStatus.status !== Enrollment.EnrollOk) {
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
      if (verifyStatus.status === Verify.VerifyOk && Number(verifyStatus.score) === 1) {
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
