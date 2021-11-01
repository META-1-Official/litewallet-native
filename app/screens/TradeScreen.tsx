import React, { useMemo, useState } from 'react';
import { Dimensions, Image, SafeAreaView, Text, TextInput, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { List } from '../components/List';
import Loader from '../components/Loader';
import { Heading, TextSecondary } from '../components/typography';
import { colors } from '../styles/colors';
import { useAssets } from '../utils/meta1Api';

const { width, height } = Dimensions.get('screen');

const Backdrop = () => (
  <View
    style={{
      width,
      height: height / 6 + 18,
      backgroundColor: colors.BrandYellow,
      zIndex: 0,
      position: 'absolute',
    }}
  />
);

const TradeScreen: React.FC = () => {
  const [selelctedAseetIdx, setSelelctedAseetIdx] = useState(0);
  const [aAmt, setAAmt] = useState('0.00');
  const [bAmt, setBAmt] = useState('0.00');

  const allAssets = useAssets();
  const avaliableAssets = useMemo(
    () =>
      allAssets?.assetsWithBalance
        .filter(e => e.amount > 0)
        .sort((a, b) => a.symbol.localeCompare(b.symbol)),
    [allAssets],
  );

  if (allAssets === null || !avaliableAssets) {
    return <Loader />;
  }
  console.log(avaliableAssets);
  const selectedAssetA = avaliableAssets.at(selelctedAseetIdx);
  const selectedAssetB = avaliableAssets.at(selelctedAseetIdx + 1);
  if (!selectedAssetA || !selectedAssetB) {
    return <Text> Nothing to swap</Text>;
  }
  return (
    <SafeAreaView>
      <Backdrop />
      <View>
        <View
          style={{
            alignSelf: 'flex-end',
            position: 'relative',
            left: -48,
            top: 32,
            zIndex: 1000,
            backgroundColor: '#330000',
            borderRadius: 4,
            padding: 8,
            paddingHorizontal: 12,
          }}
        >
          <TouchableOpacity onPress={() => {
              setAAmt(selectedAssetA.amount.toString());
              const amtB = selectedAssetA.total_value / selectedAssetB.usdt_value;
              setBAmt(amtB.toFixed(8));
            }}>
            <Text style={{ textAlign: 'center', color: colors.BrandYellow, fontWeight: '700' }}>
              MAX
            </Text>
          </TouchableOpacity>
        </View>

        <List style={{ backgroundColor: '#fff', borderRadius: 8, margin: 18 }}>
          <View style={{ padding: 16, borderBottomWidth: 2, borderBottomColor: '#eceef0' }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '500',
                marginBottom: 8,
              }}
            >
              Convert
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Image
                  style={{ width: 42, height: 42, resizeMode: 'contain', marginRight: 8 }}
                  source={selectedAssetA._asset.icon}
                />
                <View>
                  <Heading style={{ fontSize: 18, fontWeight: '500' }}>
                    {selectedAssetA.symbol}
                  </Heading>
                  <TextSecondary style={{ fontSize: 14 }}>BNB</TextSecondary>
                </View>
              </View>

              <View>
                <TextInput
                  style={{
                    fontSize: 18,
                    fontWeight: '500',
                    textAlign: 'right',
                    width: 100,
                  }}
                  keyboardType="numeric"
                  onChangeText={t => {
                    setAAmt(t);
                    const askPrice = selectedAssetA.usdt_value * Number(t);
                    const amtB = askPrice / selectedAssetB.usdt_value;
                    setBAmt(amtB.toFixed(8));
                  }}
                  value={aAmt}
                />
                <TextSecondary style={{ fontSize: 14, textAlign: 'right' }}>
                  US$ {(selectedAssetA.usdt_value * Number(aAmt)).toFixed(2)}
                </TextSecondary>
              </View>
            </View>
          </View>
          <View style={{ padding: 16 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '500',
                marginBottom: 8,
              }}
            >
              To
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Image
                  style={{ width: 42, height: 42, resizeMode: 'contain', marginRight: 8 }}
                  source={selectedAssetB._asset.icon}
                />
                <View>
                  <Heading style={{ fontSize: 18, fontWeight: '500' }}>
                    {selectedAssetB.symbol}
                  </Heading>
                  <TextSecondary style={{ fontSize: 14 }}>BNB</TextSecondary>
                </View>
              </View>

              <View>
                <TextInput
                  style={{
                    fontSize: 18,
                    fontWeight: '500',
                    textAlign: 'right',
                    width: 100,
                  }}
                  keyboardType="numeric"
                  onChangeText={t => {
                    setBAmt(t);
                    const askPrice = selectedAssetB.usdt_value * Number(t);
                    const amtA = askPrice / selectedAssetA.usdt_value;
                    setAAmt(amtA.toFixed(8));
                  }}
                  value={bAmt}
                />
                <TextSecondary style={{ fontSize: 14, textAlign: 'right' }}>
                  US$ {(selectedAssetB.usdt_value * Number(bAmt)).toFixed(2)}
                </TextSecondary>
              </View>
            </View>
          </View>
        </List>
      </View>
    </SafeAreaView>
  );
};
export default TradeScreen;
