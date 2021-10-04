import React from 'react';
import { StyleSheet, Text, View, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ContentSlider from '../components/ContentSlider';
import RoundedButton from '../components/RoundedButton';
import { colors } from '../styles/colors';

const WelcomeScreen = () => {
  const CreateWalletPress = () => {};
  const LinkWalletPress = () => {};
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center' }}
    >
      <ContentSlider/>
      <View style={{alignSelf:'stretch'}}>
      <RoundedButton
        title="Create META Wallet"
        onPress={CreateWalletPress}
      />
      
      <RoundedButton
        title="Link META Wallet"
        onPress={LinkWalletPress}
        styles={styles.LinkWalletStyle}
      />
      </View>
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  LinkWalletStyle: {
    color: colors.BrandYellow,
    backgroundColor: colors.transparent,
    borderColor:  colors.transparent
  }
});

export default WelcomeScreen;
