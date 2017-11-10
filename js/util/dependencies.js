const request = require('request');
const cache = require('./cache');
const fetchDependencies = function(cb) {
    console.log('fetchDependencies"');
    request.get('http://package.elm-lang.org/all-packages', function(
        err,
        response,
        body
    ) {
        if (err) {
            cb(null);
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
    console.log('TODO: Is outdated:', timestamp);
    return false;
    // const barrier = new Date().getTime() - 1000 * 60 * 60;
    // return timestamp < barrier;
};

const getDependencies = function(cb) {
    cache.readPackageDependencyInfo(function(err, cached) {
        if (err) {
            console.log('No cache!');
            updatePackageDependencyInfo(cb, null);
        } else {
            if (isOutdated(cached.timestamp)) {
                console.log('Cache invalidated!');
                updatePackageDependencyInfo(cb, cached.data);
            } else {
                console.log('Provide cached!');
                cb(cached.data);
            }
        }
    });
};
module.exports = {
    getDependencies: getDependencies
};
