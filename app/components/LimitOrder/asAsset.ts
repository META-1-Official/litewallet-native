import { useAssetsStore } from '../../services/meta1Api';

const asAsset = (assetName: string) => {
  const assets = useAssetsStore.getState().userAssets;
  if (assets.assetsWithBalance.length === 0) {
    throw new Error('Could not load assets');
  }

  const asset = assets.find(assetName);
  if (!asset) {
    throw new ReferenceError('Asset not found');
  }

  return {
    precision() {
      return asset._asset.precision;
    },
    balance() {
      return asset.amount;
    },
  };
};

export default asAsset;
