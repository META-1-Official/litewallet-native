/**
 * @format
 */
import 'react-native-gesture-handler';
import './globals';
import 'react-native-get-random-values';
import { AppRegistry } from 'react-native';
import App from './app/App';
import { name as appName } from './app.json';
import { Buffer } from 'buffer';

global.Buffer = Buffer;

AppRegistry.registerComponent(appName, () => App);
