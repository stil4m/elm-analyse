import * as request from 'request';
import * as cache from './cache';

const fetchDependencies = function(cb: (jsonValue: any) => void) {
    request.get('http://package.elm-lang.org/all-packages', function(err: any, _: request.Response, body: any) {
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

const updatePackageDependencyInfo = function(cb: (jsonValue: any) => void, defaultValue: any) {
    fetchDependencies(function(result: any) {
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

const isOutdated = function(timestamp: number): boolean {
    const barrier = new Date().getTime() - 1000 * 60 * 60;
    return timestamp < barrier;
};

const getDependencies = function(cb: (jsonValue: any) => void) {
    cache.readPackageDependencyInfo(function(err: (err: any, result: any) => void, cached: { timestamp: number; data: any }) {
        if (err) {
            console.log('Fetching package information from package.elm-lang.org.');
            updatePackageDependencyInfo(cb, null);
        } else {
            if (isOutdated(cached.timestamp)) {
                console.log('Cached package information invalidated. Fetching new data from package.elm-lang.org');
                updatePackageDependencyInfo(cb, cached.data);
            } else {
                cb(cached.data);
            }
        }
    });
};

export { getDependencies };
