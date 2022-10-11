import { LOGIN_PROVIDER } from '@web3auth/react-native-sdk';

export interface Step1 {
  firstName: string;
  lastName: string;
  mobile: string;
  accountName: string;
  isMigration?: boolean;
  password?: string;
}

export interface Step2 {
  email: string;
  privateKey: string;
}

export interface SignUpState extends Step1, Step2 {
  passKey: string;
  web3Pending: boolean;
  faceKIStatus: string;
  image: string;
  eSignatureStatus: string; // 'cancel' | 'dismiss'
  registerStatus?: {
    active_key: string;
    memo_key: string;
    name: string;
    owner_key: string;
    referrer: string;
  };
}

export interface Web3UserParams {
  provider: keyof typeof LOGIN_PROVIDER;
}

export interface FaceKIState {
  name?: string;
  image?: string;
  userList?: Array<String>;
  score?: number;
  userStatus?: 'Spoof Detected' | 'Face not Detected';
  status: 'pending' | 'success' | 'error' | undefined;
}

export interface Response {
  data: {
    age: number;
    angles: {
      pitch: number;
      roll: number;
      yaw: number;
    };
    attr: {
      left_eye_open: number;
      mouth_close: number;
      right_eye_open: number;
      wear_glasses: number;
    };
    box: {
      h: number;
      w: number;
      x: number;
      y: number;
    };
    gender: number;
    liveness: 'Spoof';
    mask: number;
    result: 'No face detected';
  };
  status: 'ok';
}
