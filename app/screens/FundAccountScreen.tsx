import React from 'react';
import { SafeAreaView } from 'react-native';
import WebView from 'react-native-webview';

const FundAccount: React.FC<{}> = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <WebView
        source={{
          uri: 'https://widget.onramper.com/?color=ffc000&defaultAmount=1000&defaultFiat=USD&defaultCrypto=BTC&apiKey=pk_prod_k6LKERIMdGDE8geCxOApKSCy6mnfF5CuhI4TLZj55Wc0',
        }}
        onShouldStartLoadWithRequest={req => {
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
