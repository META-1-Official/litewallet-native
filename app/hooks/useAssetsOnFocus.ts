import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { AccountBalanceT, fetchAccountBalances, useAssetsStore } from '../services/meta1Api';
import { useStore } from '../store';

const useAssetsOnFocus = () => {
  const [assets, setAssets] = useState<AccountBalanceT>({
    assetsWithBalance: [],
    accountTotal: 0,
    totalChange: 0,
    changePercent: 0,
    find: () => null,
  });
  const accountName = useStore(state => state.accountName);
  const userAssets = useAssetsStore(state => state.userAssets);
  const fetch = useAssetsStore(state => state.fetchUserAssets);
  if (!userAssets.assetsWithBalance.length) {
    fetch(accountName).then(() => {
      console.log('Assets fetched!');
    });
  }
  useFocusEffect(
    useCallback(() => {
      (async () => {
        const res = await fetchAccountBalances(accountName);
        console.log('Fetching callback');
        setAssets(res!);
      })();
    }, []),
  );
  return assets;
};

export default useAssetsOnFocus;
