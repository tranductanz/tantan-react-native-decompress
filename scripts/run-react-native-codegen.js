#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const packageJson = require(path.join(root, 'package.json'));
const codegenConfig = packageJson.codegenConfig;
const rnPath = path.join(root, 'node_modules', 'react-native');

console.log('[Decompress] 🔧 Running React Native Codegen check...');

// ✅ Chỉ chạy nếu:
// 1. Có react-native
// 2. Có codegenConfig hợp lệ
// 3. Không đang ở trong chính thư viện node_modules
if (
  fs.existsSync(rnPath) &&
  codegenConfig &&
  codegenConfig.name &&
  codegenConfig.jsSrcsDir &&
  !__dirname.includes('node_modules')
) {
  try {
    console.log('[Decompress] 🛠️ Executing: npx react-native codegen');
    execSync('npx react-native codegen', {
      stdio: 'inherit',
      cwd: root,
    });
    console.log('[Decompress] ✅ Codegen completed.');
  } catch (err) {
    console.warn(
      '[Decompress] ⚠️ Codegen failed, but may be safely ignored in consumer app:\n',
      err.message
    );
  }
} else {
  console.log(
    '[Decompress] ⏭️ Skipped codegen (react-native or config not found)'
  );
}
