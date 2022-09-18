import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getWeb3User } from './signUp.actions';
import { SignUpState, Step1, Step2 } from './signUp.types';

const initialState: SignUpState = {
  firstName: '',
  lastName: '',
  mobile: '',
  accountName: '',
  email: '',
  privateKey: '',
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
    step2Save: (state, action: PayloadAction<Step2>) => {
      state.email = action.payload.email;
      state.privateKey = action.payload.privateKey;
    },
  },
  extraReducers: builder => {
    builder.addCase(getWeb3User.fulfilled, (state, action) => {
      state.email = action.payload.email;
      state.privateKey = action.payload.privateKey;
    });
  },
});

export const { step1Save, step2Save } = signUpSlice.actions;
export default signUpSlice.reducer;
