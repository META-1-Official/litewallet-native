import axios, { AxiosInstance } from 'axios';
import config from '../config';

class LiteWalletServices {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: config.liteWalletApiHost,
    });
  }

  saveBalance = async (accountName: string) => {
    const { data } = await this.api.post('/saveBalance', { accountName });
    return data;
  };
}

export default new LiteWalletServices();
