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
