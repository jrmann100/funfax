import { appConfig } from './package.json'
import path from 'path';
import svelte from '@sveltejs/vite-plugin-svelte';
import preprocess from 'svelte-preprocess';
const { port } = appConfig
const production = process.env.NODE_ENV === 'production'
export default {
  server: {
    port: port,
  },
  build: {
    polyfillDynamicImport: false,
    cssCodeSplit: false,
    target: ['chrome61', 'edge18', 'es2019', 'firefox60', 'safari11'],
  },
  optimizeDeps: {
    exclude: ['@roxi/routify'],
  },
  resolve: {
    dedupe: ['@roxi/routify'],
    alias: [
      {
        find: '$src',
        replacement: path.resolve(__dirname, './src'),
      },
      {
        find: '$lib',
        replacement: path.resolve(__dirname, './src/lib'),
      },
    ],
  },
  plugins: [
    svelte({
      preprocess: preprocess(),
      emitCss: true,
      hot: !production,
    }),
  ],
}
