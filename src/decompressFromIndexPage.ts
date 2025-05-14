import RNBlobUtil from 'react-native-blob-util';
import { decompress } from './index';

export type DecompressResult = {
  modulePath: string;
  decompressedFiles: string[];
  brPathLocal: string[];
  stats: {
    totalBrFound: number;
    downloadedCount: number;
    skippedDownloadCount: number;
    decompressedCount: number;
    skippedDecompressCount: number;
    timeTakenMs: number;
  };
  failedFiles: { file: string; reason: string }[];
};

/**
 * Build local folder path for storing decompressed MiniApp module
 */
const buildModulePath = (
  moduleName: string,
  subModuleName?: string
): string => {
  const root = `${RNBlobUtil.fs.dirs.DocumentDir}/MiniAppCache`;
  return subModuleName
    ? `${root}/${moduleName}/${subModuleName}`
    : `${root}/${moduleName}`;
};

/**
 * Decompress all .br files listed from a CDN index page.
 * @param cdnBase CDN root URL (should point to a directory index HTML)
 * @param moduleName The name of the MiniApp module
 * @param subModuleName Optional sub-folder name for nested module structure
 * @returns DecompressResult includes paths and stats
 */
const decompressFromIndexPage = async (
  cdnBase: string,
  moduleName: string,
  subModuleName?: string
): Promise<DecompressResult> => {
  const start = Date.now();
  let downloadedCount = 0;
  let skippedDownloadCount = 0;
  let decompressedCount = 0;
  let skippedDecompressCount = 0;

  const decompressedFiles: string[] = [];
  const brPathLocal: string[] = [];
  const failedFiles: { file: string; reason: string }[] = [];

  const localDir = buildModulePath(moduleName, subModuleName);

  const exists = await RNBlobUtil.fs.exists(localDir);
  if (!exists) {
    await RNBlobUtil.fs.mkdir(localDir);
  }

  const normalizedCdnBase = cdnBase.endsWith('/') ? cdnBase : `${cdnBase}/`;

  let html = '';
  try {
    const res = await fetch(normalizedCdnBase);
    html = await res.text();
  } catch (err) {
    throw new Error(
      `❌ Failed to fetch index page from ${cdnBase}: ${(err as any).message}`
    );
  }

  const brFiles = Array.from(html.matchAll(/href="([^"]+\.br)"/g)).map(
    (m) => m[1]
  );

  console.log('📦 Found .br files:', brFiles);

  for (const file of brFiles) {
    try {
      const remoteBrUrl = `${normalizedCdnBase}${file}`;
      const rawFilename = file.replace(/\.br$/, '');
      const outputPath = `${localDir}/${rawFilename}`;
      const brPath = `${localDir}/${file}`;

      const brExists = await RNBlobUtil.fs.exists(brPath);
      if (!brExists) {
        await RNBlobUtil.config({ path: brPath }).fetch('GET', remoteBrUrl);
        downloadedCount++;
        console.log(`📥 Downloaded file: ${brPath}`);
      } else {
        skippedDownloadCount++;
        console.log(`📥 File .br đã tồn tại: ${brPath}`);
      }

      const outputExists = await RNBlobUtil.fs.exists(outputPath);
      if (!outputExists) {
        await decompress(brPath, outputPath);
        decompressedCount++;
        console.log(`✅ Decompressed to ${outputPath}`);
      } else {
        skippedDecompressCount++;
        console.log(`✅ File decompress đã tồn tại: ${outputPath}`);
      }

      decompressedFiles.push(outputPath);
      brPathLocal.push(brPath);
    } catch (err) {
      console.warn(`❌ Error processing ${file}:`, err);
      failedFiles.push({
        file,
        reason: (err as any)?.message ?? 'Unknown error',
      });
    }
  }

  const timeTakenMs = Date.now() - start;

  return {
    modulePath: localDir, // ✅ trả về path module đã xử lý
    decompressedFiles,
    brPathLocal,
    stats: {
      totalBrFound: brFiles.length,
      downloadedCount,
      skippedDownloadCount,
      decompressedCount,
      skippedDecompressCount,
      timeTakenMs,
    },
    failedFiles,
  };
};

export default decompressFromIndexPage;
