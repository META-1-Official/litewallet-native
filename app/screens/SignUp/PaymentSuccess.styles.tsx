import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: { paddingHorizontal: 20 },
  title: { fontSize: 30, fontWeight: 'bold' },
  subtitle: { fontSize: 18, paddingTop: 5 },
  passKeyForm: {
    paddingHorizontal: 20,
  },
  inputWrapper: {
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
    backgroundColor: '#FFF2F2',
    borderColor: '#FF2F2F',
    borderWidth: 1,
    padding: 20,
  },
  importantInfoTitle: { fontSize: 22 },
  importantInfoDescription: { fontSize: 15, paddingTop: 15 },
  buttonGroup: { position: 'absolute', bottom: 0, width: '100%' },
});

export default styles;
