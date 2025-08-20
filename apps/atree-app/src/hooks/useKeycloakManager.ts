import { useKeycloak } from '@react-keycloak/web';
import { useCallback, useEffect, useState } from 'react';
import { cleanupAuthErrorFromUrl } from '../utils/urlCleanup';

export const useKeycloakManager = () => {
  const { keycloak, initialized } = useKeycloak();
  const [isSSOEnabled, setIsSSOEnabled] = useState(false);

  // Clean up authentication errors on mount
  useEffect(() => {
    cleanupAuthErrorFromUrl();
  }, []);

  // Enable SSO check when user goes to sign-in page
  const enableSSO = useCallback(() => {
    setIsSSOEnabled(true);
    if (keycloak && initialized) {
      // Trigger SSO check manually
      keycloak.init({
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: `${window.location.origin}/signin`,
        checkLoginIframe: false,
        enableLogging: false,
      });
    }
  }, [keycloak, initialized]);

  // Disable SSO check (for public browsing)
  const disableSSO = useCallback(() => {
    setIsSSOEnabled(false);
  }, []);

  // Manual login trigger
  const triggerLogin = useCallback(async () => {
    if (keycloak && initialized) {
      try {
        await keycloak.login({
          redirectUri: `${window.location.origin}/signin`,
        });
      } catch (error) {
        console.error('Login failed:', error);
      }
    }
  }, [keycloak, initialized]);

  return {
    isSSOEnabled,
    enableSSO,
    disableSSO,
    triggerLogin,
    isAuthenticated: keycloak?.authenticated || false,
    isInitialized: initialized,
  };
};
