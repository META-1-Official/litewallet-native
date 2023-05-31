import axios, { AxiosInstance } from 'axios';

import config from '../../config';

export interface VerifyParams {
  image: string;
}

export interface RemoveUserParams {
  email: string;
}

export interface EnrollUserParams extends VerifyParams, RemoveUserParams {}

export interface FaceKIVerifyParams {
  image: string;
  email: string;
  privateKey: string;
  accountName?: string;
}

export interface AuthParams {
  clientSecret?: string;
  password?: string;
}

class FaceKIServices {
  private api: AxiosInstance;
  private readonly clientSecret;
  private readonly password;

  constructor(secrets?: AuthParams) {
    this.api = axios.create({
      baseURL: config.FACE_KI_API_URL,
    });
    this.clientSecret = secrets?.clientSecret;
    this.password = secrets?.password;
  }

  generateToken = async () => {
    console.log('Generate token start');
    const params = { client_secret: this.clientSecret, password: this.password };
    const { data } = await this.api.post('/face/auth', params);
    this.api.defaults.headers['x-access-token'] = data.token;
    console.log('Generate token end', data.token);
    return data;
  };

  livelinessCheck = async ({ image }: VerifyParams) => {
    console.log('Liveliness service start');
    const formData = new FormData();
    formData.append('image', {
      uri: `file://${image}`,
      name: image.split('/').reverse()[0],
      type: 'image/jpeg',
    });
    const response = await this.api.post('/face/attribute', formData, {
      headers: { 'content-type': 'multipart/form-data' },
    });
    console.log('Liveliness service end', response.data);
    return response.data;
  };

  enrollUser = async ({ image, email }: EnrollUserParams) => {
    console.log('EnrollUser service start');
    const formData = new FormData();
    formData.append('image', {
      uri: `file://${image}`,
      name: image.split('/').reverse()[0],
      type: 'image/jpeg',
    });
    formData.append('email', email);
    formData.append('privKey', 'web3authprivatekey');
    const response = await this.api.post('/face_enroll', formData, {
      headers: { 'content-type': 'multipart/form-data' },
    });
    console.log('EnrollUser service start', response.data);
    return response.data;
  };

  verifyUser = async ({ image }: VerifyParams) => {
    console.log('VerifyUser service start');
    const formData = new FormData();
    formData.append('image', {
      uri: `file://${image}`,
      name: image.split('/').reverse()[0],
      type: 'image/jpeg',
    });
    const response = await this.api.post('/verify_user', formData, {
      headers: { 'content-type': 'multipart/form-data' },
    });
    console.log('VerifyUser service end', response.data);
    return response.data;
  };

  userList = async () => {
    const response = await this.api.post('/user_list');
    return response.data;
  };

  removeUser = async ({ email }: RemoveUserParams) => {
    console.log('RemoveUser service start');
    const response = await this.api.post('/remove_user', { email: email });
    console.log('RemoveUser service end', response.data);
    return response.data;
  };
}

export default new FaceKIServices();
