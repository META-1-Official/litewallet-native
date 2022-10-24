import { createAsyncThunk } from '@reduxjs/toolkit';
import * as WebBrowser from '@toruslabs/react-native-web-browser';
import { Platform } from 'react-native';
import Toast from 'react-native-toast-message';
import config from '../../config';
import { createUser, getToken, getUser } from '../../services/eSignature';
import migrationService from '../../services/migration.service';
import { web3Login } from '../../services/web3.services';

import faceKIAPI, { FaceKIVerifyParams } from '../../services/faceKI/faceKI.service';
import createAccountWithPassword from '../../utils/accountCreate';
import { SignUpState, Web3UserParams } from './signUp.types';

export const getWeb3User = createAsyncThunk(
  'signUp/web3Login',
  async ({ provider }: Web3UserParams) => {
    const response = await web3Login(provider);
    return { email: response?.userInfo?.email || '', privateKey: response.privKey || '' };
  },
);

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

export const eSignatureProceed = createAsyncThunk(
  'signup/eSignatureProceed',
  async ({
    email,
    privateKey,
    firstName,
    lastName,
    accountName,
    mobile,
  }: Pick<
    SignUpState,
    'email' | 'privateKey' | 'firstName' | 'lastName' | 'accountName' | 'mobile'
  >) => {
    const redirectUrl = 'io.meta1.appbeta://auth';
    const faceKIID = email + privateKey;
    console.log('CreateUser service has started');
    const user = await createUser(email, faceKIID);
    console.log('CreateUser service has finished');
    Toast.show({
      type: 'info',
      text1: user.result,
    });
    console.log('GetToken service has started');
    const response = await getToken(email);
    console.log('GetToken service has finished');
    let token;
    if (response && response.headers) {
      if (response.data.result === 'done') {
        Toast.show({
          type: 'info',
          text1: 'User has been authorised',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: response.data.result,
        });
      }
      if (response.headers.authorization) {
        token = response.headers.authorization;
      }
    }
    const phoneNumber = mobile.replace(/\s/g, '');
    const encodedEmail = encodeURIComponent(email);
    return await WebBrowser.openBrowserAsync(
      `${config.E_SIGNATURE_API_URL}/e-sign?email=${encodedEmail}&firstName${firstName}&lastName=${lastName}&phoneNumber=${phoneNumber}&walletName=${accountName}&token=${token}&redirectUrl=${redirectUrl}`,
    );
  },
);

export const getAccountPaymentStatus = createAsyncThunk(
  'signUp/getUser',
  async (email: string) => {
    return getUser(email);
  },
);

export const registerAccount = createAsyncThunk(
  'signUp/registerAccount',
  async ({
    accountName,
    passKey,
    mobile,
    email,
    firstName,
    lastName,
  }: Pick<
    SignUpState,
    'accountName' | 'passKey' | 'mobile' | 'email' | 'firstName' | 'lastName'
  >) => {
    console.log('CreateAccountWithPassword service started!');
    return await createAccountWithPassword(
      accountName,
      passKey,
      false,
      '',
      1,
      '',
      mobile,
      email,
      lastName,
      firstName,
    );
  },
);

export const validateSignature = createAsyncThunk(
  'migration/validateSignature',
  // todo: fix type
  ({ accountName, password }: any) => {
    return migrationService.validateSignature(accountName, password);
  },
);

export const checkMigrationStatus = createAsyncThunk(
  'migration/checkMigrationStatus',
  // todo: fix type
  ({ accountName }: any) => {
    return migrationService.checkMigrationStatus(accountName);
  },
);

// todo: fix type
export const migrateAccount = createAsyncThunk(
  'migration/migrate',
  // todo: fix type
  ({ accountName, password }: any) => {
    return migrationService.migrate(accountName, password);
  },
);
