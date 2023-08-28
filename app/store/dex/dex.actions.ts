import { createAsyncThunk } from '@reduxjs/toolkit';
import { getHistoricalOrders } from '../../services/meta1Api';
import { filterOrdersByAssets } from './dex.helper';

interface DexPayload {
  accountName: string;
  assetA?: string;
  assetB?: string;
}

export const getDexData = createAsyncThunk(
  'dex/getDexData',
  async ({ accountName, assetA, assetB }: DexPayload) => {
    const historicalOrders = await getHistoricalOrders(accountName);
    return assetA ? filterOrdersByAssets(historicalOrders, assetA, assetB) : historicalOrders;
  },
);
