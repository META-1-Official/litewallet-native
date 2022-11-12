import axios from 'axios';
import config from '../config';

export const createUser = async (email: string, facekiID: string) => {
  const response = await axios.post(`${config.E_SIGNATURE_API_URL}/apiewallet/users`, {
    email,
    facekiID,
  });
  return response.data;
};

export const getUser = async (email: string) => {
  const response = await axios.get(`${config.E_SIGNATURE_API_URL}/apiewallet/users`, {
    params: { email },
  });
  return response.data;
};

export const getToken = async (email: string) => {
  const { data, headers } = await axios.get(
    `${config.E_SIGNATURE_API_URL}/apiewallet/sign/token`,
    {
      headers: {
        Accept: 'application/json',
      },
      params: { email },
    },
  );
  return { data, headers };
};

// todo: fix type
export const signDocument = async ({ token, payload }: any) => {
  const { data } = await axios.post(`${config.E_SIGNATURE_API_URL}/sign`, payload, {
    headers: {
      authorization: token,
    },
    responseType: 'arraybuffer',
  });
  return data;
};
