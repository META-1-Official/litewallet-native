import axios from 'axios';

import config from '../../config';

const baseUrl = config.FACE_KI_API_URL;

export interface VerifyParams {
  image: string;
}

export interface RemoveUserParams {
  name: string;
}

export interface EnrollUserParams extends VerifyParams, RemoveUserParams {}

export interface FaceKIVerifyParams {
  image: string;
  email: string;
}

const faceKIAPI = {
  livelinessCheck: async ({ image }: VerifyParams) => {
    console.log('Liveliness service start');
    const formData = new FormData();
    formData.append('image', {
      uri: `file://${image}`,
      name: image.split('/').reverse()[0],
      type: 'image/jpeg',
    });
    const response = await axios.post(baseUrl + '/face/attribute', formData, {
      headers: { 'content-type': 'multipart/form-data' },
    });
    return response.data;
  },

  enrollUser: async ({ image, name }: EnrollUserParams) => {
    console.log('EnrollUser service start');
    const formData = new FormData();
    formData.append('image', {
      uri: `file://${image}`,
      name: image.split('/').reverse()[0],
      type: 'image/jpeg',
    });
    formData.append('name', name);
    const response = await axios.post(baseUrl + '/enroll_user', formData, {
      headers: { 'content-type': 'multipart/form-data' },
    });
    return response.data;
  },

  verifyUser: async ({ image }: VerifyParams) => {
    console.log('VerifyUser service start');
    const formData = new FormData();
    formData.append('image', {
      uri: `file://${image}`,
      name: image.split('/').reverse()[0],
      type: 'image/jpeg',
    });
    const response = await axios.post(baseUrl + '/verify_user', formData, {
      headers: { 'content-type': 'multipart/form-data' },
    });
    return response.data;
  },

  userList: async () => {
    const response = await axios.post(baseUrl + '/user_list');
    return response.data;
  },

  removeUser: async ({ name }: RemoveUserParams) => {
    const formData = new FormData();
    formData.append('name', name);
    const response = await axios.post(baseUrl + '/remove_user', formData);
    return response.data;
  },

  removeAllUsers: async () => {
    const response = await axios.post(baseUrl + '/remove_all');
    return response.data;
  },
};

export default faceKIAPI;
