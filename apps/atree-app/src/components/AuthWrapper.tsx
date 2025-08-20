import React, { useEffect, useState } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { cleanupAuthErrorFromUrl } from '../utils/urlCleanup';

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { keycloak, initialized } = useKeycloak();
  const [isUrlCleaned, setIsUrlCleaned] = useState(false);

  useEffect(() => {
    // Clean up authentication errors from URL immediately
    if (!isUrlCleaned) {
      cleanupAuthErrorFromUrl();
      setIsUrlCleaned(true);
    }
  }, [isUrlCleaned]);

  useEffect(() => {
    // Only initialize Keycloak if URL is clean
    if (isUrlCleaned && initialized && keycloak) {
      // Check if user is already authenticated
      if (!keycloak.authenticated) {
        // Don't automatically redirect, let the app handle authentication when needed
        console.log('User not authenticated, but allowing public access');
      }
    }
  }, [isUrlCleaned, initialized, keycloak]);

  // Show loading while cleaning URL
  if (!isUrlCleaned) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default AuthWrapper;
