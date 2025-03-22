import Keycloak from 'keycloak-js';

const keycloakConfig = {
  url: 'https://shiksha-dev-keycloak.tekdinext.com/auth',
  realm: 'shiksha',
  clientId: 'google-sso',
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;
