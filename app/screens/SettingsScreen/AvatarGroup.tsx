import React from 'react';
import { Alert, Text, View } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import useAppDispatch from '../../hooks/useAppDispatch';
import { deleteAvatar, uploadAvatar } from '../../store/wallet/wallet.actions';
import { isError } from '../../utils/errorUtils';
import ListItem from './ListItem';

const upload = async (dispatch: any) => {
  try {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      maxHeight: 500,
      maxWidth: 500,
      quality: 0.2,
    });

    const image = result.assets?.[0]!;
    console.log(result);
    if (result.didCancel) {
      return;
    }

    dispatch(uploadAvatar({ image }));
  } catch (e) {
    if (isError(e)) {
      console.warn(e.message);
    } else {
      console.warn(e);
    }
    Alert.alert('Failed to upload avatar');
  }
};

const AvatarGroup = () => {
  const dispatch = useAppDispatch();
  const handleDeleteAvatar = () => {
    Alert.alert('Remove avatar', 'Are you sure you want to continue', [
      {
        text: 'Cancel',
        onPress: () => false,
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => dispatch(deleteAvatar()),
      },
    ]);
  };

  return (
    <View>
      <Text style={{ color: '#fff', fontSize: 26, fontWeight: '600', marginBottom: 8 }}>
        Avatar
      </Text>
      <ListItem text="Upload" onPress={() => upload(dispatch)} />
      <ListItem text="Remove" color="#E03616" onPress={handleDeleteAvatar} />
    </View>
  );
};

export default AvatarGroup;
