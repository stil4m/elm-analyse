const cp = require('child_process');
function pathIsFormatted(config, path) {
    try {
        cp.execSync(config.elmFormatPath + ' --validate ' + path, {
            stdio: []
        });

        return true;
    } catch (e) {
        return false;
    }
}

const cache = {};
const path = require('path');
const cachePath = path.resolve('elm-stuff', '.elm-analyse');
const fs = require('fs');

const prefillCacheWithKnownFiles = function() {
    try {
        const files = fs.readdirSync(cachePath + '/_shas');
        files.filter(s => s.endsWith('.elma')).forEach(f => {
            cache[path.resolve(cachePath, '_shas', f)] = true;
        });
        return true;
    } catch (e) {
        //TODO Probably no cache directory. Continue for now.
        return false;
    }
};

const setupCache = function(config) {
    const cacheSuccess = prefillCacheWithKnownFiles();
    if (cacheSuccess) {
        try {
            cp.execSync(
                config.elmFormatPath +
                    ' ' +
                    cachePath +
                    '/_shas/*.elma --validate ',
                {
                    stdio: []
                }
            );
            //All files are formatted correctly.
        } catch (e) {
            // Parse Std [1]
            const invalidFiles = JSON.parse(e.output[1].toString());
            invalidFiles.forEach(f => {
                cache[f.path] = false;
            });
        }
    }
};
module.exports = function(config) {
    setupCache(config);

    return function isFormatted(path) {
        if (cache[path] === undefined) {
            const result = pathIsFormatted(config, path);
            cache[path] = result;
            return result;
        } else {
            return cache[path];
        }
    };
};
