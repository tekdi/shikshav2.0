import Keycloak from 'keycloak-js';

const keycloakConfig = {
  //  url: 'https://dev-shiksha-admin.tekdinext.com/auth',
   url: 'https://admin.sunbirdsaas.com/auth',
  realm: 'shiksha',
  clientId: 'google-sso',
  // Redirect to local signin page instead of root
  redirectUri: typeof window !== 'undefined' ? `${window.location.origin}/signin` : '',
  // Add response mode to prevent URL fragments
  responseMode: 'fragment',
};

const keycloak = new Keycloak(keycloakConfig);

// Add custom error handling to prevent authentication loops
keycloak.onAuthError = (error) => {
  console.log('Keycloak auth error:', error);
  // Clean up URL if there's an authentication error
  if (typeof window !== 'undefined') {
    const currentUrl = window.location.href;
    if (currentUrl.includes('#error=login_required')) {
      const cleanUrl = currentUrl.split('#')[0];
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }
};

export default keycloak;
