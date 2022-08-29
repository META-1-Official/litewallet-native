import axios from 'axios';

export const getToken = async (email: string) => {
  console.log('!!! Before getToken', email);
  return await axios.get('https://humankyc.cryptomailsvc.io/apiewallet/sign/token', {
    headers: {
      Accept: 'application/json',
    },
    params: { email: 'antman357357@gmail.com' },
  });
};

export default getToken;
