import React from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  View,
} from 'react-native';
import { colors } from '../../styles/colors';

type WithChildren<T = {}> = T & { children?: React.ReactNode };

export function Heading({ children, first }: WithChildren<{ first?: boolean }>) {
  const comm: TextStyle = {
    marginTop: 18,
    marginBottom: 8,
  };
  if (first) {
    return <Text style={[comm, { fontSize: 28, color: '#fff' }]}>{children}</Text>;
  }
  return <Text style={[comm, { fontSize: 20, color: colors.BrandYellow }]}>{children}</Text>;
}

export function Paragraph({ children }: WithChildren) {
  return <Text style={{ fontSize: 18, color: '#fff' }}>{children}</Text>;
}

type LinkProps = WithChildren<{
  onPress?: () => void;
}>;
export function Link({ children, onPress }: LinkProps) {
  return (
    <Text
      style={{
        color: colors.BrandYellow,
        fontSize: 18,
        textDecorationLine: 'underline',
        paddingLeft: 123123,
      }}
      onPress={onPress}
    >
      {' '}
      {children}
    </Text>
  );
}
export function Spacer() {
  return <View style={{ height: 18 }} />;
}
export function Code({ children }: WithChildren<{}>) {
  const fontFamily = Platform.OS === 'ios' ? 'Courier' : 'monospace';

  return <Text style={{ fontFamily }}>{children}</Text>;
}

export function Page({ children }: WithChildren) {
  return (
    <SafeAreaView style={{ backgroundColor: '#000', flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 200 }}>{children}</ScrollView>
    </SafeAreaView>
  );
}
export function Row({ column, fixedSize }: { column: string; fixedSize: boolean }) {
  const col = column.split('|').filter(e => !!e);
  return (
    <View style={styles.rowStyle}>
      {col.map((data, i) => (
        <Cell fixedSize={fixedSize} key={`${i}__asdfasdf`} idx={i}>
          {data}
        </Cell>
      ))}
    </View>
  );
}

export function Cell({
  children,
  idx,
  fixedSize,
}: WithChildren<{ idx: number; fixedSize: boolean }>) {
  return (
    <View style={[styles.cellStyle, fixedSize ? { flex: idx === 1 ? 0.3 : 0.7 } : {}]}>
      <Text style={{ fontSize: 18, color: '#fff' }}>{children}</Text>
    </View>
  );
}
interface GridProps {
  children: React.ReactText;
  notFixedSize?: boolean;
}
/**
 * @param fixedSize NOTE: enabled by default cause lazy
 */
export function Grid({ children, notFixedSize }: GridProps) {
  const rows = children
    .toString()
    .split(';;')
    .filter(e => !!e);
  return (
    <View style={styles.gridContainer}>
      {rows.map((column, i) => (
        <Row fixedSize={!notFixedSize} key={`asdfasdf__${i}`} column={column} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    // width,
  },
  rowStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  cellStyle: {
    flex: 1,
    padding: 10,
    borderColor: '#888',
    borderWidth: 1,
  },
});
