"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NativeBrotliCompress = void 0;
exports.helloFunction = helloFunction;
exports.decompress = decompress;
const NativeBrotliCompress_1 = __importDefault(require("./NativeBrotliCompress"));
function helloFunction(key) {
    return NativeBrotliCompress_1.default.helloFunction(key);
}
function decompress(inputPath, outputPath) {
    return NativeBrotliCompress_1.default.decompress(inputPath, outputPath);
}
var NativeBrotliCompress_2 = require("./NativeBrotliCompress");
Object.defineProperty(exports, "NativeBrotliCompress", { enumerable: true, get: function () { return __importDefault(NativeBrotliCompress_2).default; } });
