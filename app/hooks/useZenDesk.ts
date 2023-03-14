import { useEffect } from 'react';
import { Platform } from 'react-native';
import * as Zendesk from 'react-native-zendesk-messaging';
import config from '../config';

const useZenDesk = () => {
  useEffect(() => {
    Zendesk.initialize({
      channelKey: Platform.OS === 'android' ? config.CHANNEL_KEY_ANDROID : config.CHANNEL_KEY_IOS,
    })
      .then(() => console.log('Zendesk initialization success!'))
      .catch(error => console.log('Zendesk initialization failed!', error));
  }, []);
};

export default useZenDesk;
