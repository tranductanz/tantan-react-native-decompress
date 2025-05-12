import NativeBrotliCompress from './NativeBrotliCompress';

export function helloFunction(key: string): string {
  return NativeBrotliCompress.helloFunction(key);
}

export function decompress(inputPath: string, outputPath: string): Promise<boolean> {
  return NativeBrotliCompress.decompress(inputPath, outputPath);
}
export { default as NativeBrotliCompress } from './NativeBrotliCompress';
