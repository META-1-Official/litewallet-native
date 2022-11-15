import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { eSignatureSign } from './eSignature.actions';

interface ESignatureState {
  street: string;
  city: string;
  state: string;
  zip: string;
  sign: string;
  token: string;
}

const initialState: ESignatureState = {
  street: '',
  city: '',
  state: '',
  zip: '',
  sign: '',
  token: '',
};

const eSignatureSlice = createSlice({
  name: 'eSignature',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    clearESignatureState: () => ({ ...initialState }),
  },
  extraReducers: builder => {
    builder.addCase(eSignatureSign.fulfilled, () => {
      console.log('Done yeah!');
    });
  },
});

export const { clearESignatureState, setToken } = eSignatureSlice.actions;
export default eSignatureSlice.reducer;
