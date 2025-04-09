// hooks/useUserRegistration.ts
import { useState } from 'react';
import { createUser } from '../service/content';

export const useUserRegistration = () => {
  const [showAlertMsg, setShowAlertMsg] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<
    'success' | 'error' | 'warning' | 'info'
  >('success');

  const registerUser = async (data: any) => {
    try {
      const payload = data;
      const response = await createUser(payload);

      if (response?.responseCode === 201) {
        setShowAlertMsg('User Login successfully!');
        setAlertSeverity('success');
      } else if (response?.response?.data?.responseCode === 400) {
        const err = response?.response?.data?.params?.err;
        setShowAlertMsg(err);
        setAlertSeverity('error');
        console.error('Register Error:', err);
      }
    } catch (error: any) {
      console.error('Register Error:', error);
      setShowAlertMsg('Something went wrong!');
      setAlertSeverity('error');
    }
  };

  return {
    registerUser,
    showAlertMsg,
    setShowAlertMsg,
    alertSeverity,
  };
};
