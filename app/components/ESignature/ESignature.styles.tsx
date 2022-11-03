import { Dimensions, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    height: Dimensions.get('window').height - 110,
  },
  row: {
    flexDirection: 'column',
  },
  pdfWrapper: {
    flex: 1,
    width: '100%',
    alignSelf: 'stretch',
    marginTop: 25,
    height: 400,
  },
  pdf: {
    flex: 1,
    width: '100%',
    borderWidth: 1,
    borderColor: '#000000',
    marginBottom: 20,
  },
});

export default styles;
