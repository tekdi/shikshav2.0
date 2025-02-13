/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

const BASE_PATH = process.env.VITE_MFE_TEST_REACT_VITE || '';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/mfes/test-react-vite',

  server: {
    port: 4200,
    host: 'localhost',
  },

  preview: {
    port: 4300,
    host: 'localhost',
  },

  plugins: [react(), nxViteTsPaths(), nxCopyAssetsPlugin(['*.md'])],
  
  //add nginix base here
  base: BASE_PATH, // Prepend this base path to all assets

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },

  build: {
    outDir: '../../dist/mfes/test-react-vite',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },

    //error solution for
    //[commonjs--resolver] Failed to resolve entry for package "fs". The package may have incorrect main/module/exports specified in its package.json.
    rollupOptions: {
      external: ['fs', 'stream', 'zlib'], // Exclude Node.js core modules
    },
    //end error solution
  },
});
