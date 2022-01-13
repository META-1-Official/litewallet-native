import React, { useState } from 'react';
import { useAssetPicker } from '../components/AssetSelectModal';
import { AssetBalanceT } from './meta1Api';

export type theAsset = {
  asset: AssetBalanceT;
  open: () => void;
  amount: string;
  setAmount: React.Dispatch<React.SetStateAction<string>>;
  Modal: ReturnType<typeof useAssetPicker>[3];
  formUsdt: (usdtAmount: string | number, updateAmount?: boolean) => number;
  toUsdt: (amt?: string | number | undefined) => number;
  getMax: () => number;
  setMax: () => void;
  opponent: () => theAsset;
};

export type StandaloneAsset = Omit<theAsset, 'opponent'>;

export const createPair = (a: StandaloneAsset, b: StandaloneAsset): theAsset[] => {
  const A: theAsset = { ...a, opponent: () => B };
  const B: theAsset = { ...b, opponent: () => A };
  return [A, B];
};
export const useAsset = (dv?: AssetBalanceT): StandaloneAsset => {
  const [asset, open, _close, Modal] = useAssetPicker(dv);
  if (!asset) {
    throw new Error('No such asset');
  }

  const formUsdt = (usdtAmount: string | number, updateAmount = true) => {
    const n = Number(usdtAmount);
    if (!n && n !== 0) {
      console.error('Invalid amount');
      return 0;
    }

    const newAmount = n / asset.usdt_value;

    if (updateAmount) {
      setAmount(newAmount.toFixed(8));
    }

    return newAmount;
  };

  const toUsdt = (amt?: string | number) => {
    const n = Number(typeof amt === 'undefined' ? amount : amt);
    if (!n && n !== 0) {
      console.error('Invalid amount');
      return 0;
    }
    const usdt = n * asset.usdt_value;
    return usdt;
  };

  const setMax = () => setAmount(asset.amount.toFixed(8));
  const getMax = () => asset.amount;

  const [amount, setAmount] = useState('0.00');
  return {
    asset,
    open,
    amount,
    setAmount,
    Modal,
    formUsdt,
    toUsdt,
    getMax,
    setMax,
  };
};
