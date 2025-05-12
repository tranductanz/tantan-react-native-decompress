//
//  RCTNativeBrotliCompress.m
//  AwesomeProject
//
//  Created by Tran Tan on 1/5/25.
//

#import "RCTNativeBrotliCompress.h"
#import "BrotliDecoderWrapper.h"

@implementation RCTNativeBrotliCompress

// TurboModule binding
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
(const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeBrotliCompressSpecJSI>(params);
}

// Hello function (synchronous)
- (NSString *)helloFunction:(NSString *)name {
  NSLog(@"👋 Called from JS with name: %@", name);
  return [NSString stringWithFormat:@"Hello, %@!", name];
}

// Async decompress
- (void)decompress:(NSString *)inputPath
        outputPath:(NSString *)outputPath
           resolve:(RCTPromiseResolveBlock)resolve
           reject:(RCTPromiseRejectBlock)reject {
  const char *input = [inputPath UTF8String];
  const char *output = [outputPath UTF8String];

  NSLog(@"📂 Input path: %s", input);
  NSLog(@"📂 Output path: %s", output);

  NSError *error = nil;
  NSDictionary *fileAttributes = [[NSFileManager defaultManager] attributesOfItemAtPath:inputPath error:&error];
  if (fileAttributes) {
    NSNumber *fileSize = [fileAttributes objectForKey:NSFileSize];
    NSLog(@"📄 Kích thước file input: %lld bytes", [fileSize longLongValue]);
  } else {
    NSLog(@"⚠ Không đọc được kích thước file input: %@", error);
  }

  BOOL success = Brotli_Decompress_File(input, output);

  if (success) {
    NSLog(@"✅ Decompress thành công");
    resolve(@(YES));
  } else {
    NSLog(@"❌ Decompress thất bại");
    reject(@"brotli_error", @"Decompression failed", nil);
  }
}

+ (NSString *)moduleName {
  return @"NativeBrotliCompress";
}

@end
