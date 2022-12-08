import React from 'react';
import { Alert, Text, View } from 'react-native';
import RNRestart from 'react-native-restart';
import { MaterialToggleNew } from '../../components/MaterialToggle';
import { useOptions } from '../../store';

const OtherGroup = () => {
  // @ts-ignore
  const { sentryEnabled, sentryEnabledSet } = useOptions();
  const showAlert = () => {
    Alert.alert('Restart', 'Application restart is required to apply changes', [
      {
        text: 'Ok',
        onPress: () => RNRestart.Restart(),
      },
    ]);
  };

  return (
    <View>
      <Text style={{ color: '#fff', fontSize: 26, fontWeight: '600', marginBottom: 8 }}>
        Other
      </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: 12,
        }}
      >
        <Text style={{ color: '#fff', fontSize: 18 }}>Crash Reporting</Text>
        <MaterialToggleNew
          value={sentryEnabled}
          onPress={() => {
            sentryEnabledSet(!sentryEnabled);
            showAlert();
          }}
        />
      </View>
    </View>
  );
};

export default OtherGroup;
