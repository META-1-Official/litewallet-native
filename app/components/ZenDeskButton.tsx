import React from 'react';
import { IconButton } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import * as Zendesk from 'react-native-zendesk-messaging';

const ZenDeskButton = () => {
  const handlePress = () => {
    Zendesk.openMessagingView();
  };

  return (
    <IconButton
      onPress={handlePress}
      icon={<Icon name={'comments'} size={25} />}
      borderRadius="full"
      bg={'gray.200'}
      width={50}
      position={'absolute'}
      right={5}
      bottom={12}
      shadow={3}
    />
  );
};

export default ZenDeskButton;
