import axios from 'axios';
import config from '../config';

export const createUser = async (email: string, voiceitID: string) => {
  return await axios.post(`${config.E_SIGNATURE_API_URL}/apiewallet/users`, { email, voiceitID });
};

export const getUser = async (email: string) => {
  return await axios.get(`${config.E_SIGNATURE_API_URL}/apiewallet/users`, { params: { email } });
};

export const getToken = async (email: string) => {
  console.log('!!! Before getToken', email);
  return await axios.get(`${config.E_SIGNATURE_API_URL}/apiewallet/sign/token`, {
    headers: {
      Accept: 'application/json',
    },
    params: { email },
  });
};
