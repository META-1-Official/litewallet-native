// Basically do not update if myself is editing
import { useRef, useState } from 'react';
import { editing } from '../constants';

const useCause = () => {
  const [isCause, setCause] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>();
  return {
    isCause,
    cause: () => {
      if (!isCause) {
        setCause(true);
        editing.current = setCause;
      }

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        setCause(false);
        editing.current = null;
      }, 5000);
    },
  };
};

export default useCause;
