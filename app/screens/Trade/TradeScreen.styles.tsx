import { StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';
import { shadow, style } from '../../utils';

const styles = StyleSheet.create({
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assetIcon: { width: 42, height: 42, resizeMode: 'contain', marginRight: 8 },
  font18x500: { fontSize: 18, fontWeight: '500' },
  whiteText: { color: '#fff' },
  font14: { fontSize: 14 },
  amountInput: {
    fontSize: 18,
    padding: 0,
    fontWeight: '500',
    textAlign: 'right',
    color: '#000',
  },
  rowEnd: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  usdtLabel: { fontSize: 14, textAlign: 'right', padding: 0 },
  listStyle: { backgroundColor: '#fff', borderRadius: 8, margin: 18 },
  listView: { padding: 16, borderBottomWidth: 2, borderBottomColor: '#eceef0' },
  rowJustifyBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listHeading: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  buttonContainer: {
    margin: 32,
    marginTop: 128,
    alignItems: 'center',
  },
  button: {
    ...shadow.D3,
    padding: 12,
    paddingHorizontal: 32,
    borderRadius: 5,
    marginBottom: 24,
    backgroundColor: colors.BrandYellow,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  usdInput: style(
    {
      marginLeft: 8,
      fontSize: 14,
      color: colors.mutedGray,
      textAlign: 'right',
    },
    {
      android: {
        height: 18,
        padding: 0,
        marginTop: 1,
      },
    },
  ),
  // Dark mode
  darkRoot: { backgroundColor: '#320001', height: '100%' },
  darkBtnView: {
    backgroundColor: colors.BrandYellow,
    alignItems: 'center',
    padding: 18,
    margin: 24,
    borderRadius: 8,
  },
  darkListView: {
    padding: 0,
    margin: 16,
    paddingBottom: 16,
    marginBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: colors.BrandYellow,
  },
  darkList: {
    backgroundColor: '#3f0000',
    borderRadius: 18,
  },
  center: {
    alignItems: 'center',
  },
  m12: {
    margin: 12,
  },
});

export default styles;
