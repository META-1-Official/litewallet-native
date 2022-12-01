import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  contentContainerStyle: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 30,
    paddingRight: 30,
  },
  header: {},
  title: { fontSize: 30, fontWeight: 'bold' },
  subtitle: { fontSize: 18, paddingTop: 5 },
  inputWrapper: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    padding: 10,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'black',
    borderRightColor: '#FFC000',
  },
  btnCopy: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    backgroundColor: '#FFC000',
    padding: 20,
  },
  importantInfo: {
    width: '100%',
    backgroundColor: '#FFF2F2',
    borderColor: '#FF2F2F',
    borderWidth: 1,
    padding: 20,
  },
  importantInfoTitle: { fontSize: 22 },
  importantInfoDescription: { fontSize: 15, paddingTop: 15 },
  checkboxGroup: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 35,
    width: '100%',
    flexGrow: 1,
  },
  checkboxRow: { flex: 1, flexDirection: 'row' },
  checkboxText: { marginLeft: 20, flex: 1 },
  buttonGroup: { position: 'relative', bottom: 0, width: '100%' },
});

export default styles;
