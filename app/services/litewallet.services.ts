import axios, { AxiosInstance } from 'axios';
import { Asset } from 'react-native-image-picker';
import config from '../config';

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
    formData.append('image', {
      uri: `file://${image}`,
      name: image.fileName,
      type: 'image/jpeg',
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
}

export default new LiteWalletServices();
