import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import WebView from 'react-native-webview';
import html from '../../../../bruhchart/dist/index';
// import { Buffer } from 'buffer';
import { useTicker } from '../../../services/meta1Api';
import Loader from '../../../components/Loader';
import { ALL_BUCKETS } from '../../../utils/meta1dexTypes';
import { colors } from '../../../styles/colors';
import { tid } from '../../../utils';
import useAppSelector from '../../../hooks/useAppSelector';

const mkInject = (s: any) =>
  `window.candleSeries.setData(JSON.parse('${JSON.stringify(s)}'));
   window.chart.timeScale().fitContent();
   true;`;

const Candle: React.FC<{}> = () => {
  const { assetA, assetB } = useAppSelector(state => state.dex.tradingPair);
  const [bucket, setBucket] = useState(ALL_BUCKETS['1D']);
  const wwRef = useRef<WebView | null>(null);
  const ticks = useTicker(assetA, assetB, bucket);

  useEffect(() => {
    if (wwRef.current) {
      wwRef.current.injectJavaScript(mkInject(ticks));
    }
  }, [ticks]);

  if (!ticks) {
    return <Loader bgc="#000" />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: colors.BrandYellow,
          justifyContent: 'space-evenly',
          padding: 12,
        }}
      >
        {Object.keys(ALL_BUCKETS).map(e => (
          <TouchableOpacity
            {...tid(`AssetView/CandleChartInterval/${e}`)}
            key={`IntervalSel_${e}`}
            onPress={() => setBucket(ALL_BUCKETS[e])}
          >
            <Text style={{ color: bucket === ALL_BUCKETS[e] ? '#888' : '#000' }}>{e}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={{ flex: 1, borderColor: 'red', borderWidth: 1, borderStyle: 'solid' }}>
        <WebView
          ref={wwRef}
          source={{
            //uri: 'http://localhost:1234/',
            html: html, //Buffer.from(html, 'base64').toString(),
          }}
          scrollEnabled={false}
          onMessage={event => {
            console.log('webview: ', event.nativeEvent.data);
          }}
          injectedJavaScript={mkInject(ticks)}
        />
      </View>
    </SafeAreaView>
  );
};

export default Candle;
