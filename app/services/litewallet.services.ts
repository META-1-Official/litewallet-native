import axios, { AxiosInstance } from 'axios';
import { Platform } from 'react-native';
import { Asset } from 'react-native-image-picker';
import config from '../config';

export interface Notification {
  id: number;
  content: string;
  type: 'USER' | 'GLOBAl';
  userId: number | null;
  createdAt: Date;
  updatedAt: Date;
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

  login = async (accountName: string, email: string) => {
    const { data } = await this.api.post('/login', { accountName, email });
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
    const { data } = await this.api.post('/getHistory', { accountName, skip_size: skipSize, from });
    return data;
  };
}

export default new LiteWalletServices();
