import { createAsyncThunk } from '@reduxjs/toolkit';
import * as WebBrowser from '@toruslabs/react-native-web-browser';
import Toast from 'react-native-toast-message';
import config from '../../config';
import { createUser, getToken, getUser, signDocument } from '../../services/eSignature';
import migrationService from '../../services/migration.service';
import createAccountWithPassword from '../../utils/accountCreate';

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
}

export const eSignatureProceed = createAsyncThunk(
  'signup/eSignatureProceed',
  async ({
    email,
    privateKey,
    firstName,
    lastName,
    accountName,
    mobile,
  }: ESignatureProceedProps) => {
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
  async ({ accountName, passKey, mobile, email, firstName, lastName }: RegisterAccountProps) => {
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

export const eSignatureSign = createAsyncThunk(
  'signUp/signDocument',
  ({ token, payload }: any) => {
    return signDocument({ token, payload });
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
