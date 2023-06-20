import { createAsyncThunk } from '@reduxjs/toolkit';
import * as WebBrowser from '@toruslabs/react-native-web-browser';
import Toast from 'react-native-toast-message';
import config from '../../config';
import { createUser, getToken, getUser } from '../../services/eSignature.services';
import migrationService from '../../services/migration.service';
import sendXServices from '../../services/sendX.services';
import createAccountWithPassword from '../../utils/accountCreate';
import { setToken } from '../eSignature/eSignature.reducer';

const SENDX_TAG = config.APP_KEY_PREFIX === 'META1' ? 'MEMBERS' : 'DEV2';

interface AccountData {
  email: string;
  firstName: string;
  lastName: string;
  accountName: string;
  mobile: string;
}

interface ESignatureProceedProps extends AccountData {
  privateKey: string;
}

interface RegisterAccountProps extends AccountData {
  passKey: string;
  emailSubscription: boolean;
}

// todo: move it to eSignature actions
export const eSignatureProceed = createAsyncThunk(
  'signup/eSignatureProceed',
  async (
    { email, privateKey, firstName, lastName, accountName, mobile }: ESignatureProceedProps,
    { dispatch },
  ) => {
    const redirectUrl = 'io.meta1.appbeta://auth';
    const faceKIID = `usr_${email}_${privateKey}`;
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
          text1: 'User get token of eSignature',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: response.data.result,
        });
      }
      if (response.headers.authorization) {
        token = response.headers.authorization;
        dispatch(setToken(token));
      }
    }
    const phoneNumber = mobile.replace(/\s/g, '');
    const encodedEmail = encodeURIComponent(email);
    const url = `${
      config.E_SIGNATURE_API_URL
    }/e-sign?email=${encodedEmail}&firstName=${firstName}&lastName=${lastName}&phoneNumber=${phoneNumber}&walletName=${accountName}&token=${token}&redirectUrl=${redirectUrl}&isMobile=${true}`;
    console.log('eSignature URL: ', url);
    return await WebBrowser.openAuthSessionAsync(url, redirectUrl);
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
    emailSubscription,
  }: RegisterAccountProps) => {
    console.log('CreateAccountWithPassword service started!');
    if (emailSubscription) {
      sendXServices
        .subscribe({
          email,
          tags: [SENDX_TAG],
          firstName,
          lastName,
          customFields: { mobile },
        })
        .then(() => {
          console.log('Subscription completed!');
        });
    }
    return createAccountWithPassword(
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
