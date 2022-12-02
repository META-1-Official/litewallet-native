import { useFocusEffect } from '@react-navigation/native';
import { useState } from 'react';
import { AccountBalanceT, useAssetsStore } from '../services/meta1Api';
import { useStore } from '../store';

const useAssetsOnFocus = () => {
  const [assets, setAssets] = useState<AccountBalanceT>();
  const accountName = useStore(state => state.accountName);
  const userAssets = useAssetsStore(state => state.userAssets);
  const fetch = useAssetsStore(state => state.fetchUserAssets);
  if (!userAssets.assetsWithBalance.length) {
    fetch(accountName).then(() => {
      console.log('Assets fetched!');
    });
  }
  useFocusEffect(() => {
    setAssets(userAssets);
  });
  return assets;
};

export default useAssetsOnFocus;
