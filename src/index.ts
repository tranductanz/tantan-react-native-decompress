import NativeBrotliCompress from './NativeBrotliCompress';
import decompressFromIndexPage from './decompressFromIndexPage';
export function helloFunction(key: string): string {
  return NativeBrotliCompress.helloFunction(key);
}

export function decompress(
  inputPath: string,
  outputPath: string
): Promise<boolean> {
  return NativeBrotliCompress.decompress(inputPath, outputPath);
}

export { decompressFromIndexPage };

export { default as NativeBrotliCompress } from './NativeBrotliCompress';
