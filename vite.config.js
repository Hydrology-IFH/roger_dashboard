import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'
import electron from 'vite-plugin-electron/simple'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import inject from '@rollup/plugin-inject'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // VueDevTools(),
    nodePolyfills({
      // To add only specific polyfills, add them here. If no option is passed, adds all polyfills
      include: ['path'],
      // To exclude specific polyfills, add them to this list. Note: if include is provided, this has no effect
      exclude: [
        'http', // Excludes the polyfill for `http` and `node:http`.
      ],
      // Whether to polyfill specific globals.
      globals: {
        Buffer: true, // can also be 'build', 'dev', or false
        global: true,
        process: true,
      },
      // Override the default polyfills for specific modules.
      overrides: {
        // Since `fs` is not supported in browsers, we can use the `memfs` package to polyfill it.
        fs: 'memfs',
      },
      // Whether to polyfill `node:` protocol imports.
      protocolImports: true,
    }
  ),
    electron({
      main: {
        entry: "electron/main.js"
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    assetsInlineLimit: 24 * 1024,
    // rollupOptions: {
    //   plugins: [inject({
    //     include: ["node_modules/**"],
    //     modules: {path: ['node:path']}})]
    // }
  },
  base: './',
})
