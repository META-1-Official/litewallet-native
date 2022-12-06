import { createSlice } from '@reduxjs/toolkit';

interface ConfigState {
  sentryEnabled: boolean;
  firstTime: boolean;
}

const initialState: ConfigState = {
  sentryEnabled: false,
  firstTime: true,
};

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    sentryEnabledSet: (state, action) => {
      state.sentryEnabled = action.payload;
    },
    firstTimeSet: (state, action) => {
      state.firstTime = action.payload;
    },
  },
});

export const {} = configSlice.actions;
export default configSlice.reducer;
