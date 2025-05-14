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
    failedFiles: {
        file: string;
        reason: string;
    }[];
};
/**
 * Decompress all .br files listed from a CDN index page.
 * @param cdnBase CDN root URL (should point to a directory index HTML)
 * @param moduleName The name of the MiniApp module
 * @param subModuleName Optional sub-folder name for nested module structure
 * @returns DecompressResult includes paths and stats
 */
declare const decompressFromIndexPage: (cdnBase: string, moduleName: string, subModuleName?: string) => Promise<DecompressResult>;
export default decompressFromIndexPage;
