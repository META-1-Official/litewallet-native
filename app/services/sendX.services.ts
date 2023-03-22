import axios, { AxiosInstance } from 'axios';
import config from '../config';

const SENDX_BASE_URL = 'https://app.sendx.io/api/v1';

interface SubscribeParams {
  email: string;
  tags: Array<string>;
  firstName?: string;
  lastName?: string;
  newEmail?: string;
  company?: string;
  birthday?: string;
  customFields?: any;
}

class SendXServices {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: SENDX_BASE_URL,
      headers: {
        api_key: config.SENDX_API_KEY,
      },
    });
  }

  subscribe = async (payload: SubscribeParams) => {
    const { data } = await this.api.post(
      `/contact/identify?team_id=${config.SENDX_TEAM_ID}`,
      payload,
    );
    return data;
  };
}

export default new SendXServices();
