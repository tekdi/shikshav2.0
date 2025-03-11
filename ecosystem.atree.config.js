module.exports = {
  apps: [
    {
      name: 'atree-app',
      script: 'node_modules/.bin/next',
      args: 'start -p 3003',
      cwd: 'apps/atree-app',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
