import React from 'react';
import { createStackNavigator, StackScreenProps } from '@react-navigation/stack';
import { Platform, SafeAreaView, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ArrowLeft, ChevronRight } from 'react-native-feather';
import WalletHelp from './WalletHelp';
import BackupHelp from './BackoupHelp';
import { BlockchainHelp } from './BlockchainHelp';
import VotingHelp from './VotingHelp';
import AccoutnsHelp from './AccountsHelp';
import ProposedTxHelp from './ProposedTxHelp';
import PermissionsHelp from './PermissionsHelp';
import MembershipHelp from './MembershipsHelp';
import DexHelp from './DexHelp';
import TradingHelp from './TradingHelp';

type Screens = {
  Help_Home: undefined;
  Help_Wallet: undefined;
  Help_Backups: undefined;
  Help_Blockchain: undefined;
  Help_Voting: undefined;
  Help_Accounts: undefined;
  Help_ProposedTransactions: undefined;
  Help_Permissions: undefined;
  Help_Memberships: undefined;
  Help_DecentralizedExchange: undefined;
  Help_Trading: undefined;
};

const Names = [
  'Wallet',
  'Backups',
  'Blockchain',
  'Voting',
  'Accounts',
  'Proposed Transactions',
  'Permissions',
  'Memberships',
  'Decentralized Exchange',
  'Trading',
];

const name2id = (s: string) => `Help_${s.replace(/\s+/, '')}` as keyof Screens;
const id2name = (k: string | keyof Screens) => Names.find(e => name2id(e) === k);

function Index({ navigation }: SSP) {
  return (
    <SafeAreaView style={{ backgroundColor: '#000', flex: 1 }}>
      {Names.map((e, i) => (
        <TouchableOpacity
          onPress={() => navigation.navigate(name2id(e))}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 8,
            paddingHorizontal: 32,
          }}
        >
          <Text
            key={`Nav_io${i}}`}
            style={{
              fontSize: 18,
              fontWeight: '500',
              color: '#fff',
            }}
          >
            {e}
          </Text>
          <ChevronRight width={32} height={32} color="#fff" />
        </TouchableOpacity>
      ))}
    </SafeAreaView>
  );
}

type SSP = StackScreenProps<Screens>;
const Stack = createStackNavigator<Screens>();

function HelpStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        header: ({ navigation, route }) => {
          const BackButton = ({ color }: { color: string }) => (
            <TouchableOpacity
              style={{ marginHorizontal: 12 }}
              activeOpacity={0.5}
              onPress={navigation.goBack}
            >
              <ArrowLeft width={32} height={32} stroke={color} />
            </TouchableOpacity>
          );
          const title = id2name(route.name) || 'Help';
          return (
            <SafeAreaView
              style={{
                backgroundColor: '#000',
                height: (Platform.OS === 'ios' ? 89 : 48) + 8,
                paddingTop: Platform.OS === 'ios' ? 0 : 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <BackButton color="#fff" />
              <Text
                style={{
                  fontSize: 20,
                  color: '#fff',
                  fontWeight: '500',
                }}
              >
                {title}
              </Text>

              {/* Empty view for space between alignment, mimics back button sizing*/}
              <View style={{ width: 32, height: 32, marginHorizontal: 12 }} />
            </SafeAreaView>
          );
        },
      }}
    >
      <Stack.Screen name="Help_Home" component={Index} />
      <Stack.Screen name="Help_Wallet" component={WalletHelp} />
      <Stack.Screen name="Help_Backups" component={BackupHelp} />
      <Stack.Screen name="Help_Blockchain" component={BlockchainHelp} />

      <Stack.Screen name="Help_Voting" component={VotingHelp} />
      <Stack.Screen name="Help_Accounts" component={AccoutnsHelp} />
      <Stack.Screen name="Help_ProposedTransactions" component={ProposedTxHelp} />
      <Stack.Screen name="Help_Permissions" component={PermissionsHelp} />

      <Stack.Screen name="Help_Memberships" component={MembershipHelp} />
      <Stack.Screen name="Help_DecentralizedExchange" component={DexHelp} />
      <Stack.Screen name="Help_Trading" component={TradingHelp} />
    </Stack.Navigator>
  );
}
export default HelpStack;
