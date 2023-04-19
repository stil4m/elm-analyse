"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileReader = void 0;
// Reference the module
var fs = __importStar(require("fs"));
var sums = require('sums');
var FileReader = /** @class */ (function () {
    function FileReader(cache) {
        this.cache = cache;
        cache.setupShaFolder();
    }
    FileReader.prototype.readFileNotCached = function (realPath, path, checksum) {
        return new Promise(function (accept) {
            fs.readFile(realPath, function (e, content) {
                if (e) {
                    accept(errorResponse(path));
                    return;
                }
                var originalContent = content.toString();
                accept({
                    success: true,
                    path: path,
                    sha1: checksum,
                    content: originalContent,
                    ast: null
                });
            });
        });
    };
    FileReader.prototype.readFile = function (directory, path, cb) {
        var _this = this;
        var real = directory + '/' + path;
        sums
            .checksum(fs.createReadStream(real))
            .then(function (checkSumResult) {
            var checksum = checkSumResult.sum;
            if (_this.cache.hasAstForSha(checksum)) {
                return {
                    success: true,
                    path: path,
                    sha1: checksum,
                    content: fs.readFileSync(real).toString(),
                    ast: _this.cache.readAstForSha(checksum)
                };
            }
            return _this.readFileNotCached(real, path, checksum);
        }, function () {
            return errorResponse(path);
        })
            .then(cb);
    };
    return FileReader;
}());
exports.FileReader = FileReader;
function errorResponse(path) {
    return {
        success: false,
        path: path,
        sha1: null,
        content: null,
        ast: null
    };
}
