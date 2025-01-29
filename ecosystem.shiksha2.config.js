module.exports = {
  apps: [
    {
      name: 'shiksha-app',
      script: 'node_modules/.bin/next',
      args: 'start -p 3002',
      cwd: 'apps/shiksha-app',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'registration',
      script: 'node_modules/.bin/next',
      args: 'start -p 4104',
      cwd: 'mfes/registration',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'content',
      script: 'node_modules/.bin/next',
      args: 'start -p 4105',
      cwd: 'mfes/content',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
