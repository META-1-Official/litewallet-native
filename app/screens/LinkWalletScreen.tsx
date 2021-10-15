import React, { useRef } from 'react';
import {
  SafeAreaView,
  View,
  Image,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  KeyboardAwareScrollView,
  KeyboardAwareScrollViewProps,
} from 'react-native-keyboard-aware-scroll-view';
import { personAsset, personIconAsset } from '../../assets';
import RoundedButton from '../components/RoundedButton';
import { Heading, TextSecondary } from '../components/typography';
import useForm from '../utils/useForm';

const { width, height } = Dimensions.get('screen');
const scrollViewProps: { original: KeyboardAwareScrollViewProps | null } = { original: null };

type onScrollHandlerT = Exclude<KeyboardAwareScrollViewProps['onScroll'], undefined>;
const LinkWalletScreen: React.FC = () => {
  const { Input, formState, valid } = useForm([{ name: 'account_name', lable: 'Account Name' }]);
  const xRef = useRef<any>();
  const allowScroll = useRef(true);
  const lastPos = useRef({ x: 0, y: 0 }).current;

  const onScrollHandler: onScrollHandlerT = event => {
    const cx = event.nativeEvent.contentOffset.x;
    const cy = event.nativeEvent.contentOffset.y;

    if (allowScroll.current) {
      lastPos.x = cx;
      lastPos.y = cy;
      return;
    }

    console.log('should block scroll');
    if (cx != lastPos.x || cy != lastPos.y) {
      if (xRef.current) {
        lastPos.x = cx;
        lastPos.y = cy;
        xRef.current.scrollTo({ ...lastPos });
        return;
      }
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: '#fff',
      }}
    >
      <View style={{ marginHorizontal: 24 }}>
        <KeyboardAwareScrollView
          extraHeight={1}
          bounces={false}
          innerRef={ref => {
            xRef.current = ref;
          }}
          scrollEventThrottle={32}
          onScroll={onScrollHandler}
        >
          <Image
            source={personAsset}
            style={{
              width: width - 48,
              height: height / 3,
              resizeMode: 'contain',
              marginBottom: 50,
            }}
          />
          <Heading style={{ marginBottom: 8 }}>META Lite Wallet</Heading>
          <TextSecondary style={{ marginBottom: 18, fontSize: 15 }}>
            Type your wallet 'Account Name' in the box below and click the 'Link META Wallet' button
          </TextSecondary>
          <Input
            style={{
              paddingHorizontal: 32,
            }}
            name="account_name"
            render={props => (
              <View key={123} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  source={personIconAsset}
                  style={{
                    width: 24,
                    height: 32,
                    resizeMode: 'contain',
                  }}
                />
                <TextInput {...props} style={[props.style, { paddingLeft: 8 }]} />
              </View>
            )}
            onFocus={() => {
              setTimeout(() => {
                allowScroll.current = false;
              }, 3000);
            }}
          />
        </KeyboardAwareScrollView>
      </View>
      <View>
        <RoundedButton
          title="Submit"
          onPress={() => {
            //console.log({ formState, valid: valid() });
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default LinkWalletScreen;
