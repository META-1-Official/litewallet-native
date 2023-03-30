import React from 'react';
import { SafeAreaView } from 'react-native';
import WebView from 'react-native-webview';
import { ONRAMPER_API_KEY } from '@env';

const FundAccount: React.FC<{}> = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <WebView
        source={{
          uri: `https://buy.onramper.com/?color=ffc000&defaultAmount=1000&defaultFiat=USD&defaultCrypto=BTC&apiKey=${ONRAMPER_API_KEY}`,
        }}
        onShouldStartLoadWithRequest={req => {
          /** NOT WORKING; Actual implementations is in the patch
           * @see {@link this patches/react-native-webview+11.17.2.patch}
           */
          //prettier-ignore
          return !req.url.includes('google-analytics.com')
              && !req.url.includes('googletagmanager')
              && !req.url.includes('sentry.io');
        }}
      />
    </SafeAreaView>
  );
};

export default FundAccount;
