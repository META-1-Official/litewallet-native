import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  eSignatureProceed,
  faceKIVerify,
  getAccountPaymentStatus,
  getWeb3User,
  registerAccount,
} from './signUp.actions';
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
  web3Pending: false,
  faceKIStatus: '',
  image: '',
  eSignatureStatus: '',
  eSignaturePending: false,
  paymentStatus: undefined,
  registerStatus: undefined,
  isMigration: false,
  password: '',
};
// todo: remove this and uncomment previous
// const initialState: SignUpState = {
//   firstName: 'Aleksandr',
//   lastName: 'Ufimtsev',
//   mobile: '+79061977035',
//   accountName: 'fimak-test1',
//   email: 'fimak@bk.ru',
//   privateKey: '0cb7a3e24fa9ae0bb63f6a5b6617928744c9ff3d2ef5f81b691bfd28d2d614b0',
//   passKey: 'P5JH6J2R5npYndUADjEYBnQwgS4pUk6RCmCcDxY3pYpL6HBB3m5e',
//   web3Pending: false,
//   faceKIStatus: '',
//   image: '',
//   eSignatureStatus: '',
//   eSignaturePending: false,
//   paymentStatus: undefined,
//   registerStatus: undefined,
//   isMigration: false,
//   password: '',
// };

export const signUpSlice = createSlice({
  name: 'signUp',
  initialState,
  reducers: {
    step1Save: (state, action: PayloadAction<Step1>) => {
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.mobile = action.payload.mobile;
      state.accountName = action.payload.accountName;
      state.isMigration = action.payload.isMigration;
      state.password = action.payload.password;
    },
    clearFaceKI: state => {
      state.faceKIStatus = '';
      state.image = '';
    },
    clearSignUpState: () => {
      return { ...initialState };
    },
  },
  extraReducers: builder => {
    builder.addCase(getWeb3User.pending, state => {
      state.email = '';
      state.privateKey = '';
      state.passKey = '';
      state.web3Pending = true;
    });
    builder.addCase(getWeb3User.fulfilled, (state, action) => {
      state.email = action.payload.email;
      state.privateKey = action.payload.privateKey;
      state.passKey = `P${PrivateKey.fromSeed(
        key.normalize_brainKey(`${action.payload.email}${action.payload.privateKey}`),
      ).toWif()}`;
      state.web3Pending = false;
    });
    builder.addCase(faceKIVerify.fulfilled, (state, action) => {
      state.faceKIStatus = action.payload.status;
      state.image = action.payload.image;
    });
    builder.addCase(faceKIVerify.rejected, state => {
      state.faceKIStatus = 'error';
      state.image = '';
    });
    builder.addCase(eSignatureProceed.pending, state => {
      state.eSignaturePending = true;
    });
    builder.addCase(eSignatureProceed.fulfilled, (state, action) => {
      console.log('E-signature reducer, payload: ', action.payload);
      state.eSignaturePending = false;
      state.eSignatureStatus = action.payload.type;
    });
    builder.addCase(getAccountPaymentStatus.fulfilled, (state, action) => {
      console.log('PaymentStatus reducer, payload: ', action.payload);
      state.paymentStatus = action.payload;
    });
    builder.addCase(registerAccount.fulfilled, (state, action) => {
      console.log('Registration reducer, payload: ', action.payload);
      state.registerStatus = action.payload;
    });
  },
});

export const { step1Save, clearFaceKI, clearSignUpState } = signUpSlice.actions;
export default signUpSlice.reducer;
