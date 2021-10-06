import React, {useRef} from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import ContentSlider, {Backdrop} from '../components/ContentSlider';
import RoundedButton from '../components/RoundedButton';
import {colors} from '../styles/colors';

const WelcomeScreen = () => {
  const CreateWalletPress = () => {};
  const LinkWalletPress = () => {};
  const scrollX = useRef(new Animated.Value(0)).current;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
      }}
    >
      <Backdrop scrollX={scrollX} />

      <ContentSlider scrollX={scrollX} />
      <View style={{alignSelf: 'stretch'}}>
        <RoundedButton title="Create META Wallet" onPress={CreateWalletPress} />

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
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
});

export default WelcomeScreen;
