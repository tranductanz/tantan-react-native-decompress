import { TurboModuleRegistry } from 'react-native';
import type { TurboModule } from 'react-native';

export interface Spec extends TurboModule {
    helloFunction(key: string): string;
    decompress(inputPath: string, outputPath: string): Promise<boolean>;
}

// ✅ Quan trọng: `NativeBrotliCompress` đúng tên với moduleName
export default TurboModuleRegistry.getEnforcing<Spec>('NativeBrotliCompress');
