import { createSlice } from '@reduxjs/toolkit';
import { FullHistoryOrder } from '../../services/meta1Api';
import { getDexData } from './dex.actions';
import { TradingPair } from '../../components/LimitOrder/types';

export interface DexState {
  orders: FullHistoryOrder[];
  tradingPair: TradingPair;
}

const initialState: DexState = {
  orders: [],
  tradingPair: { assetA: '', assetB: '' },
};

const dexSlice = createSlice({
  name: 'dex',
  initialState,
  reducers: {
    clearDexData: () => ({
      ...initialState,
    }),
    setTradingPair: (state, action) => {
      return {
        ...state,
        tradingPair: action.payload,
      };
    },
  },
  extraReducers: builder => {
    builder.addCase(getDexData.fulfilled, (state, action) => {
      state.orders = action.payload;
    });
  },
});

export default dexSlice.reducer;
export const { clearDexData, setTradingPair } = dexSlice.actions;
