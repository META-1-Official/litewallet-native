import { createAsyncThunk } from '@reduxjs/toolkit';
import { getToken, getUser, signDocument, updateUser } from '../../services/eSignature.services';

export const eSignatureSign = createAsyncThunk(
  'signUp/signDocument',
  async ({ token, payload }: any) => {
    if (!token) {
      token = await getToken(payload.email);
    }
    return await signDocument({ token, payload });
  },
);

export const eSignatureUpdateWalletName = createAsyncThunk(
  'signUp/updateProfile',
  async ({ email, accountName }: any) => {
    const kycProfile = await getUser(email);
    const walletNameList = kycProfile.member1Name.split(',');
    console.log('Update action', walletNameList, accountName);
    if (!walletNameList.includes(accountName)) {
      console.log('Сейчас запуститься апдейт1');
      const token = (await getToken(email)).headers.authorization as string;
      console.log('Сейчас запуститься апдейт2');
      const newMember1Name = `${kycProfile.member1Name},${accountName}`;
      console.log('Сейчас запуститься апдейт3');
      return updateUser(email, { member1Name: newMember1Name }, token);
    }
    return true;
  },
);
