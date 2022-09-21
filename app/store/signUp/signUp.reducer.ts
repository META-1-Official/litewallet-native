import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { eSignatureProceed, faceKIVerify, getWeb3User, registerAccount } from './signUp.actions';
import { SignUpState, Step1 } from './signUp.types';
// @ts-ignore
import { PrivateKey, key } from 'meta1-vision-js';

const initialState: SignUpState = {
  firstName: '',
  lastName: '',
  mobile: '',
  accountName: '',
  email: '',
  privateKey: '',
  passKey: '',
  faceKIStatus: '',
  image: '',
  eSignatureStatus: '',
  registerStatus: undefined,
};

export const signUpSlice = createSlice({
  name: 'signUp',
  initialState,
  reducers: {
    step1Save: (state, action: PayloadAction<Step1>) => {
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.mobile = action.payload.mobile;
      state.accountName = action.payload.accountName;
    },
  },
  extraReducers: builder => {
    builder.addCase(getWeb3User.fulfilled, (state, action) => {
      state.email = action.payload.email;
      state.privateKey = action.payload.privateKey;
      state.passKey = `P${PrivateKey.fromSeed(
        key.normalize_brainKey(`${action.payload.email}${action.payload.privateKey}`),
      ).toWif()}`;
    });
    builder.addCase(faceKIVerify.fulfilled, (state, action) => {
      state.faceKIStatus = action.payload.status;
      state.image = action.payload.image;
    });
    builder.addCase(eSignatureProceed.fulfilled, (state, action) => {
      state.eSignatureStatus = action.payload.type;
    });
    builder.addCase(registerAccount.fulfilled, (state, action) => {
      state.registerStatus = action.payload;
    });
  },
});

export const { step1Save } = signUpSlice.actions;
export default signUpSlice.reducer;
