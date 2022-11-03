import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SignInState {
  accountName?: string;
}

const initialState: SignInState = {
  accountName: '',
};

const signInSlice = createSlice({
  name: 'signIn',
  initialState,
  reducers: {
    loginStep1: (state, action: PayloadAction<string>) => {
      state.accountName = action.payload;
    },
  },
  extraReducers: builder => {},
});

export const { loginStep1 } = signInSlice.actions;
export default signInSlice.reducer;
