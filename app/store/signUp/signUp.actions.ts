import { createAsyncThunk } from '@reduxjs/toolkit';
import * as WebBrowser from '@toruslabs/react-native-web-browser';
import config from '../../config';
import { createUser, getToken, getUser } from '../../services/eSignature';
import { web3Login } from '../../services/web3.services';
// @ts-ignore
import { PrivateKey, key } from 'meta1-vision-js';

import faceKIAPI, { FaceKIVerifyParams } from '../../services/faceKI/faceKI.service';
import createAccountWithPassword from '../../utils/accountCreate';
import { SignUpState } from './signUp.types';

export const getWeb3User = createAsyncThunk('signUp/web3Login', async () => {
  const response = await web3Login();
  const payload = { email: response?.userInfo?.email || '', privateKey: response.privKey || '' };
  const passKey = `P${PrivateKey.fromSeed(
    key.normalize_brainKey(`${payload.email}${payload.privateKey}`),
  ).toWif()}`;
  return { ...payload, passKey };
});

export const faceKIVerify = createAsyncThunk(
  'signUp/faceKIVerify',
  async ({ image, email }: FaceKIVerifyParams) => {
    const livelinessStatus = await faceKIAPI.livelinessCheck({ image });
    if (livelinessStatus.data.liveness === 'Spoof') {
      console.log('Liveliness is spoof try again!');
    } else {
      const verifyStatus = await faceKIAPI.verifyUser({ image });
      if (verifyStatus.data.status === 'Verify OK' && verifyStatus.data.name === email) {
        console.log('You have been verified!');
        return { status: 'success', image };
      } else {
        const enrollStatus = await faceKIAPI.enrollUser({ image, name: email });
        if (enrollStatus.data.status === 'Enroll OK') {
          console.log('You have been already enrolled!');
          return { status: 'success', image };
        }
      }
    }
    return { status: 'error', image };
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
    await createUser(email, faceKIID);
    const response = await getToken(email);
    let token;
    if (response && response.headers) {
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

export const registerAccount = createAsyncThunk(
  '/signUp/registerAccount',
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
