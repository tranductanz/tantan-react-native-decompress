require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "ReactNativeDecompress"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => "11.0" }

  # ✅ Git repo của bạn
  s.source       = { :git => "https://github.com/tranductanz/tantan-react-native-decompress.git", :tag => "#{s.version}" }

  # ✅ Bao gồm cả mã gốc và codegen
  s.source_files = [
    "ios/**/*.{h,m,mm,cpp,c}",
    "build/generated/ios/NativeBrotliCompress/**/*.{h,m,mm,cpp}"
  ]

  s.public_header_files = [
    "ios/include/**/*.h",
    "build/generated/ios/NativeBrotliCompress/**/*.h"
  ]

  s.header_mappings_dir = "ios/include"

  # ✅ Liên kết đúng với TurboModule của React Native
  s.dependency "React-Core"
  s.dependency "React-Codegen"
  # s.dependency "ReactCommon/turbomodule/core"
  s.dependency "ReactCommon"
  s.dependency "RCTRequired"
  s.dependency "RCTTypeSafety"
  s.dependency "React"

  s.pod_target_xcconfig = {
    "CLANG_CXX_LANGUAGE_STANDARD" => "c++17",
    "CLANG_CXX_LIBRARY" => "libc++",
   "HEADER_SEARCH_PATHS" => "$(SRCROOT)/build/generated/ios/**",
    # "HEADER_SEARCH_PATHS" => "$(PODS_ROOT)/ReactCommon $(PODS_ROOT)/Headers/Public/React-NativeModulesApple",
  }

  s.requires_arc = true

  # ✅ Hỗ trợ TurboModule codegen
  install_modules_dependencies(s) if respond_to?(:install_modules_dependencies)
end
