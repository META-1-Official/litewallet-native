import axios from 'axios';

import { FACE_KI_API_URL } from '@env';

const baseUrl = FACE_KI_API_URL;

export interface VerifyParams {
  image: string;
}

export interface RemoveUserParams {
  name: string;
}

export interface EnrollUserParams extends VerifyParams, RemoveUserParams {}

const faceKIAPI = {
  livelinessCheck: async () => {
    return axios.post(baseUrl + '/face/attribute').then((response: any) => response.data);
  },
  enrollUser: async (params: EnrollUserParams) => {
    return axios.post(baseUrl + '/enroll_user', params).then((response: any) => response.data);
  },
  verifyUser: async (params: VerifyParams) => {
    return axios.post(baseUrl + '/verify_user', params).then((response: any) => response.data);
  },
  userList: async () => {
    return axios.post(baseUrl + '/user_list').then((response: any) => response.data);
  },
  removeUser: async (params: RemoveUserParams) => {
    return axios.post(baseUrl + '/remove_user', params).then((response: any) => response.data);
  },
  removeAllUsers: async () => {
    return axios.post(baseUrl + '/remove_all').then((response: any) => response.data);
  },
};

export default faceKIAPI;
