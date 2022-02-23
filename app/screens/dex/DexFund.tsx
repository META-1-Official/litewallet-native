import React, { useEffect, useState } from 'react';
import { Dimensions, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { Circle } from 'react-native-svg';
import { Grid, LineChart } from 'react-native-svg-charts';
import { DexTSP } from '.';
import Loader from '../../components/Loader';
import MaterialToggle from '../../components/MaterialToggle';
import { ProfitIndicator } from '../../components/PortfolioHeader';
import PortfolioListing from '../../components/PortfolioListing';
import { useStore } from '../../store';
import { colors } from '../../styles/colors';
import { useAssets } from '../../utils/meta1Api';
import { getHistory } from '../../utils/miscApi';
import { dexAssetView } from './AssetView/AssetViewStore';

const GRAPH_INTERVAL = {
  '1D': 1,
  '1W': 7,
  '1M': 31,
  '1Y': 365,
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
        style={{ width: width, height: height / 4 }}
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
  const [curInterval, setCurInterval] = useState<GRAPH_INTERVAL_KEYS>('1D');
  const [showZeroBalance, setShowZeroBalance] = useState(false);
  const [chartData, setChartData] = useState<number[]>([0, 0]);
  const accountName = useStore(s => s.accountName);
  const accountAssets = useAssets();
  const accountTotal = accountAssets?.accountTotal || 0;
  useEffect(() => {
    getHistory({
      accountName,
      skip_size: GRAPH_INTERVAL[curInterval],
    })
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
      .catch(e => console.error(e));
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
            <ProfitIndicator change={accountAssets.changePercent} />
          </View>
        </View>

        <Chart data={chartData} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
          {(Object.keys(GRAPH_INTERVAL) as GRAPH_INTERVAL_KEYS[]).map(e => (
            <TouchableOpacity onPress={() => setCurInterval(e)} key={e}>
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
        showZeroBallance={showZeroBalance}
        colors={{
          background: '#000',
          textPrimary: '#fff',
          textSecondary: '#fff',
        }}
        onPress={s => (s === 'USDT' ? null : dexAssetView(navigation, s))}
        usdPrimary
      />
    </SafeAreaView>
  );
};

export default DexFund;
