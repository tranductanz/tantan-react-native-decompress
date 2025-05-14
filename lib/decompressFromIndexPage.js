"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_blob_util_1 = __importDefault(require("react-native-blob-util"));
const index_1 = require("./index");
/**
 * Build local folder path for storing decompressed MiniApp module
 */
const buildModulePath = (moduleName, subModuleName) => {
    const root = `${react_native_blob_util_1.default.fs.dirs.DocumentDir}/MiniAppCache`;
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
const decompressFromIndexPage = async (cdnBase, moduleName, subModuleName) => {
    var _a;
    const start = Date.now();
    let downloadedCount = 0;
    let skippedDownloadCount = 0;
    let decompressedCount = 0;
    let skippedDecompressCount = 0;
    const decompressedFiles = [];
    const brPathLocal = [];
    const failedFiles = [];
    const localDir = buildModulePath(moduleName, subModuleName);
    const exists = await react_native_blob_util_1.default.fs.exists(localDir);
    if (!exists) {
        await react_native_blob_util_1.default.fs.mkdir(localDir);
    }
    const normalizedCdnBase = cdnBase.endsWith('/') ? cdnBase : `${cdnBase}/`;
    let html = '';
    try {
        const res = await fetch(normalizedCdnBase);
        html = await res.text();
    }
    catch (err) {
        throw new Error(`❌ Failed to fetch index page from ${cdnBase}: ${err.message}`);
    }
    const brFiles = Array.from(html.matchAll(/href="([^"]+\.br)"/g)).map((m) => m[1]);
    console.log('📦 Found .br files:', brFiles);
    for (const file of brFiles) {
        try {
            const remoteBrUrl = `${normalizedCdnBase}${file}`;
            const rawFilename = file.replace(/\.br$/, '');
            const outputPath = `${localDir}/${rawFilename}`;
            const brPath = `${localDir}/${file}`;
            const brExists = await react_native_blob_util_1.default.fs.exists(brPath);
            if (!brExists) {
                await react_native_blob_util_1.default.config({ path: brPath }).fetch('GET', remoteBrUrl);
                downloadedCount++;
                console.log(`📥 Downloaded file: ${brPath}`);
            }
            else {
                skippedDownloadCount++;
                console.log(`📥 File .br đã tồn tại: ${brPath}`);
            }
            const outputExists = await react_native_blob_util_1.default.fs.exists(outputPath);
            if (!outputExists) {
                await (0, index_1.decompress)(brPath, outputPath);
                decompressedCount++;
                console.log(`✅ Decompressed to ${outputPath}`);
            }
            else {
                skippedDecompressCount++;
                console.log(`✅ File decompress đã tồn tại: ${outputPath}`);
            }
            decompressedFiles.push(outputPath);
            brPathLocal.push(brPath);
        }
        catch (err) {
            console.warn(`❌ Error processing ${file}:`, err);
            failedFiles.push({
                file,
                reason: (_a = err === null || err === void 0 ? void 0 : err.message) !== null && _a !== void 0 ? _a : 'Unknown error',
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
exports.default = decompressFromIndexPage;
