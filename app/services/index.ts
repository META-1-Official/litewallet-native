import axios, { AxiosInstance } from 'axios';
import config from '../config';

class Services {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: config.API_URL,
    });
  }

  getPrice = async () => {
    const response = await this.api.get('/getprice');
    return response.data;
  };
}

export default new Services();
