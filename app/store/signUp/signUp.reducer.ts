import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { eSignatureProceed, getAccountPaymentStatus, registerAccount } from './signUp.actions';

interface Step1 {
  firstName: string;
  lastName: string;
  mobile: string;
  accountName: string;
  isMigration?: boolean;
  password?: string;
}

export interface SignUpState extends Step1 {
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
}

// const initialState: SignUpState = {
//   firstName: '',
//   lastName: '',
//   mobile: '',
//   accountName: '',
//   eSignatureStatus: '',
//   eSignaturePending: false,
//   paymentStatus: undefined,
//   registerStatus: undefined,
//   isMigration: false,
//   password: '',
// };
// todo: remove this and uncomment previous
const initialState: SignUpState = {
  firstName: 'Aleksandr',
  lastName: 'Ufimtsev',
  mobile: '9061977035',
  accountName: 'fimak-test1',
  eSignatureStatus: '',
  eSignaturePending: false,
  paymentStatus: undefined,
  registerStatus: undefined,
  isMigration: false,
  password: '',
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
      state.isMigration = action.payload.isMigration;
      state.password = action.payload.password;
    },
    clearESignature: state => {
      state.eSignatureStatus = '';
    },
    clearSignUpState: () => {
      console.log('Clearing signUp state!!!');
      return { ...initialState };
    },
  },
  extraReducers: builder => {
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

export const { step1Save, clearESignature, clearSignUpState } = signUpSlice.actions;
export default signUpSlice.reducer;
