import { createAsyncThunk } from '@reduxjs/toolkit';
import { getToken, signDocument } from '../../services/eSignature.services';

export const eSignatureSign = createAsyncThunk(
  'signUp/signDocument',
  async ({ token, payload }: any) => {
    if (!token) {
      token = await getToken(payload.email);
    }
    return await signDocument({ token, payload });
  },
);
