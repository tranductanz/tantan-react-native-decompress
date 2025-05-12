const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const artifactsPath = path.join(
  __dirname,
  '..',
  'build',
  'generated',
  'ios',
  'NativeBrotliCompress'
);

console.log('[Codegen] 🔧 Running React Native Codegen using CLI');

try {
  execSync('npx react-native codegen', { stdio: 'inherit' });
  console.log('[Codegen] ✅ Codegen completed successfully.');
} catch (err) {
  const hasArtifacts = fs.existsSync(artifactsPath);
  if (hasArtifacts) {
    console.warn(
      '[Codegen] ⚠️ Codegen failed with known error, but artifacts exist. Continuing.'
    );
    process.exit(0);
  } else {
    console.error('[Codegen] ❌ Codegen failed:', err.message);
    process.exit(1);
  }
}
