import React from 'react';
import { Image, SafeAreaView, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView } from 'react-native-gesture-handler';
import { RootStackParamList } from '../../AuthNav';
import RoundedButton from '../../components/RoundedButton';
import { useAppSelector } from '../../hooks';

type Props = NativeStackScreenProps<RootStackParamList, 'FaceKISuccess'>;

export const FaceKISuccessScreen: React.FC<Props> = ({ navigation }) => {
  const { image } = useAppSelector(state => state.faceKI);

  const handleNext = () => {
    navigation.navigate('Passkey');
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: '#fff',
      }}
    >
      <ScrollView
        contentContainerStyle={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            backgroundColor: 'grey',
            borderRadius: 155,
            width: 310,
            height: 310,
            marginBottom: 40,
            overflow: 'hidden',
          }}
        >
          <Image style={{ width: '100%', height: '100%' }} source={{ uri: image || undefined }} />
        </View>
        <View style={{}}>
          <Text
            style={{ textAlign: 'center', fontSize: 42, fontWeight: 'bold', color: '#00AD6A' }}
          >
            Congrats!
          </Text>
          <Text style={{ textAlign: 'center', fontSize: 22 }}>
            The biometric data of your selfie successfully completed
          </Text>
        </View>
        <View style={{ position: 'absolute', bottom: 0, width: '100%' }}>
          <RoundedButton styles={{ flex: 1 }} title="Next" onPress={handleNext} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FaceKISuccessScreen;
