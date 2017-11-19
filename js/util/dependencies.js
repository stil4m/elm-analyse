const request = require('request');
const cache = require('./cache');
const fetchDependencies = function(cb) {
    request.get('http://package.elm-lang.org/all-packages', function(
        err,
        response,
        body
    ) {
        if (err) {
            cb(null);
            return;
        }
        var cbValue;
        try {
            cbValue = JSON.parse(body);
        } catch (e) {
            cbValue = null;
        }
        cb(cbValue);
    });
};

const updatePackageDependencyInfo = function(cb, defaultValue) {
    fetchDependencies(function(result) {
        console.log('Fetched dependencies');
        if (result == null) {
            cb(defaultValue);
            return;
        }
        cache.storePackageDependencyInfo({
            timestamp: new Date().getTime(),
            data: result
        });
        cb(result);
    });
};

const isOutdated = function(timestamp) {
    const barrier = new Date().getTime() - 1000 * 60 * 60;
    return timestamp < barrier;
};

const getDependencies = function(cb) {
    cache.readPackageDependencyInfo(function(err, cached) {
        if (err) {
            console.log(
                'Fetching package information from package.elm-lang.org.'
            );
            updatePackageDependencyInfo(cb, null);
        } else {
            if (isOutdated(cached.timestamp)) {
                console.log(
                    'Cached package information invalidated. Fetching new data from package.elm-lang.org'
                );
                updatePackageDependencyInfo(cb, cached.data);
            } else {
                cb(cached.data);
            }
        }
    });
};
module.exports = {
    getDependencies: getDependencies
};
