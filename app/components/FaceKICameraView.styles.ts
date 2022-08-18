import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    marginTop: -20,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    // @ts-ignore
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '115%',
  },
  frame: {
    width: 320,
    height: 400,
  },
  leftTop: {
    width: 40,
    height: 40,
    borderWidth: 2,
    borderColor: '#fff',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  leftBottom: {
    width: 40,
    height: 40,
    position: 'absolute',
    bottom: 0,
    borderWidth: 2,
    borderColor: '#fff',
    borderRightColor: 'transparent',
    borderTopColor: 'transparent',
  },
  rightTop: {
    width: 40,
    height: 40,
    position: 'absolute',
    right: 0,
    borderWidth: 2,
    borderColor: '#fff',
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  rightBottom: {
    width: 40,
    height: 40,
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: '#fff',
    borderLeftColor: 'transparent',
    borderTopColor: 'transparent',
  },
});

export default styles;
