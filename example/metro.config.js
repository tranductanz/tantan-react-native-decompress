const path = require('path');
const { getDefaultConfig } = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

// 🔁 đường dẫn tuyệt đối tới thư viện gốc
const projectRoot = __dirname;
const workspaceRoot = path.resolve(__dirname, '..');

module.exports = {
  ...defaultConfig,
  watchFolders: [workspaceRoot], // 👈 Bắt Metro theo dõi thư viện cha

  resolver: {
    ...defaultConfig.resolver,

    extraNodeModules: {
      '@tantan/react-native-decompress': path.resolve(workspaceRoot),
    },
  },
};

// const path = require('path');

// module.exports = {
//   watchFolders: [path.resolve(__dirname, '..')],
//   resolver: {
//     extraNodeModules: {
//       'react-native': path.resolve(__dirname, 'node_modules/react-native'),
//     },
//   },
//   transformer: {
//     getTransformOptions: async () => ({
//       transform: {
//         experimentalImportSupport: false,
//         inlineRequires: true,
//       },
//     }),
//   },
// };
