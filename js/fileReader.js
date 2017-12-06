// Reference the module
const normalizeNewline = require('normalize-newline');
const fs = require('fs');
const cache = require('./util/cache');
const sums = require('sums');

module.exports = function(config) {
    const formatService = require('./util/format-service')(config);

    function errorResponse(path) {
        return {
            success: false,
            path: path,
            sha1: null,
            content: null,
            formatted: false,
            ast: null
        };
    }

    function readFileNotCached(realPath, path, checksum) {
        return new Promise(function(accept) {
            fs.readFile(realPath, function(e, content) {
                if (e) {
                    accept(errorResponse(path));
                    return;
                }
                const originalContent = content.toString();
                const normalized = normalizeNewline(originalContent);
                const fullPath = cache.elmCachePathForSha(checksum);
                fs.writeFileSync(fullPath, normalized);
                const formatted = formatService(fullPath);

                accept({
                    success: true,
                    path: path,
                    sha1: checksum,
                    content: normalized,
                    formatted: formatted,
                    ast: null
                });
            });
        });
    }

    function readFile(directory, path, cb) {
        var real = directory + '/' + path;

        sums
            .checksum(fs.createReadStream(real))
            .then(
                function(checkSumResult) {
                    const checksum = checkSumResult.sum;

                    if (cache.hasAstForSha(checksum)) {
                        const fullPath = cache.elmCachePathForSha(checksum);
                        return {
                            success: true,
                            path: path,
                            sha1: checksum,
                            content: fs.readFileSync(fullPath).toString(),
                            formatted: formatService(fullPath),
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
    return readFile;
};
