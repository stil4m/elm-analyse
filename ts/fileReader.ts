// Reference the module
import * as fs from 'fs';
import { LocalCache } from './util/cache';
const sums = require('sums');
import { FileContent } from './domain';

export class FileReader {
    private cache: LocalCache;

    constructor(cache: LocalCache) {
        this.cache = cache;
        cache.setupShaFolder();
    }

    private readFileNotCached(realPath: string, path: string, checksum: string) {
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

    public readFile(directory: string, path: string, cb: (data: FileContent) => void) {
        var real = directory + '/' + path;

        sums
            .checksum(fs.createReadStream(real))
            .then(
                (checkSumResult: { sum: string }) => {
                    const checksum = checkSumResult.sum;

                    if (this.cache.hasAstForSha(checksum)) {
                        return {
                            success: true,
                            path: path,
                            sha1: checksum,
                            content: fs.readFileSync(real).toString(),
                            ast: this.cache.readAstForSha(checksum)
                        };
                    }
                    return this.readFileNotCached(real, path, checksum);
                },
                function() {
                    return errorResponse(path);
                }
            )
            .then(cb);
    }
}

function errorResponse(path: string): FileContent {
    return {
        success: false,
        path: path,
        sha1: null,
        content: null,
        ast: null
    };
}
