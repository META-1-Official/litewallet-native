// TODO
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { colors } from '../styles/colors';

const { width, height } = Dimensions.get('screen');

interface Content {
  visual: JSX.Element;
  heading: string;
  body: string;
}

const emj = (s: string) => <Text style={{ fontSize: 144 }}>{s}</Text>;
const DATA: Content[] = [
  {
    visual: emj('😁'),
    heading: 'META Lite Wallet',
    body: 'The easiest and most secure crypto\nwallet',
  },
  {
    visual: emj('😋'),
    heading: 'All your digital assets\nin one place',
    body: 'Take control of your tokens and collectibles\nby storing them on your own device',
  },
  {
    visual: emj('😊'),
    heading: 'Easily send and receive\ncryptocurrency',
    body: 'Pay anyone in the world with just their\nMeta1 Wallet username',
  },
  {
    visual: emj('😒'),
    heading: 'Decentralized Apps to Explorethe Universe',
    body: 'Decentralized exchanges, digital\ncollectibles and more!',
  },
];

function renderItem({ item }: ListRenderItemInfo<Content>) {
  return (
    <View style={[styles.card, { width }]}>
      {item.visual}
      <Text style={styles.heading}>{item.heading}</Text>
      <Text style={styles.body}>{item.body}</Text>
    </View>
  );
}

function Indicator({ scrollX }: { scrollX: Animated.Value }) {
  
  const indicators = DATA.map((_, i) => {
    const backgroundColor = scrollX.interpolate({
      inputRange: DATA.map((_, i) => i * width),
      outputRange: DATA.map((_, ii) => i == ii ? colors.BrandYellow: colors.dotGray),
    });
    return <Animated.View key={`indicator_${i}`} style={[styles.indicator, {backgroundColor}]} />;
  });

  return <View style={styles.indicatorContrainer}>{indicators}</View>;
}
export default function ContentSlider() {
  const scrollX = useRef(new Animated.Value(0)).current;
  return (
    <View style={styles.container}>
      <Animated.FlatList
        data={DATA}
        renderItem={renderItem}
        horizontal
        scrollEventThrottle={32}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { listener: ((e: any) => console.log(e)), useNativeDriver: false}
        )}
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
    paddingTop: 120,
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
});
