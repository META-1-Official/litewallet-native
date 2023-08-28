import { StackNavigationProp } from '@react-navigation/stack/lib/typescript/src/types';
import { AppDispatch } from '../store/createStore';
import { setTradingPair } from '../store/dex/dex.reducer';

const useRedirectToAsset = (
  dispatch: AppDispatch,
  navigation: StackNavigationProp<any, any, any>,
) => {
  return (assetSymbol: string): void => {
    dispatch(setTradingPair({ assetA: assetSymbol, assetB: 'USDT' }));
    navigation.navigate('DEX__AssetViewStack');
  };
};

export default useRedirectToAsset;
