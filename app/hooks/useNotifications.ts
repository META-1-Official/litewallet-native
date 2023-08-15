import { useEffect } from 'react';
import Toast from 'react-native-toast-message';
import config from '../config';
import useAppSelector from './useAppSelector';

const useNotifications = () => {
  const { accountName } = useAppSelector(state => state.wallet);
  useEffect(() => {
    try {
      const websocket = new WebSocket(`${config.META1_CONNECTION_URL}?account=${accountName}`);
      websocket.onmessage = message => {
        console.log('Notification arrived', message);
        if (message && message.data) {
          const content = JSON.parse(message.data).content;
          Toast.show({ type: 'info', text1: content });
        }
      };
      websocket.onopen = () => {
        console.log('Setup notification websocket');
      };
    } catch (e) {
      console.log('Notification connection error', e);
    }
  }, []);
};

export default useNotifications;
