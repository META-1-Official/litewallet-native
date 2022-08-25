import { useState } from 'react';
import { useAssetPicker } from '../components/AssetSelectModal';
import { AssetBalanceT, useAssetsStore } from '../services/meta1Api';
import * as Sentry from '@sentry/react-native';
import { Ticker } from '../utils/meta1dexTypes';

export type theAsset = {
  asset: AssetBalanceT;
  open: () => void;
  amount: string;
  setAmount: (value: string) => void;
  /**
   * @param {updateAmount} updateAmount - true by default
   */
  formUsdt: (usdtAmount: string | number, updateAmount?: boolean) => number;
  toUsdt: (amt?: string | number | undefined) => number;
  getMax: () => number;
  setMax: () => void;
  canAfford: () => boolean;
  isAffordableForSwap: () => void;
  isAffordableForSend: () => void;
  opponent: () => theAsset;
  ticker?: Ticker;
  setTicker: (t?: Ticker) => void;
};

export type StandaloneAsset = Omit<theAsset, 'opponent'>;

export const createPair = (
  a: StandaloneAsset | null,
  b: StandaloneAsset | null,
): theAsset[] | null[] => {
  if (!a || !b) {
    return [null, null];
  }
  const A: theAsset = { ...a, opponent: () => B };
  const B: theAsset = { ...b, opponent: () => A };
  return [A, B];
};
export const useAsset = ({
  defaultValue,
  title,
  onClose,
}: {
  defaultValue?: AssetBalanceT;
  title: string;
  onClose?: () => void;
}): StandaloneAsset | null => {
  const [amount, _setAmount] = useState('0.00');
  const [asset, open] = useAssetPicker({
    defaultValue,
    title,
    onClose,
  });
  const [ticker, setTicker] = useState<Ticker | undefined>(undefined);
  if (!asset) {
    console.log('== DV', defaultValue);
    console.log('==========');
    console.log('== ASSET', asset);
    Sentry.captureMessage('No meta1 asset');
    return null;
  }

  const formUsdt = (usdtAmount: string | number, updateAmount = true) => {
    const n = Number(usdtAmount);
    if (!n && n !== 0) {
      console.error('Invalid amount');
      return 0;
    }

    const newAmount = n / asset.usdt_value;

    if (updateAmount) {
      setAmount(newAmount.toFixed(asset._asset.precision));
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

  const setMax = () => setAmount(asset.amount.toFixed(asset._asset.precision));
  const getMax = () => asset.amount;

  const canAfford = () => asset.amount >= Number(amount);

  const isAffordableForSwap = () => {
    if (!canAfford()) {
      throw new Error('Insufficient funds');
    }

    if (asset.symbol === 'META1' && Number(amount) === getMax()) {
      throw new Error(
        `Insufficient balance: prevented the swap of Max amount of META1.
        META1 coin is required to pay network fees, otherwise your account can become unusable`,
      );
    }

    const meta1 = useAssetsStore.getState().userAssets.find('META1');
    if (!meta1) {
      throw new Error('Failed to get META1 asset. Try again later.');
    }

    if (meta1.amount - 2e-5 <= 0) {
      throw new Error('Not enough META1 left to pay transaction fees.');
    }
    return;
  };

  const isAffordableForSend = () => {
    if (!canAfford()) {
      throw new Error('Insufficient funds');
    }

    if (asset.symbol === 'META1' && Number(amount) === getMax()) {
      throw new Error(
        `Insufficient balance: prevented the send of Max amount of META1. 
        META1 coin is required to pay network fees, otherwise your account can become unusable`,
      );
    }

    const meta1 = useAssetsStore.getState().userAssets.find('META1');
    if (!meta1) {
      throw new Error('Failed to get META1 asset. Try again later.');
    }
    const totalCost = 35e-5 + Number(amount) * Number(asset.symbol === 'META1');
    if (meta1.amount - totalCost <= 0) {
      throw new Error(
        `Not enough META1 left to pay transaction fees. This transaction requires ${totalCost} ${
          asset.symbol
        } (${35e-5} META1 fee)`,
      );
    }
    return;
  };

  const setAmount = (s: string) => setTimeout(() => _setAmount(s), 0);
  return {
    asset,
    open,
    amount,
    setAmount,
    formUsdt,
    toUsdt,
    getMax,
    setMax,
    canAfford,
    isAffordableForSwap,
    isAffordableForSend,
    ticker,
    setTicker,
  };
};
