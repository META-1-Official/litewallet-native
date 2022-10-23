import { useMemo } from 'react';
import { CameraDevice, CameraDeviceFormat } from 'react-native-vision-camera';

const sortFormatsByResolution = (left: CameraDeviceFormat, right: CameraDeviceFormat) => {
  // in this case, points aren't "normalized" (e.g. higher resolution = 1 point, lower resolution = -1 points)
  let leftPoints = left.photoHeight * left.photoWidth;
  let rightPoints = right.photoHeight * right.photoWidth;

  return leftPoints - rightPoints;
};

const useSortedCameraFormats = (device: CameraDevice | undefined) => {
  return useMemo(() => {
    if (!device) {
      return null;
    }
    return device?.formats.sort(sortFormatsByResolution);
  }, [device?.formats]);
};

export default useSortedCameraFormats;
