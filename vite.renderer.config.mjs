import { defineConfig } from 'vite';
import { pluginExposeRenderer } from './vite.base.config.mjs';
import VueDevTools from 'vite-plugin-vue-devtools';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';

// https://vitejs.dev/config
export default defineConfig((env) => {
  /** @type {import('vite').ConfigEnv<'renderer'>} */
  const forgeEnv = env;
  const { root, mode, forgeConfigSelf } = forgeEnv;
  const name = forgeConfigSelf.name ?? '';

  /** @type {import('vite').UserConfig} */
  return {
    root,
    mode,
    base: './',
    build: {
      outDir: `.vite/renderer/${name}`,
    },
    plugins: [
      vue(),
      pluginExposeRenderer(name),
      VueDevTools(),
      vuetify({ autoImport: true })
    ],
    resolve: {
      preserveSymlinks: true,
      alias: {
        "~": `${root}/src/`
      }
    },
    clearScreen: false,
    // silence warnings from bootstrap with dart sass
    // have a look at https://github.com/twbs/bootstrap/issues/40962
    css: {
      preprocessorOptions: {
        scss: {
          silenceDeprecations: ['mixed-decls', 'color-functions', 'global-builtin', 'import', 'legacy-js-api']
        },
      }
    }
  };
});
