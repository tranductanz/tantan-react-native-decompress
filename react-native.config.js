module.exports = {
  project: {
    android: {
      sourceDir: './android',
    },
  },
  dependencies: {
    // để trống nếu không cần autolinking thủ công
  },
  codegenConfig: {
    name: 'NativeBrotliCompress',
    type: 'modules',
    jsSrcsDir: 'src',
    android: {
      javaPackageName: 'com.tantan.reactnativedecompress',
    },
  },
};
