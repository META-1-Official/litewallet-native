import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import useAppSelector from '../hooks/useAppSelector';
import { AccountBalanceT } from '../services/meta1Api';
import { colors } from '../styles/colors';
import { ArrowDown, ArrowUp } from 'react-native-feather';
import { shadow, tid } from '../utils';
import { useNavigation } from '@react-navigation/core';
import { WalletNavigationProp } from '../screens/WalletScreen';

const { width, height } = Dimensions.get('screen');

interface Props {
  protfolioAssets: AccountBalanceT | null;
}

interface ProfitIndicatorProps {
  change: number;
}

export const ProfitIndicator: React.FC<ProfitIndicatorProps> = ({ change }) => {
  return (
    <View
      style={{
        ...shadow.D3,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 3,
        backgroundColor: change > 0 ? '#00aa09' : '#c00f00',
        paddingHorizontal: 6,
      }}
    >
      {change > 0 ? <ArrowUp stroke="#fff" width="12" /> : <ArrowDown stroke="#fff" width="12" />}
      <Text style={{ color: '#fff' }}>{Math.abs(change).toFixed(2)}%</Text>
    </View>
  );
};

const ButtonGroup = () => {
  const Button = ({ title, onPress }: { title: string; onPress: () => void }) => (
    <TouchableOpacity
      {...tid(`ButtonGroup/Button/${title}`)}
      activeOpacity={0.5}
      onPress={onPress}
    >
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

  const navigation = useNavigation<WalletNavigationProp>();

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
      <Button onPress={() => navigation.navigate('Wallet__Send')} title="Send" />
      <SeparatorHorizontal />
      <Button onPress={() => navigation.navigate('Wallet__Receive')} title="Receive" />

      <SeparatorHorizontal />
      <Button onPress={() => navigation.navigate('Wallet__Trade')} title="Trade" />
    </View>
  );
};
const PortfolioHeader: React.FC<Props> = ({ protfolioAssets }) => {
  const accountName = useAppSelector(state => state.wallet.accountName);
  return (
    <View style={styles.container}>
      <Text style={styles.accountName}>@{accountName}</Text>
      <Text style={styles.accountTotal}>${protfolioAssets!.accountTotal.toFixed(2)}</Text>
      <ProfitIndicator change={protfolioAssets!.totalChange} />
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
