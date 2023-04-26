import React from 'react';
import { ImageStyle, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { colors } from '../styles/colors';
import { shadow } from '../utils';

interface MockProps {
  text: string;
  username: string;
  address: string;
}

const MockCard = ({ text, username, address }: MockProps) => {
  const addressRedacted = [address.slice(2, 6), address.slice(-4)].join('...');
  return (
    <View style={styles.container}>
      <View style={styles.img} />
      <View>
        <View style={styles.line}>
          <Text style={styles.text}>{text}</Text>
          <Text style={[styles.text, styles.username]}> {username}</Text>
        </View>
        <Text style={styles.address}>0x{addressRedacted}</Text>
      </View>
    </View>
  );
};

const CommonStyles: { [key: string]: ViewStyle | TextStyle | ImageStyle } = {
  text: {
    fontWeight: '500',
    fontSize: 18,
  },
};

const styles = StyleSheet.create({
  container: {
    ...shadow.D3,
    backgroundColor: '#fff',
    alignSelf: 'stretch',
    alignItems: 'center',
    fontSize: 32,
    margin: 8,
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
  },
  line: {
    flexDirection: 'row',
  },
  username: {
    ...CommonStyles.text,
    color: colors.BrandYellow,
  },
  address: {
    color: '#607383',
  },
  text: {
    ...CommonStyles.text,
  },
  img: {
    ...shadow.D3,
    backgroundColor: 'lightblue',
    width: 65,
    height: 65,
    borderColor: '#fff',
    borderWidth: 3,
    borderRadius: 50,
    marginHorizontal: 12,
  },
});

export default MockCard;
