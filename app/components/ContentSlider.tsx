import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const SlideOne = () => (
  <>
    <Text>META Lite Wallet</Text>
    <Text>The easyiest and most secure crypto wallet</Text>
  </>
)
const Selected = () => (<Text>X</Text>);
const Disabled = () => (<Text>0</Text>)
const Invoke = (x: any) => x();
const ContentSlider = () => {
  const [idx, setIdx] = useState(0);
  const slides = [
    SlideOne,
    SlideOne,
    SlideOne,
    SlideOne
  ];

  return (
    <View style={styles.container}>
      { slides.length > idx ? Invoke(slides[idx]) : null}
      <Text>{ slides.map((_, i) => i === idx ? 'X' : '-')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    alignSelf: 'stretch',
    backgroundColor: 'lightblue'
  }
});

export default ContentSlider;
