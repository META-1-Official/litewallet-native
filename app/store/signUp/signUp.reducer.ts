import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  eSignatureProceed,
  getAccountPaymentStatus,
  migrateAccount,
  registerAccount,
} from './signUp.actions';

interface Step1 {
  firstName: string;
  lastName: string;
  mobile: string;
  accountName: string;
  isMigration?: boolean;
  password?: string;
}

export interface SignUpState extends Step1 {
  // todo: move it to eSignature reducer
  eSignatureStatus: string; // 'cancel' | 'dismiss'
  eSignaturePending: boolean;
  // todo: fix type of payment status
  paymentStatus: any;
  registerStatus?: {
    active_key: string;
    memo_key: string;
    name: string;
    owner_key: string;
    referrer: string;
  };
  pending: boolean;
}

const initialState: SignUpState = {
  firstName: '',
  lastName: '',
  mobile: '',
  accountName: '',
  eSignatureStatus: '',
  eSignaturePending: false,
  paymentStatus: undefined,
  registerStatus: undefined,
  isMigration: false,
  password: '',
  pending: false,
};
// todo: remove this and uncomment previous
// const initialState: SignUpState = {
//   firstName: 'User',
//   lastName: 'Test',
//   mobile: '+10000000010',
//   accountName: 'user-x23',
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
    // todo: move it to eSignature reducer
    clearESignature: state => {
      state.eSignatureStatus = '';
    },
    clearSignUpState: () => {
      console.log('Clearing signUp state!');
      return { ...initialState };
    },
  },
  extraReducers: builder => {
    // todo: move it to eSignature reducer
    builder.addCase(eSignatureProceed.pending, state => {
      state.eSignaturePending = true;
    });
    // todo: move it to eSignature reducer
    builder.addCase(eSignatureProceed.fulfilled, (state, action) => {
      console.log('E-signature reducer, payload: ', action.payload);
      state.eSignaturePending = false;
      state.eSignatureStatus = action.payload.type;
    });
    builder.addCase(eSignatureProceed.rejected, state => {
      state.eSignaturePending = false;
    });
    builder.addCase(getAccountPaymentStatus.pending, state => {
      state.pending = true;
    });
    builder.addCase(getAccountPaymentStatus.fulfilled, (state, action) => {
      console.log('PaymentStatus reducer, payload: ', action.payload);
      state.paymentStatus = action.payload;
      state.pending = false;
    });
    builder.addCase(getAccountPaymentStatus.rejected, state => {
      state.pending = false;
    });
    builder.addCase(registerAccount.fulfilled, (state, action) => {
      console.log('Registration reducer, payload: ', action.payload);
      state.registerStatus = action.payload;
    });
    builder.addCase(migrateAccount.fulfilled, (state, action) => {
      state.isMigration = Boolean(action.payload.error);
    });
  },
});

export const { step1Save, clearESignature, clearSignUpState } = signUpSlice.actions;
export default signUpSlice.reducer;
