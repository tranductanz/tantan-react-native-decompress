package com.tantan.reactnativedecompress

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.turbomodule.core.interfaces.TurboModule
import android.util.Base64
import com.facebook.react.bridge.Promise
import java.io.FileInputStream
import java.io.FileOutputStream


// ✅ Import đúng từ thư mục bạn đã đặt trong org/brotli/dec
import org.brotli.dec.BrotliInputStream

@ReactModule(name = NativeBrotliCompressModule.NAME)
class NativeBrotliCompressModule(reactContext: ReactApplicationContext) :
    NativeBrotliCompressSpec(reactContext), TurboModule {

    companion object {
        const val NAME = "NativeBrotliCompress"
    }

    override fun getName(): String = NAME

    override fun helloFunction(key: String): String {
        return "Hello from Brotli: $key"
    }

    override fun decompress(inputPath: String, outputPath: String, promise: Promise) {
        try {
            // 👇 Ví dụ: đọc file inputPath → decompress bằng BrotliInputStream → ghi outputPath
            val inputStream = BrotliInputStream(FileInputStream(inputPath))
            val outputStream = FileOutputStream(outputPath)

            val buffer = ByteArray(4096)
            var length: Int
            while (inputStream.read(buffer).also { length = it } != -1) {
                outputStream.write(buffer, 0, length)
            }

            inputStream.close()
            outputStream.close()

            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("BROTLIDE_ERROR", e.message, e)
        }
    }

}
