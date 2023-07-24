import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { NativeModules, Platform } from 'react-native';
import 'dayjs/locale/ru';
import 'dayjs/locale/en';
import 'dayjs/locale/es';
import 'dayjs/locale/fr';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/de';

dayjs.extend(localizedFormat);

let deviceLocale =
  Platform.OS === 'ios'
    ? NativeModules.SettingsManager.settings.AppleLocale
    : NativeModules.I18nManager.localeIdentifier;
if (deviceLocale === undefined) {
  deviceLocale = 'en';
}

dayjs.locale(deviceLocale.toLowerCase().split('_')[1]);

export const localizedOrderDate = (orderExpiration: string) => {
  return dayjs(orderExpiration)
    .subtract(1, 'year')
    .subtract(new Date().getTimezoneOffset(), 'minute')
    .format('ll LTS');
};
