"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// Reference the module
var fs = __importStar(require("fs"));
var cache = __importStar(require("./util/cache"));
var sums = require('sums');
function errorResponse(path) {
    return {
        success: false,
        path: path,
        sha1: null,
        content: null,
        ast: null
    };
}
function readFileNotCached(realPath, path, checksum) {
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
}
function readFile(directory, path, cb) {
    var real = directory + '/' + path;
    sums
        .checksum(fs.createReadStream(real))
        .then(function (checkSumResult) {
        var checksum = checkSumResult.sum;
        if (cache.hasAstForSha(checksum)) {
            return {
                success: true,
                path: path,
                sha1: checksum,
                content: fs.readFileSync(real).toString(),
                ast: cache.readAstForSha(checksum)
            };
        }
        return readFileNotCached(real, path, checksum);
    }, function () {
        return errorResponse(path);
    })
        .then(cb);
}
exports.readFile = readFile;
cache.setupShaFolder();
