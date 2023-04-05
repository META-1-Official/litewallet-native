import { useState, useRef } from 'React';
import { editing } from './helpers';

// Basically do not update if meself is editing
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
