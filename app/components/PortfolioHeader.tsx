import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AssetBalanceT } from '../utils/meta1Api';
import { useStore } from '../store';
import { colors } from '../styles/colors';
import { ArrowUp } from 'react-native-feather';

const { width, height } = Dimensions.get('screen');

interface Props {
  protfolioAssets: AssetBalanceT[];
}

const ProfitIndicator = () => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 3,
        backgroundColor: '#00aa09',
        paddingHorizontal: 6,
      }}
    >
      <ArrowUp stroke="#fff" width="12" />
      <Text style={{ color: '#fff' }}>4.52%</Text>
    </View>
  );
};

const ButtonGroup = () => {
  const Button = ({ title }: { title: string }) => (
    <TouchableOpacity activeOpacity={0.5} onPress={() => {}}>
      <Text style={{ color: '#fff', fontWeight: '600', fontSize: 15 }}> {title} </Text>
    </TouchableOpacity>
  );
  const SeparatorHorizontal = () => (
    <View
      style={{
        width: 1,
        backgroundColor: '#ffffff8f',
      }}
    />
  );
  return (
    <View
      style={{
        backgroundColor: '#cc9900',
        alignSelf: 'stretch',
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 12,
        marginVertical: 24,
        marginHorizontal: 48,
        borderRadius: 1000,
      }}
    >
      <Button title="Send" />
      <SeparatorHorizontal />
      <Button title="Receive" />

      <SeparatorHorizontal />
      <Button title="Trade" />
    </View>
  );
};
const PortfolioHeader: React.FC<Props> = ({ protfolioAssets }) => {
  const accountName = useStore(state => state.accountName);
  const accountTotal = protfolioAssets.reduce((acc, cv) => acc + cv.total_value, 0);
  return (
    <View style={styles.container}>
      <Text style={styles.accountName}>@{accountName}</Text>
      <Text style={styles.accountTotal}>${accountTotal.toFixed(2)}</Text>
      <ProfitIndicator />
      <ButtonGroup />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    minHeight: height / 4,
    width: width,
    backgroundColor: colors.BrandYellow,
    alignItems: 'center',
  },
  accountName: {
    fontSize: 22,
    fontWeight: '600',
    marginTop: 32,
    marginBottom: 8,
  },
  accountTotal: {
    fontSize: 36,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 8,
  },
});

export default PortfolioHeader;
