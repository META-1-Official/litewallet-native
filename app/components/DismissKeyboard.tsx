import React from 'react';
import { TouchableWithoutFeedback, Keyboard, View, SafeAreaView } from 'react-native';
import { tid } from '../utils';

const DismissKeyboardHOC = (Comp: any) => {
  return ({ children, ...props }: any) => (
    <TouchableWithoutFeedback
      {...tid('DismissKeyboard')}
      onPress={Keyboard.dismiss}
      accessible={false}
    >
      <Comp {...props}>{children}</Comp>
    </TouchableWithoutFeedback>
  );
};
export const DismissKeyboardView = DismissKeyboardHOC(View);
/**
 * Dismiss Keyboard SafeAreaView
 */
export const DKSAV = DismissKeyboardHOC(SafeAreaView);
