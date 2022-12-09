export enum Liveness {
  Spoof = 'Spoof',
  Genuine = 'Genuine',
}

export enum Enrollment {
  EnrollOk = 'Enroll OK',
  SpoofDetected = 'Spoof Detected',
  FaceNotDetected = 'Face not Detected',
}

export enum Verify {
  VerifyOk = 'Verify OK',
  SpoofDetected = 'Spoof Detected',
  NoUsers = 'No Users',
}

export enum FaceDetection {
  FaceDetected = 'Face detected',
  FaceNotDetected = 'No face detected',
}

export interface FaceAttributes {
  age: number;
  angles: {
    pitch: number;
    row: number;
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
  liveness: Liveness;
  mask: number;
  result: FaceDetection;
}

export interface VerifyResponse {
  name: string;
  score: number;
  status: Verify;
}

export interface EnrollResponse {
  status: Enrollment;
}

export interface FaceKIState {
  name?: string;
  image?: string;
  userList?: Array<String>;
  score?: number;
  userStatus?: 'Spoof Detected' | 'Face not Detected';
  status: 'pending' | 'success' | 'error' | undefined;
}

export interface FaceKILivenessResponse {
  data: FaceAttributes;
  status: 'ok';
}
