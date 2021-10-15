// TODO
import React from 'react';
import {
  Animated,
  Dimensions,
  Image,
  ImageStyle,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MockCard from './MockCard';
import { colors } from '../styles/colors';
import { getRandomAddress } from '../utils';
import { coinAsset, logoAsset, marketingBsAssetOne, marketingBsAssetTwo } from '../../assets';
import { Heading } from './typography';

const { width, height } = Dimensions.get('screen');

interface Content {
  visual: JSX.Element;
  heading: string;
  body: string;
}

const DATA: Content[] = [
  {
    visual: (
      <Image
        style={{
          height: height / 4,
          marginTop: height / 8,
          resizeMode: 'contain',
        }}
        source={logoAsset}
      />
    ),
    heading: 'META Lite Wallet',
    body: 'The easiest and most secure crypto\nwallet',
  },
  {
    visual: (
      <Image
        style={{
          //width: womd,
          height: height / 3,
          transform: [{ scale: 0.8 }],
          resizeMode: 'contain',
          overflow: 'hidden',
        }}
        source={coinAsset}
      />
    ),
    heading: 'All your digital assets\nin one place',
    body: 'Take control of your tokens and collectibles\nby storing them on your own device',
  },
  {
    visual: (
      <View
        style={{
          alignSelf: 'stretch',
          marginTop: 12,
          marginBottom: 24,
        }}
      >
        <MockCard text="Sent from" username="Abobous" address={getRandomAddress()} />
        <MockCard text="Recived by" username="Amogus" address={getRandomAddress()} />
      </View>
    ),
    heading: 'Easily send and receive\ncryptocurrency',
    body: 'Pay anyone in the world with just their\nMeta1 Wallet username',
  },
  {
    //Lazy parsing for styles decl
    visual: (() => {
      const _style: Readonly<ImageStyle> = {
        width: width / 2 - 10,
        height: height / 4,
        resizeMode: 'contain',
      };
      return (
        <View style={{ flexDirection: 'row', marginBottom: 48 }}>
          <Image style={_style} source={marketingBsAssetOne} />
          <Image style={_style} source={marketingBsAssetTwo} />
        </View>
      );
    })(),
    heading: 'Decentralized Apps to Explorethe Universe',
    body: 'Decentralized exchanges, digital\ncollectibles and more!',
  },
];

function renderItem({ item }: ListRenderItemInfo<Content>) {
  return (
    <View style={[styles.card, { width }]}>
      {item.visual}
      <Heading style={styles.heading}>{item.heading}</Heading>
      <Text style={styles.body}>{item.body}</Text>
    </View>
  );
}

interface ScrollXProp {
  scrollX: Animated.Value;
}

function Indicator({ scrollX }: ScrollXProp) {
  const indicators = DATA.map((_, i) => {
    const backgroundColor = scrollX.interpolate({
      inputRange: DATA.map((_, ii) => ii * width),
      outputRange: DATA.map((_, ii) => (i === ii ? colors.BrandYellow : colors.dotGray)),
    });
    return <Animated.View key={`indicator_${i}`} style={[styles.indicator, { backgroundColor }]} />;
  });

  return <View style={styles.indicatorContrainer}>{indicators}</View>;
}

export const Backdrop = ({ scrollX }: ScrollXProp) => {
  const scale = scrollX.interpolate({
    inputRange: DATA.map((_, i) => i * width),
    outputRange: [0, 0, 1, 0],
  });
  return (
    <Animated.View
      style={{
        backgroundColor: colors.BrandYellow,
        position: 'absolute',
        top: width * -1.3,
        height: width * 2,
        borderRadius: width * 2,
        width: width * 2,
        transform: [{ scale }],
      }}
    />
  );
};

export default function ContentSlider({ scrollX }: ScrollXProp) {
  return (
    <View style={styles.container}>
      <Animated.FlatList
        data={DATA}
        renderItem={renderItem}
        horizontal
        scrollEventThrottle={32}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: false,
        })}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
      />
      <Indicator scrollX={scrollX} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  card: {
    flex: 1,
    overflow: 'hidden',
    alignItems: 'center',
  },
  heading: {
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 14,
  },
  body: {
    fontSize: 18,
    color: '#607383',
    textAlign: 'center',
  },
  indicatorContrainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: 8,
  },
  marketingImg: {
    width: width / 2 - 10,
  },
});
