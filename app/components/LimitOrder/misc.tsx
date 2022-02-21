import assert from 'assert';
import React, { useReducer } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Minus, Plus } from 'react-native-feather';
import { SvgIcons } from '../../../assets';
import { useAVStore } from '../../screens/dex/AssetView/AssetViewStore';
import { useStore } from '../../store';
import { colors } from '../../styles/colors';
import { catchError, ensure, promptPromise, Timeout } from '../../utils';
import { placeLimitOrder, useAssets, useAssetsStore } from '../../utils/meta1Api';
import { useLoaderModal } from '../LoaderModal';

interface InputRowProps {
  title: string;
  value: string;
  onChange?: (s: s) => void;
  onInc?: () => void;
  onDec?: () => void;
}
export const InputRow: React.FC<InputRowProps> = ({ title, value, onChange, onInc, onDec }) => {
  return (
    <View
      style={{
        borderBottomWidth: 1,
        borderBottomColor: '#fff3',
        paddingBottom: 12,
        marginBottom: 12,
      }}
    >
      <Text style={{ color: colors.BrandYellow }}>{title}</Text>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <TextInput
          style={{
            color: '#fff',
            fontSize: 28,
            fontWeight: 'bold',
          }}
          value={value}
          editable={!!onChange}
          onChangeText={onChange}
        />
        <View style={{ flexDirection: 'row' }}>
          {onChange ? (
            <>
              <TouchableOpacity
                onPress={() => onDec?.()}
                style={{
                  backgroundColor: '#481400',
                  paddingHorizontal: 12,
                  paddingVertical: 4,
                  borderRadius: 5,
                  margin: 4,
                }}
              >
                <Minus width={28} height={28} color={colors.BrandYellow} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onInc?.()}
                style={{
                  backgroundColor: '#481400',
                  paddingHorizontal: 12,
                  paddingVertical: 4,
                  borderRadius: 5,
                  margin: 4,
                }}
              >
                <Plus width={28} height={28} color={colors.BrandYellow} />
              </TouchableOpacity>
            </>
          ) : null}
        </View>
      </View>
    </View>
  );
};

export const TotalRow: React.FC<{ symbol: string; set: (n: number) => void }> = ({
  symbol,
  set,
}) => {
  const LeText: React.FC = ({ children }) => (
    <Text style={{ marginHorizontal: 4, color: '#ccc' }}>{children}</Text>
  );
  const accountAssets = useAssets();
  if (!accountAssets) {
    return null;
  }

  const found = accountAssets.assetsWithBalance.find(e => e.symbol === symbol);
  assert(found, 'Asset not found in assets list');
  return (
    <View style={{ flexDirection: 'row', paddingBottom: 16 }}>
      <SvgIcons.wallet width={16} height={16} fill={colors.BrandYellow} />
      <LeText>
        {found.amount} {found.symbol}
        {'  | '}
      </LeText>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          flexGrow: 1,
        }}
      >
        <TouchableOpacity onPress={() => set(found.amount * 0.25)}>
          <LeText>25%</LeText>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => set(found.amount * 0.5)}>
          <LeText>50%</LeText>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => set(found.amount * 0.75)}>
          <LeText>75%</LeText>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => set(found.amount * 1.0)}>
          <LeText>100%</LeText>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export const asAsset = (assetName: string) => {
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

export const usePair = (type: OrderType) => {
  const { assetA, assetB } = useAVStore();
  const pair = [assetA, assetB];
  switch (type) {
    case OrderType.Buy:
      return pair;
    case OrderType.Sell:
      return pair.reverse();
  }
};

export enum OrderType {
  Buy = 'BUY',
  Sell = 'SELL',
}
export const useCreateOrder = (toGive: any, toGet: any, type: OrderType) => {
  const { LoaderModal, showLoader, hideLoader } = useLoaderModal();
  const { accountName, password } = useStore();
  const getPassword = async () =>
    password
      ? password
      : await promptPromise(
          'Enter password',
          'Password is required for this operation',
          'secure-text',
        );

  const getAccountInfo = async () => ({
    accountName,
    password: ensure(await getPassword()),
  });

  const fn = (price: number, amount: number) => async () => {
    const accountInfo = await getAccountInfo();
    if (accountInfo.password === null) {
      return;
    }
    showLoader();
    const to = await Timeout(
      placeLimitOrder(accountInfo, {
        toGet,
        toGive,
        totalPrice: type === OrderType.Sell ? 1 / price : price,
        amount,
      }),
      `Place Limit Order - ${type}`,
    );
    return to;
  };
  return {
    fn: (price: number, amount: number) =>
      catchError(fn(price, amount), {
        anyway: () => hideLoader(),
        errorMiddleware: (err: Error) => {
          if (err.message === 'Amount equal 0!') {
            err.message = 'Total too small';
          }
          return err;
        },
      }),
    Loader: LoaderModal,
  };
};

export enum Update {
  PRICE = 'PRICE',
  AMOUNT = 'AMOUNT',
  TOTAL = 'TOTAL',
  INC_PRICE = 'INC_PRICE',
  INC_AMOUNT = 'INC_AMOUNT',
  DEC_PRICE = 'DEC_PRICE',
  DEC_AMOUNT = 'DEC_AMOUNT',
}

interface Action {
  type: Update;
  payload?: string;
}

interface State {
  price: string;
  amount: string;
  total: string;
}

type s = string;
export const useOrderState = (assetA: string, assetB: string, oType: OrderType) => {
  const Num = (s: s) => {
    const n = Number(s);
    if (isNaN(n)) {
      throw new Error('Bad number');
    }
    return n;
  };
  const Str = (asset: string) => (n: number) => n.toFixed(asAsset(asset).precision());
  const [aStr, bStr] = [Str(assetA), Str(assetB)];
  const calcTotal = (a: s, b: s) => bStr(Num(a) * price(Num(b)));
  const price = (n: number) => (oType === OrderType.Sell ? 1 / n : n);

  const reducer = (state: State, action: Action): State => {
    const { type, payload } = action;

    const produce = (s: Partial<State>): State => {
      const tmp = { ...state, ...s };
      return { ...tmp, total: calcTotal(tmp.amount, tmp.price) };
    };
    try {
      switch (type) {
        case Update.AMOUNT:
          return produce({ amount: payload });

        case Update.PRICE:
          return produce({ price: payload });

        case Update.INC_AMOUNT:
          return produce({ amount: aStr(Num(state.amount) + 1) });

        case Update.INC_PRICE:
          return produce({ price: bStr(Num(state.price) + 1) });

        case Update.DEC_AMOUNT:
          if (Num(state.amount) === 0) {
            break;
          }
          return produce({ amount: aStr(Num(state.amount) - 1) });

        case Update.DEC_PRICE:
          if (Num(state.price) === 0) {
            break;
          }
          return produce({ price: bStr(Num(state.price) - 1) });

        case Update.TOTAL:
          const amt = Num(payload!) / price(Num(state.price));
          return produce({ amount: aStr(amt) });
        default:
          break;
      }
    } catch (e) {}
    return { ...state };
  };

  return useReducer(reducer, {
    price: '0.00',
    amount: '0.00',
    total: '0.00',
  });
};
