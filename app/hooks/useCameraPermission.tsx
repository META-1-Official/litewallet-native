import { useEffect, useState } from 'react';
import { Camera, CameraPermissionStatus } from 'react-native-vision-camera';
// import { CameraPermissionStatus } from 'react-native-vision-camera/src/Camera';

const useCameraPermission = () => {
  const [cameraPermission, setCameraPermission] = useState<CameraPermissionStatus>();

  useEffect(() => {
    (async () => {
      const newCameraPermission = await Camera.getCameraPermissionStatus();
      setCameraPermission(newCameraPermission);
    })();
  });

  return cameraPermission;
};

export default useCameraPermission;
