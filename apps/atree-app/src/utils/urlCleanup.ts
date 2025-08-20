/**
 * Cleans up authentication error fragments from the URL
 * Removes #error=login_required and related parameters
 */
export const cleanupAuthErrorFromUrl = () => {
  if (typeof window === 'undefined') return;

  const currentUrl = window.location.href;

  // Check if URL contains authentication error fragments
  if (
    currentUrl.includes('#error=login_required') ||
    currentUrl.includes('error=login_required')
  ) {
    // Remove the error fragment from URL
    const cleanUrl = currentUrl.split('#')[0];

    // Use replaceState to update URL without adding to browser history
    window.history.replaceState({}, document.title, cleanUrl);

    console.log('Cleaned authentication error from URL');
  }
};

/**
 * Checks if the current URL has authentication errors
 */
export const hasAuthError = (): boolean => {
  if (typeof window === 'undefined') return false;

  return window.location.href.includes('error=login_required');
};

/**
 * Comprehensive URL cleanup that runs before Keycloak initialization
 * This prevents the authentication error loop
 */
export const preKeycloakUrlCleanup = () => {
  if (typeof window === 'undefined') return;

  // Check for authentication errors in URL
  if (hasAuthError()) {
    // Clean the URL immediately
    cleanupAuthErrorFromUrl();

    // Store a flag to prevent Keycloak from trying to check SSO
    localStorage.setItem('skipKeycloakCheck', 'true');

    // Clear the flag after a short delay
    setTimeout(() => {
      localStorage.removeItem('skipKeycloakCheck');
    }, 1000);
  }
};

/**
 * Checks if Keycloak SSO check should be skipped
 */
export const shouldSkipKeycloakCheck = (): boolean => {
  if (typeof window === 'undefined') return false;

  return localStorage.getItem('skipKeycloakCheck') === 'true';
};
