import type { TurboModule } from 'react-native';
export interface Spec extends TurboModule {
    helloFunction(key: string): string;
    decompress(inputPath: string, outputPath: string): Promise<boolean>;
}
declare const _default: Spec;
export default _default;
