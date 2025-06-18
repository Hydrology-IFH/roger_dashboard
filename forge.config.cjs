const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

// load .dotenv file
require('dotenv').config();

// main configuration for Electron Forge
module.exports = {
  packagerConfig: {
    asar: true,
    icon: 'public/Logo',
  },
  rebuildConfig: {
    force: true,
    // onlyModules:
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        setupIcon: 'public/Logo.ico',
        iconUrl: 'https://raw.githubusercontent.com/Hydrology-IFH/roger_dashboard/master/public/Logo.ico',
        certificateFile: './windows-certificate.pfx',
        certificatePassword: process.env.WINDOWS_CERTIFICATE_PASSWORD
      },
    },
    {
      name: '@electron-forge/maker-deb',
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {
        format: 'ULFO'
      }
    }
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      authToken: process.env.GITHUB_TOKEN,
      config: {
        repository: {
          owner: 'Hydrology-IFH',
          name: 'roger_dashboard'
        },
        prerelease: false,
        draft: false
      }
    }
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    {
      name: '@electron-forge/plugin-vite',
      config: {
        build: [
          {
            entry: 'electron/main.cjs',
            config: 'vite.main.config.mjs',
          },
          {
            entry: 'electron/preload.mjs',
            config: 'vite.preload.config.mjs',
          },

        ],
        renderer: [
          {
            name: 'main_window',
            config: 'vite.renderer.config.mjs',
          }
        ],
      },
    },
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};
