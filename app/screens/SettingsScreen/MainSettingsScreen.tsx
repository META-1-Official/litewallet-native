import React, { useEffect } from 'react';
import { Image, SafeAreaView, Text, View } from 'react-native';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';
import { getAccountData } from '../../store/wallet/wallet.actions';
import { colors } from '../../styles/colors';
import Divider from './Divider';
import AvatarGroup from './AvatarGroup';
import AccountGroup from './AccountGroup';
import OtherGroup from './OtherGroup';

const MainSettingsScreen = () => {
  const dispatch = useAppDispatch();
  const { accountName, avatarUrl } = useAppSelector(state => state.wallet);

  useEffect(() => {
    dispatch(getAccountData());
  }, []);

  return (
    <SafeAreaView style={{ margin: 18 }}>
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <View>
          <Text
            style={{
              color: colors.BrandYellow,
              fontSize: 24,
              fontWeight: '700',
            }}
          >
            @{accountName}
          </Text>
          <Text style={{ fontSize: 16, color: '#aaa' }}>Current Wallet</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
          }}
        >
          <Image
            source={{ uri: avatarUrl || undefined }}
            style={{
              width: 65,
              height: 65,
              backgroundColor: 'lightblue',
              borderRadius: 100,
            }}
          />
        </View>
      </View>
      <Divider />
      <AvatarGroup />
      <Divider />
      <AccountGroup />
      <Divider />
      <OtherGroup />
      {/* <Button onPress={() => logout()} title="logout" /> */}
    </SafeAreaView>
  );
};

export default MainSettingsScreen;
