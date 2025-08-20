import { useKeycloak } from '@react-keycloak/web';
import { useCallback } from 'react';

export const useAuthPopup = () => {
  const { keycloak } = useKeycloak();

  const showLoginPopup = useCallback(async () => {
    try {
      // Store the current content ID to redirect after login
      const currentPath = window.location.pathname;
      if (currentPath.includes('/contents/')) {
        const contentId = currentPath.split('/contents/')[1];
        localStorage.setItem('pendingContentRedirect', contentId);
      }

      // Redirect to local signin page instead of Keycloak
      window.location.href = '/signin';
    } catch (error) {
      console.error('Login redirect failed:', error);
      // Fallback to local signin page
      window.location.href = '/signin';
    }
  }, []);

  const checkAndRedirectAfterLogin = useCallback(() => {
    const pendingRedirect = localStorage.getItem('pendingContentRedirect');
    if (pendingRedirect && keycloak.authenticated) {
      localStorage.removeItem('pendingContentRedirect');
      window.location.href = `/contents/${pendingRedirect}`;
    }
  }, [keycloak.authenticated]);

  return {
    showLoginPopup,
    checkAndRedirectAfterLogin,
    isAuthenticated: keycloak.authenticated,
  };
};
