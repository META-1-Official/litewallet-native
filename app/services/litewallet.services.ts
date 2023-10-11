import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Platform } from 'react-native';
import { Asset } from 'react-native-image-picker';
import config from '../config';

export enum TASK {
  VERIFY = 'verify',
  REGISTER = 'register',
}

export interface Notification {
  id: number;
  content: string;
  type: 'USER' | 'GLOBAL';
  userId: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface FASTokenProps {
  email: string;
  task: TASK;
  account?: string | null;
  publicKey?: string | null;
  signature?: string | null;
  signatureContent?: string | null;
}

export interface FASTokenResponse {
  message: string;
  token?: string;
}

export interface FASMigrationResponse {
  doesUserExistsInFAS: boolean;
  message: string;
  wasUserEnrolledInOldBiometric: boolean;
}

export interface FASEnrollProps {
  email: string;
  privKey: string;
  fasToken: string;
}

export interface FASEnrollResponse {
  message: string;
}

class LiteWalletServices {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: config.LITE_WALLET_API_URL,
    });
  }

  saveBalance = async (accountName: string) => {
    const { data } = await this.api.post('/saveBalance', { accountName });
    return data;
  };

  login = async (
    accountName: string,
    email: string,
    idToken: string,
    appPubKey: string,
    fasToken: string,
  ) => {
    const { data } = await this.api.post('/login', {
      accountName,
      email,
      idToken,
      appPubKey,
      fasToken,
    });
    this.api.defaults.headers.common.Authorization = `Bearer ${data.token}`;
    return data;
  };

  getUserData = async (accountName: string) => {
    const { data } = await this.api.post('/getUserData', { login: accountName });
    return data;
  };

  saveAvatar = async (accountName: string, image: Asset) => {
    const formData = new FormData();
    formData.append('login', accountName);
    formData.append('image', {
      uri: Platform.OS === 'ios' ? image.uri!.replace('file://', '') : image.uri!,
      name: image.fileName,
      type: image.type || 'image/jpeg',
    });
    const { data } = await this.api.post('/saveAvatar', formData, {
      headers: { 'content-type': 'multipart/form-data' },
    });
    return data;
  };

  deleteAvatar = async (accountName: string) => {
    const { data } = await this.api.post('/deleteAvatar', { login: accountName });
    return data;
  };

  getNotifications = async (accountName: string) => {
    const { data } = await this.api.post('/getNotifications', { accountName });
    return data as Notification;
  };

  getHistory = async (accountName: string, skipSize: number, from: string) => {
    const { data } = await this.api.post('/getHistory', {
      accountName,
      skip_size: skipSize,
      from,
    });
    return data;
  };

  signUp = async (accountName: string) => {
    const { data } = await this.api.post('/signUp', { accountName });
    return data;
  };

  getFasMigrationStatus = async (email: string): Promise<FASMigrationResponse> => {
    try {
      const { data } = await this.api.post('/getFASMigrationStatus', { email });
      return data;
    } catch (error) {
      throw error;
    }
  };

  getFASToken = async ({
    account = null,
    email,
    task,
    publicKey = null,
    signature = null,
    signatureContent = null,
  }: FASTokenProps): Promise<FASTokenResponse> => {
    try {
      const { data } = await this.api.post('/getFASToken', {
        account,
        email,
        task,
        publicKey,
        signature,
        signatureContent,
      });
      return data;
    } catch (error) {
      throw error;
    }
  };

  fasEnroll = async (
    email: string,
    privKey: string,
    fasToken: string,
  ): Promise<FASEnrollResponse> => {
    try {
      const { data } = await this.api.post('/fasEnroll', {
        email,
        privKey,
        fasToken,
      });
      return data;
    } catch (error) {
      throw error;
    }
  };
}

export default new LiteWalletServices();
