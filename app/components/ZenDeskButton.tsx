import React, { useState } from 'react';
import { Dimensions, GestureResponderEvent } from 'react-native';
import { IconButton } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import * as Zendesk from 'react-native-zendesk-messaging';
import useZenDesk from '../hooks/useZenDesk';

const ZenDeskButton = () => {
  useZenDesk();

  const [positionX, setPositionX] = useState<number>(350);
  const [positionY, setPositionY] = useState<number>(730);
  const [isMovable, setIsMovable] = useState<boolean>(false);

  const xMax = Dimensions.get('window').width;
  const yMax = Dimensions.get('window').height;

  const handlePositionX = (position: number, width: number) => {
    if (position > width || position < 50) {
      return;
    } else {
      setPositionX(position);
    }
  };

  const handlePositionY = (position: number, height: number) => {
    if (position > height || position < 50) {
      return;
    } else {
      setPositionY(position);
    }
  };

  const handleTouchMove = (event: GestureResponderEvent) => {
    if (isMovable) {
      handlePositionX(event.nativeEvent.pageX, xMax);
      handlePositionY(event.nativeEvent.pageY, yMax);
    }
  };

  const handleLongPress = () => {
    setIsMovable(true);
  };

  const handlePressOut = () => {
    setIsMovable(false);
  };

  const handlePress = () => {
    Zendesk.openMessagingView();
  };

  return (
    <IconButton
      onPress={handlePress}
      onTouchMove={handleTouchMove}
      onLongPress={handleLongPress}
      onPressOut={handlePressOut}
      icon={<Icon name={'comments'} size={25} />}
      borderRadius="full"
      bg={'gray.200'}
      width={isMovable ? 60 : 50}
      height={isMovable ? 60 : 50}
      hitSlop={10}
      pressRetentionOffset={500}
      position={'absolute'}
      bottom={yMax - positionY}
      right={xMax - positionX}
      shadow={3}
    />
  );
};

export default ZenDeskButton;
