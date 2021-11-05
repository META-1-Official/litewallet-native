import React, { useState } from 'react';
import { Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Backdrop from '../components/Backdrop';
import { List } from '../components/List';
import Loader from '../components/Loader';
import RoundedButton from '../components/RoundedButton';
import { useStore } from '../store';
import { colors } from '../styles/colors';
import { catchError } from '../utils';
import { sendWithPassword, useAssets } from '../utils/meta1Api';

const SendScreen: React.FC<{}> = () => {
  const [amount, setAmount] = useState('0.00');
  const [toAccount, setToAccount] = useState('');
  const savedPassword = useStore(state => state.password);
  const [password, setPassword] = useState(savedPassword || '');
  const accountName = useStore(state => state.accountName);
  const assets = useAssets();
  if (!assets) {
    return <Loader />;
  }

  const meta1 = assets.assetsWithBalance.find(e => e.symbol === 'META1');
  if (!meta1) {
    return (
      <SafeAreaView>
        <Text> Cannot find META1 asset. </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <Backdrop />
      <ScrollView scrollEnabled={Platform.OS !== 'ios'}>
        <List style={{ backgroundColor: '#fff', borderRadius: 8, margin: 18 }}>
          <View style={{ padding: 16, borderBottomWidth: 2, borderBottomColor: '#eceef0' }}>
            <Text style={styles.SectionTitle}>From</Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <View>
                <TextInput
                  style={{
                    fontSize: 18,
                    fontWeight: '500',
                    color: '#000',
                  }}
                  editable={false}
                  value={accountName}
                />
              </View>
            </View>
          </View>
          <View style={{ padding: 16 }}>
            <Text style={styles.SectionTitle}>To</Text>
            <View>
              <TextInput
                style={{
                  fontSize: 18,
                  fontWeight: '500',
                  color: '#000',
                }}
                placeholder="Enter Account Name"
                placeholderTextColor="#888"
                value={toAccount}
                autoCapitalize={'none'}
                autoCorrect={false}
                onChangeText={t => setToAccount(t)}
              />
            </View>
          </View>
        </List>
        <List style={{ backgroundColor: '#fff', borderRadius: 8, margin: 18 }}>
          <View style={{ padding: 16 }}>
            <Text style={styles.SectionTitle}>Amount META1</Text>
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  paddingBottom: 6,
                  borderBottomColor: '#ccc',
                  borderBottomWidth: 2,
                }}
              >
                <TextInput
                  style={{
                    width: '85%',
                    fontSize: 20,
                    fontWeight: '500',
                    color: '#000',
                  }}
                  onChangeText={t => setAmount(t)}
                  keyboardType="numeric"
                  value={amount}
                />
                <Text style={{ paddingTop: 8, textAlign: 'right', fontWeight: '600' }}>META1</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  paddingTop: 6,
                  justifyContent: 'space-between',
                }}
              >
                <Text
                  style={{
                    textAlign: 'left',
                    color: colors.BrandYellow,
                    fontSize: 18,
                    fontWeight: '600',
                  }}
                >
                  {(Number(amount) * meta1.usdt_value).toFixed(2)}
                </Text>

                <Text style={{ paddingRight: 2, color: colors.BrandYellow, fontWeight: '600' }}>
                  USD
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                paddingTop: 6,
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#617283', fontWeight: '500' }}> FEE: 0.0035 META1 </Text>
              <View
                style={{
                  backgroundColor: '#330000',
                  borderRadius: 4,
                  padding: 8,
                  paddingHorizontal: 12,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setAmount(meta1.amount.toString());
                  }}
                >
                  <Text
                    style={{ textAlign: 'center', color: colors.BrandYellow, fontWeight: '700' }}
                  >
                    MAX
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </List>
        <List style={{ backgroundColor: '#fff', borderRadius: 8, margin: 18 }}>
          <View style={{ padding: 16 }}>
            <TextInput
              style={{ fontSize: 18, fontWeight: '500' }}
              value={password}
              placeholder="Password"
              onChangeText={t => setPassword(t)}
            />
          </View>
        </List>
        <View
          style={{
            margin: 48,
            marginHorizontal: 64,
          }}
        >
          <RoundedButton
            onPress={() => {
              catchError(async () => {
                await sendWithPassword(
                  {
                    accountName,
                    password,
                  },
                  {
                    toAccount,
                    asset: meta1.symbol,
                    amount: Number(amount),
                  },
                );
              });
            }}
            title="Confirm"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SendScreen;

const styles = StyleSheet.create({
  SectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: Platform.OS === 'ios' ? 8 : 2,
    color: '#ada3a2',
  },
});
