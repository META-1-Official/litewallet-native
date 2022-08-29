import axios from 'axios';

import { FACE_KI_API_URL } from '@env';
import { FaceAttributes } from './types';

const baseUrl = FACE_KI_API_URL;

export interface VerifyParams {
  image: string;
}

export interface RemoveUserParams {
  name: string;
}

export interface EnrollUserParams extends VerifyParams, RemoveUserParams {}

const faceKIAPI = {
  livelinessCheck: async ({ image }: VerifyParams) => {
    console.log('!!!!!!!!!!!!!![eq');
    const formData = new FormData();
    formData.append('image', {
      uri: `file://${image}`,
      name: image.split('/').reverse()[0],
      type: 'image/jpeg',
    });

    console.log('!FormData', JSON.stringify(formData));

    return await axios.post(baseUrl + '/face/attribute', formData, {
      headers: { 'content-type': 'multipart/form-data' },
    });
  },
  enrollUser: async ({ image, name }: EnrollUserParams) => {
    const formData = new FormData();
    formData.append('image', {
      uri: `file://${image}`,
      name: image.split('/').reverse()[0],
      type: 'image/jpeg',
    });
    formData.append('name', name);
    return await axios.post(baseUrl + '/enroll_user', formData, {
      headers: { 'content-type': 'multipart/form-data' },
    });
  },
  verifyUser: async ({ image }: VerifyParams) => {
    const formData = new FormData();
    formData.append('image', {
      uri: `file://${image}`,
      name: image.split('/').reverse()[0],
      type: 'image/jpeg',
    });
    return await axios.post(baseUrl + '/verify_user', formData, {
      headers: { 'content-type': 'multipart/form-data' },
    });
  },
  userList: async () => {
    return await axios.post(baseUrl + '/user_list');
  },
  removeUser: async ({ name }: RemoveUserParams) => {
    const formData = new FormData();
    formData.append('name', name);
    return await axios.post(baseUrl + '/remove_user', formData);
  },
  removeAllUsers: async () => {
    return await axios.post(baseUrl + '/remove_all');
  },
};

export default faceKIAPI;
