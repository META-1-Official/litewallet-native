import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Backdrop from '../components/Backdrop';
import { List } from '../components/List';
import RoundedButton from '../components/RoundedButton';
import { useStore } from '../store';
import { colors } from '../styles/colors';

const SendScreen: React.FC<{}> = () => {
  const accountName = useStore(state => state.accountName);
  const [amount, setAmount] = useState('0.00');
  return (
    <SafeAreaView>
      <Backdrop />
      <View>
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
                  onFocus={() => {}}
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
                  {Number(amount) * 121.12}
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
                <TouchableOpacity onPress={() => {}}>
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
            <Text style={{ fontSize: 18, fontWeight: '500' }}>Password</Text>
          </View>
        </List>
        <View
          style={{
            margin: 48,
            marginHorizontal: 64,
          }}
        >
          <RoundedButton onPress={() => {}} title="Confirm" />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SendScreen;

const styles = StyleSheet.create({
  SectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#ada3a2',
  },
});
