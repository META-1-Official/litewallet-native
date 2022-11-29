import Toast from 'react-native-toast-message';
import { FaceKIVerifyParams } from '../../services/faceKI/faceKI.service';
import { FaceAttributes, VerifyResponse } from '../../services/faceKI/types';

export const handleParamsError = ({
  image,
  accountName,
  email,
  privateKey,
}: FaceKIVerifyParams) => {
  console.log(
    'Start with accountName, email, privateKey, image',
    accountName,
    email,
    privateKey,
    image,
  );
  Toast.show({
    type: 'error',
    text1: 'AccountName, Email or image is empty!',
    text2: 'Please try to put accountName, email or image again.',
  });
};

export const handleFaceKIAuthenticationError = () => {
  Toast.show({
    type: 'error',
    text1: 'FaceKI Authentication error',
  });
  console.error('FaceKI authentication error');
};

export const handleSpoof = (faceAttributes: FaceAttributes) => {
  const toClose = 'Validation Failed, You are too close to the camera.';
  const tryAgain = 'Try changing your position or background.';
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
      text1: 'Validation Failed',
      text2: 'Try changing your position or background.',
    });
    console.error(faceAttributes.liveness, faceAttributes.result, tryAgain);
  }
};

export const handleFaceAttributes = (faceAttributes: FaceAttributes) => {
  console.log('Liveliness successful: ', faceAttributes.liveness, faceAttributes.result);
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
  console.log('FaceKi verify:', response.name);
  Toast.show({
    type: 'success',
    text1: response.status,
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

export const handleEmailNotMatchedWithUser = () => {
  console.error('Email and wallet name are not matched!');
  Toast.show({
    type: 'error',
    text1: 'Email and wallet name are not matched!',
    text2: 'Please try again!',
  });
};

export const handleVerifyError = () => {
  console.error(
    'Bio-metric verification failed for this email. Please use an email that has been linked to your face.',
  );
  Toast.show({
    type: 'error',
    text1: 'Bio-metric verification failed for this email.',
    text2: 'Please use an email that has been linked to your biometric verification / enrollment.',
  });
};

export const handleNeverBeenEnrolled = () => {
  console.error('We can not verify you because you have never been enrolled with your face.');
  Toast.show({
    type: 'error',
    text1: 'We can not verify you because you have never been enrolled with your face.',
    text2: 'Please try to signup!',
  });
};
