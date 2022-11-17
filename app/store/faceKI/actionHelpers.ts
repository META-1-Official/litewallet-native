import Toast from 'react-native-toast-message';
import { FaceKIVerifyParams } from '../../services/faceKI/faceKI.service';
import { FaceAttributes, VerifyResponse } from '../../services/faceKI/types';

export const handleParamsError = ({ image, email, privateKey }: FaceKIVerifyParams) => {
  console.log('Start with email, privateKey, image', email, privateKey, image);
  Toast.show({
    type: 'error',
    text1: 'Image or Email is empty!',
    text2: 'Please try to put image or email again.',
  });
};

export const handleSpoof = (faceAttributes: FaceAttributes) => {
  const toClose = 'You are too close to the camera.';
  const tryAgain = 'Liveliness is spoof try again!';
  if (faceAttributes.box.h > 120) {
    Toast.show({
      type: 'error',
      text1: toClose,
      text2: tryAgain,
    });
    console.error(faceAttributes.liveness, toClose, tryAgain);
  } else {
    Toast.show({
      type: 'error',
      text1: faceAttributes.liveness,
      text2: faceAttributes.result,
    });
    console.error(faceAttributes.liveness, faceAttributes.result, tryAgain);
  }
};

export const handleFaceAttributes = (faceAttributes: FaceAttributes) => {
  Toast.show({
    type: 'info',
    text1: faceAttributes.liveness,
    text2: faceAttributes.result,
  });
};

export const handleUsedEmail = () => {
  console.error('This email has already been used for another wallet.');
  Toast.show({
    type: 'error',
    text1: 'This email has already been used for another wallet.',
    text2: 'Please use different email for new wallet creation.',
  });
};

export const handleEnrollOk = (status: string) => {
  console.log('You have been enrolled!');
  Toast.show({
    type: 'success',
    text1: status,
    text2: 'You have been enrolled!',
  });
};

export const handleEnrollError = () => {
  console.error('You have not been enrolled!');
  Toast.show({
    type: 'error',
    text1: 'You have not been enrolled!',
  });
};

export const handleVerifyOk = (response: VerifyResponse) => {
  console.log('FaceKi verify:', response.data.name);
  Toast.show({
    type: 'success',
    text1: response.data.status,
    text2: 'You have been verified!',
  });
};

export const somethingWentWrong = (error: string) => {
  console.error(error);
  Toast.show({
    type: 'error',
    text1: 'Something went wrong!',
    text2: 'Please try again!',
  });
};
