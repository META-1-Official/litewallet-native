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
  liveness: 'Spoof' | 'Genuine';
  mask: number;
  result: 'Face detected' | 'No face detected';
}

export interface VerifyStatus {
  name: string;
  score: number;
  status: 'Spoof Detected' | 'Verify OK';
}

export interface EnrollStatus {
  status: 'Face not Detected' | 'Enroll OK';
}
