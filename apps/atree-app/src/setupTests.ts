import '@testing-library/jest-dom';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
  removeItem: jest.fn(),
  key: jest.fn(),
  length: 0,
};
global.localStorage = localStorageMock;

// Mock window.location
const locationMock = {
  reload: jest.fn(),
  assign: jest.fn(),
  replace: jest.fn(),
  pathname: '/',
  search: '',
  hash: '',
  href: 'http://localhost',
  origin: 'http://localhost',
  protocol: 'http:',
  host: 'localhost',
  hostname: 'localhost',
  port: '',
  ancestorOrigins: {
    length: 0,
    item: jest.fn(),
    contains: jest.fn(),
  },
};
Object.defineProperty(window, 'location', {
  value: locationMock,
  writable: true,
});

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        WELCOME_MESSAGE: 'Welcome to ATREE Digital Hub',
        CATEGORIES: 'Categories',
        RESOURCES: 'Resources',
      }),
  })
) as jest.Mock;

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/',
    route: '/',
    asPath: '/',
    query: {},
  }),
}));

// Reset mocks after each test
afterEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});
