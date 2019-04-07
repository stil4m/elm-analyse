// Reference the module
import * as fs from 'fs';
import * as cache from './util/cache';
const sums = require('sums');
import { FileContent } from './domain';

function errorResponse(path: string): FileContent {
    return {
        success: false,
        path: path,
        sha1: null,
        content: null,
        ast: null
    };
}

function readFileNotCached(realPath: string, path: string, checksum: string) {
    return new Promise((accept: (data: FileContent) => void) => {
        fs.readFile(realPath, function(e, content) {
            if (e) {
                accept(errorResponse(path));
                return;
            }
            const originalContent = content.toString();

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

function readFile(directory: string, path: string, cb: (data: FileContent) => void) {
    var real = directory + '/' + path;

    sums
        .checksum(fs.createReadStream(real))
        .then(
            (checkSumResult: { sum: string }) => {
                const checksum = checkSumResult.sum;

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
            },
            function() {
                return errorResponse(path);
            }
        )
        .then(cb);
}

cache.setupShaFolder();

export { readFile };
