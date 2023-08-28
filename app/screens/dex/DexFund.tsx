import React, { useEffect, useState } from 'react';
import { Dimensions, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { Circle } from 'react-native-svg';
import { Grid, LineChart } from 'react-native-svg-charts';
import { DexTSP } from '.';
import Loader from '../../components/Loader';
import MaterialToggle from '../../components/MaterialToggle';
import { ProfitIndicator } from '../../components/PortfolioHeader';
import PortfolioListing from '../../components/PortfolioListing';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';
import { colors } from '../../styles/colors';
import { tid } from '../../utils';
import { getHistory } from '../../store/wallet/wallet.actions';
import useAssetsOnFocus from '../../hooks/useAssetsOnFocus';
import { setTradingPair } from '../../store/dex/dex.reducer';
import useRedirectToAsset from '../../hooks/useRedirectToAsset';

const GRAPH_INTERVAL = {
  '1D': 3600,
  '1W': 3600 * 7,
  '1M': 3600 * 7 * 30,
  '1Y': 3600 * 7 * 30 * 365,
  All: 0,
};

const GRAPH_TIMESTAMP_BEFORE = {
  '1D': 24 * 60 * 60 * 1000,
  '1W': 24 * 60 * 60 * 1000 * 7,
  '1M': 24 * 60 * 60 * 1000 * 30,
  '1Y': 24 * 60 * 60 * 1000 * 365,
  All: 0,
};

type GRAPH_INTERVAL_KEYS = keyof typeof GRAPH_INTERVAL;

const { width, height } = Dimensions.get('screen');
// const createMockChartData = (n: number) =>
//   Array.from(new Array(n), () => Math.round(Math.random() * 2000)).sort((a, b) =>
//     Math.random() > 0.2 ? a - b : 1,
//   );

// const capArrayLen = (x: number) => (x <= 0 ? x : Math.ceil(Math.log(x)) * 5);

const Chart = ({ data }: { data: number[] }) => {
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const Decorator = ({ x, y, data }: { x: any; y: any; data: number[] }) => {
    return data.map((value, index, arr) => {
      if (index === 0 || index === arr.length - 1) {
        return <Circle key={index} cx={x(index)} cy={y(value)} r={4} fill={colors.BrandYellow} />;
      }
      return null;
    });
  };

  return (
    <View>
      <View style={{ flexDirection: 'row-reverse' }}>
        <Text style={{ color: '#fff' }}>${data.slice(-1)[0].toFixed(2)}</Text>
      </View>
      <LineChart
        style={{ width: width, height: height / 10 }}
        data={data}
        svg={{ stroke: colors.BrandYellow, strokeWidth: 2 }}
        contentInset={{ top: 20, bottom: 20, left: 10, right: 45 }}
      >
        <Grid />
        {/*@ts-ignore*/}
        <Decorator />
      </LineChart>
      <View style={{ flexDirection: 'row' }}>
        <Text style={{ color: '#fff' }}>${data[0].toFixed(2)}</Text>
      </View>
    </View>
  );
};

const MAX_SAMPLES = 500;

const DexFund: React.FC<DexTSP> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const [curInterval, setCurInterval] = useState<GRAPH_INTERVAL_KEYS>('1D');
  const [showZeroBalance, setShowZeroBalance] = useState(false);
  const [chartData, setChartData] = useState<number[]>([0, 0]);
  const accountName = useAppSelector(state => state.wallet.accountName);
  const accountAssets = useAssetsOnFocus();
  const accountTotal = accountAssets?.accountTotal || 0;
  const showDexAsset = useRedirectToAsset(dispatch, navigation);

  useEffect(() => {
    var fromDate = new Date();
    fromDate.setTime(fromDate.getTime() - GRAPH_TIMESTAMP_BEFORE[curInterval]);
    dispatch(
      getHistory({
        accountName,
        skipSize: GRAPH_INTERVAL[curInterval],
        from: fromDate.toISOString(),
      }),
    )
      .unwrap()
      .then(e => {
        if (!e.data) {
          setChartData([0, accountTotal]);
          return;
        }
        let data = e.data;
        console.log('[old]', data.length);
        if (data.length > MAX_SAMPLES) {
          const interval = Math.floor(data.length / MAX_SAMPLES);
          const newData = [];
          for (let i = 0; i < data.length; i += interval) {
            newData.push(data[i]);
          }
          newData.push(data[data.length - 1]);
          data = newData;
          console.log(newData.length);
        }
        console.log('[new]', data.length);

        setChartData(data);
      })
      .catch(e => {
        console.error(e);
      });
  }, [curInterval, accountName, accountTotal]);

  if (!accountAssets) {
    return <Loader bgc="#000" />;
  }

  return (
    <SafeAreaView style={{ backgroundColor: '#000', height: '100%' }}>
      <View style={{ marginHorizontal: 12 }}>
        <Text style={{ color: '#ccc' }}> Portfolio Balance</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 32, fontWeight: '700' }}>
            ${accountAssets?.accountTotal.toFixed(2)}
          </Text>
          <View style={{ marginLeft: 12 }}>
            <ProfitIndicator change={accountAssets.changePercent || 0} />
          </View>
        </View>

        <Chart data={chartData} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
          {(Object.keys(GRAPH_INTERVAL) as GRAPH_INTERVAL_KEYS[]).map(e => (
            <TouchableOpacity
              {...tid(`DexFund/GraphInterval/${e}`)}
              onPress={() => setCurInterval(e)}
              key={e}
            >
              <Text
                key={e}
                style={{
                  color: curInterval === e ? colors.BrandYellow : '#fff',
                  fontSize: 16,
                  paddingVertical: 16,
                }}
              >
                {e}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: '#330000',
          alignSelf: 'stretch',
          paddingHorizontal: 32,
          paddingTop: 16,
          paddingBottom: 12,
          alignItems: 'flex-start',
        }}
      >
        <Text
          style={{
            color: colors.BrandYellow,
            fontSize: 16,
            fontWeight: '800',
          }}
        >
          WALLET
        </Text>
        <View style={{ flexDirection: 'row' }}>
          <Text
            style={{
              color: '#fff',
              fontSize: 13,
              fontWeight: '600',
              paddingVertical: 2,
              paddingRight: 8,
            }}
          >
            HIDE 0 BALANCE WALLET
          </Text>
          <MaterialToggle onChange={v => setShowZeroBalance(v)} />
        </View>
      </View>
      <PortfolioListing
        showZeroBalance={showZeroBalance}
        colors={{
          background: '#000',
          textPrimary: '#fff',
          textSecondary: '#fff',
        }}
        onPress={assetSymbol => assetSymbol !== 'USDT' && showDexAsset(assetSymbol)}
        usdPrimary
      />
    </SafeAreaView>
  );
};

export default DexFund;
