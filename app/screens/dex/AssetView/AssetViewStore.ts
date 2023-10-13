import { create } from 'zustand';

interface x {
  assetA: string;
  assetB: string;
  save: (a: string, b: string) => void;
}

export const useAVStore = create<x>(set => ({
  assetA: '',
  assetB: '',
  save: (a: string, b: string) => set({ assetA: a, assetB: b }),
}));

// Xueta peredelivay
export const dexAssetView = (nav: any, assetA: string, assetB = 'USDT') => {
  const { save } = useAVStore.getState();
  save(assetA, assetB);
  nav.navigate('DEX__AssetViewStack');
};
