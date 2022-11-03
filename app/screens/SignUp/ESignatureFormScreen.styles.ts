import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowHalf: {
    width: '48%',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'stretch',
    alignItems: 'stretch',
  },
});

export const webStyle = `
body,html {
  height: 150px;
}
.m-signature-pad--body {
  height: 150px;
}
.m-signature-pad--footer {
  display: none;
  margin: 0;
}
`;

export default styles;
