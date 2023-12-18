import axios from 'axios';
import config from '../config';

export const createUser = async (email: string, facekiID: string) => {
  const response = await axios.post(`${config.E_SIGNATURE_API_URL}/apiewallet/users`, {
    email,
    facekiID,
  });
  return response.data;
};

export const updateUser = async (
  email: string,
  payload: { member1Name: string },
  token: string,
) => {
  const { data } = await axios.patch(
    `${config.E_SIGNATURE_API_URL}/apiewallet/users/update?email=${email}`,
    payload,
    {
      headers: {
        authorization: token,
      },
    },
  );
  return data;
};

export const getUser = async (email: string) => {
  console.log('GetUser service start');
  const response = await axios.get(`${config.E_SIGNATURE_API_URL}/apiewallet/users`, {
    params: { email },
  });
  console.log('GetUser service end', response.data);
  return response.data;
};

export const getUserByWallet = async (wallet: string) => {
  console.log('GetUserByWallet service start');
  const response = await axios.get(`${config.E_SIGNATURE_API_URL}/apiewallet/users/acc`, {
    params: { acc: wallet },
  });
  console.log('GetUserByWallet service end', response.data);
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
  console.log('eSignature token: ', headers?.authorization);
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

export interface LinkPollDTO {
  firstName: string;
  lastName: string;
  email: string;
  token: string;
  walletName: string;
  phoneNumber: string;
  redirectUrl: string;
}

export async function createLinkPoll(linkPollDto: LinkPollDTO) {
  const { email, firstName, lastName, phoneNumber, walletName, token, redirectUrl } = linkPollDto;
  try {
    const { data } = await axios.post(`${config.E_SIGNATURE_API_URL}/apiewallet/poling/`, {
      email,
      firstName,
      lastName,
      phoneNumber,
      walletName,
      token,
      redirectUrl,
    });
    return data;
  } catch (e) {
    return { message: 'Something is wrong', error: true };
  }
}

export async function deleteLinkPoll(token: string) {
  try {
    const response = await axios.delete(
      `${config.E_SIGNATURE_API_URL}/apiewallet/poling/remove?token=${token}`,
    );
    return response;
  } catch (e) {
    return { message: 'Something is wrong', error: true };
  }
}
