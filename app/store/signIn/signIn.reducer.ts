import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { login } from './signIn.actions';

interface SignInState {
  accountName?: string;
  token: string;
  isAuthorized: boolean;
  pending: boolean;
}

const initialState: SignInState = {
  accountName: '',
  token: '',
  isAuthorized: false,
  pending: false,
};
// todo: remove this and uncomment previous
// const initialState: SignInState = {
//   accountName: 'user-x23',
//   token: '',
//   isAuthorized: true,
//   pending: false,
// };

const signInSlice = createSlice({
  name: 'signIn',
  initialState,
  reducers: {
    loginStep1: (state, action: PayloadAction<string>) => {
      state.accountName = action.payload;
    },
    clearSignInInfo: () => {
      console.log('Clear signInState');
      return { ...initialState };
    },
  },
  extraReducers: builder => {
    builder.addCase(login.pending, state => {
      state.pending = true;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.token = action.payload.token;
      state.isAuthorized = true;
      state.pending = false;
    });
    builder.addCase(login.rejected, state => {
      state.pending = false;
    });
  },
});

export const { loginStep1, clearSignInInfo } = signInSlice.actions;
export default signInSlice.reducer;
