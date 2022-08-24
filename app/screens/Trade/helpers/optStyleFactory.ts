import { kindaStyle } from '../types';

const optStyleFactory =
  (darkMode?: boolean) =>
  (x: kindaStyle, defaults?: kindaStyle): any => {
    if (darkMode) {
      return [defaults, x];
    }
    return [defaults];
  };

export default optStyleFactory;
