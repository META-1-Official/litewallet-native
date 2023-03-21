import axios, { AxiosInstance } from 'axios';
import config from '../config';

const SENDX_BASE_URL = 'https://app.sendx.io/api/v1';
const listId = '1';

interface SubscribeParams {
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  tags?: Array<string>;
}

class SendXServices {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: SENDX_BASE_URL,
      headers: {
        authorization: config.SENDX_API_KEY,
      },
    });
  }

  subscribe = async (payload: SubscribeParams) => {
    const { data } = await this.api.post(`/lists/${listId}/subscribers`, payload);
    return data;
  };
}

export default new SendXServices();
