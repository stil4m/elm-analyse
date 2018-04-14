// Reference the module
const fs = require('fs');
const cache = require('./util/cache');
const sums = require('sums');

module.exports = function() {


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
        return new Promise(function(accept) {
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

    function readFile(directory, path, cb) {
        var real = directory + '/' + path;

        sums
            .checksum(fs.createReadStream(real))
            .then(
                function(checkSumResult) {
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
    return readFile;
};
