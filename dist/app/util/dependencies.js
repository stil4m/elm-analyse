"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var request = __importStar(require("request"));
var cache = __importStar(require("./cache"));
var fetchDependencies = function (cb) {
    request.get('http://package.elm-lang.org/search.json', function (err, _, body) {
        if (err) {
            cb(null);
            return;
        }
        var cbValue;
        try {
            cbValue = JSON.parse(body);
        }
        catch (e) {
            cbValue = null;
        }
        cb(cbValue);
    });
};
var updatePackageDependencyInfo = function (cb, defaultValue) {
    fetchDependencies(function (result) {
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
var isOutdated = function (timestamp) {
    var barrier = new Date().getTime() - 1000 * 60 * 60;
    return timestamp < barrier;
};
var getDependencies = function (cb) {
    cache.readPackageDependencyInfo(function (err, cached) {
        if (err) {
            console.log('Fetching package information from package.elm-lang.org.');
            updatePackageDependencyInfo(cb, null);
        }
        else {
            if (isOutdated(cached.timestamp)) {
                console.log('Cached package information invalidated. Fetching new data from package.elm-lang.org');
                updatePackageDependencyInfo(cb, cached.data);
            }
            else {
                cb(cached.data);
            }
        }
    });
};
exports.getDependencies = getDependencies;
