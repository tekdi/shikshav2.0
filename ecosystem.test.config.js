module.exports = {
  apps: [
    {
      name: 'test-app',
      script: 'node_modules/.bin/next',
      args: 'start -p 3000',
      cwd: 'apps/test-app',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'test-next-route',
      script: 'node_modules/.bin/next',
      args: 'start -p 4100',
      cwd: 'mfes/test-next-route',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'test-react-vite-old',
      script: 'npx',
      args: 'vite preview --port 4200 --host 0.0.0.0',
      cwd: 'mfes/test-react-vite-old',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
