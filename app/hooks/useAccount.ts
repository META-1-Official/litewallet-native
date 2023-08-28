import { useEffect, useState } from 'react';
import { _login } from '../services/meta1Api';
import { LoginRetT } from '../utils/meta1dexTypes';

const useAccount = (accountName: string, password: string) => {
  const [acc, setAcc] = useState<LoginRetT | null>(null);

  useEffect(() => {
    const fn = async () => {
      if (password) {
        setAcc(await _login(accountName, password));
      }
    };
    fn();
  }, [accountName, password]);

  return acc;
};

export default useAccount;
