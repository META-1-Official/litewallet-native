import React from 'react';
import { ActivityIndicator, SafeAreaView } from 'react-native';

const Loader: React.FC<{}> = () => {
  return (
    <SafeAreaView style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
      <ActivityIndicator />
    </SafeAreaView>
  );
};

export default Loader;
