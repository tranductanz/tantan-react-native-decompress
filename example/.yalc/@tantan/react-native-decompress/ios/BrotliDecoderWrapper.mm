#include "BrotliDecoderWrapper.h"
#include "decode.h"
#include <fstream>
#include <vector>
//
BOOL Brotli_Decompress_File(const char *input_path, const char *output_path) {
  std::ifstream input(input_path, std::ios::binary | std::ios::ate);
  if (!input) return NO;

  std::streamsize input_size = input.tellg();
  input.seekg(0, std::ios::beg);
  std::vector<uint8_t> input_data(input_size);
  input.read((char*)input_data.data(), input_size);

  size_t output_size = input_size * 20;
  std::vector<uint8_t> output_data(output_size);

  BrotliDecoderResult result = BrotliDecoderDecompress(
      input_size,
      input_data.data(),
      &output_size,
      output_data.data()
  );

  if (result != BROTLI_DECODER_RESULT_SUCCESS) return NO;

  std::ofstream output(output_path, std::ios::binary);
  output.write((char*)output_data.data(), output_size);
  return YES;
}
//
//#include "BrotliDecoderWrapper.h"
//#include "decode.h"
//#include <fstream>
//#include <sys/stat.h>
//#include <sys/types.h>
//#include <libgen.h>  // cho dirname
//#include <unistd.h>
//#include <string.h>
//
//// Helper để tạo folder output nếu chưa tồn tại
//static BOOL ensure_output_folder(const char *output_path) {
//    char path_copy[1024];
//    strncpy(path_copy, output_path, sizeof(path_copy));
//    char *dir = dirname(path_copy);
//
//    struct stat st;
//    if (stat(dir, &st) == -1) {
//        printf("📂 Thư mục output chưa tồn tại. Đang tạo...\n");
//        if (mkdir(dir, 0755) != 0) {
//            perror("❌ Lỗi tạo thư mục output");
//            return NO;
//        } else {
//            printf("✅ Đã tạo thư mục output: %s\n", dir);
//        }
//    } else {
//        printf("📂 Thư mục output đã tồn tại.\n");
//    }
//    return YES;
//}
//BOOL Brotli_Decompress_File(const char *input_path, const char *output_path) {
//    printf("👉 Bắt đầu giải nén stream cho file: %s\n", input_path);
//
//    std::ifstream input(input_path, std::ios::binary);
//    if (!input) {
//        printf("❌ Không mở được file input\n");
//        return NO;
//    }
//
//    input.seekg(0, std::ios::end);
//    auto total_size = input.tellg();
//    input.seekg(0, std::ios::beg);
//
//    printf("📄 Kích thước file input: %ld bytes\n", (long)total_size);
//
//    // Đảm bảo folder output tồn tại
//    if (!ensure_output_folder(output_path)) {
//        return NO;
//    }
//
//    std::ofstream output(output_path, std::ios::binary);
//    if (!output) {
//        printf("❌ Không mở được file output: %s\n", output_path);
//        return NO;
//    }
//
//    BrotliDecoderState* state = BrotliDecoderCreateInstance(nullptr, nullptr, nullptr);
//    if (!state) {
//        printf("❌ Không tạo được decoder state\n");
//        return NO;
//    }
//
//    const size_t kInputBufferSize = 65536;  // 64KB
//    const size_t kOutputBufferSize = 65536;
//
//    uint8_t input_buffer[kInputBufferSize];
//    uint8_t output_buffer[kOutputBufferSize];
//
//    const uint8_t* next_in = nullptr;
//    size_t available_in = 0;
//
//    BOOL success = YES;
//
//    // Đọc lần đầu
//    input.read(reinterpret_cast<char*>(input_buffer), kInputBufferSize);
//    available_in = input.gcount();
//    next_in = input_buffer;
//
//    while (true) {
//        uint8_t* next_out = output_buffer;
//        size_t available_out = kOutputBufferSize;
//
//        BrotliDecoderResult result = BrotliDecoderDecompressStream(
//            state, &available_in, &next_in, &available_out, &next_out, nullptr);
//
//        size_t output_size = next_out - output_buffer;
//
//        if (output_size > 0) {
//            output.write(reinterpret_cast<char*>(output_buffer), output_size);
//            printf("📝 Ghi ra %ld bytes\n", (long)output_size);
//        }
//
//        if (result == BROTLI_DECODER_RESULT_SUCCESS) {
//            printf("✅ Streaming decompress thành công\n");
//            break;
//        } else if (result == BROTLI_DECODER_RESULT_NEEDS_MORE_INPUT) {
//            // Nếu cần thêm input → đọc thêm vào buffer
//            if (input.eof()) {
//                printf("❌ Không còn input nhưng decoder vẫn cần thêm data. File input có thể bị hỏng!\n");
//                success = NO;
//                break;
//            }
//            input.read(reinterpret_cast<char*>(input_buffer), kInputBufferSize);
//            available_in = input.gcount();
//            next_in = input_buffer;
//            printf("➡ Đã đọc thêm %ld bytes vào buffer\n", (long)available_in);
//
//            // Nếu đọc được 0 byte → file input đã hết hẳn
//            if (available_in == 0) {
//                printf("⚠ Đã đọc hết input file, nhưng decoder chưa thành công.\n");
//                // Không break ở đây — để vòng lặp tiếp tục cho đến khi Brotli báo SUCCESS hoặc ERROR.
//            }
//
//        } else if (result == BROTLI_DECODER_RESULT_NEEDS_MORE_OUTPUT) {
//            // Output buffer nhỏ quá, vòng lặp sẽ tự cấp phát lại
//            continue;
//
//        } else {
//            printf("❌ Streaming decompress thất bại\n");
//            success = NO;
//            break;
//        }
//    }
//
//    BrotliDecoderDestroyInstance(state);
//    output.close();
//    input.close();
//
//    return success;
//}
