"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
// const fs = require('fs');
var fsExtra = __importStar(require("fs-extra"));
// const fsExtra = require('fs-extra');
var osHomedir = require('os-homedir');
var path = __importStar(require("path"));
var packageJsonPath = path.resolve(__dirname, '..', '..', '..', 'package.json');
var elmAnalyseVersion = require(packageJsonPath).version;
var LocalCache = /** @class */ (function () {
    function LocalCache(projectPath) {
        this.cachePath = path.join(projectPath, 'elm-stuff', '.elm-analyse');
    }
    LocalCache.prototype.storeShaJson = function (sha1, content) {
        fs.writeFile(path.resolve(this.cachePath, '_shas', sha1 + '.json'), JSON.stringify(content), function () { });
    };
    LocalCache.prototype.elmCachePathForSha = function (sha) {
        return path.resolve(this.cachePath, '_shas', sha + '.elma');
    };
    LocalCache.prototype.astCachePathForSha = function (sha) {
        return path.resolve(this.cachePath, '_shas', sha + '.json');
    };
    LocalCache.prototype.setupShaFolder = function () {
        fsExtra.ensureDirSync(path.resolve(this.cachePath, '_shas'));
    };
    LocalCache.prototype.hasAstForSha = function (sha) {
        return fs.existsSync(this.astCachePathForSha(sha));
    };
    LocalCache.prototype.readAstForSha = function (sha) {
        return fs.readFileSync(this.astCachePathForSha(sha)).toString();
    };
    return LocalCache;
}());
exports.LocalCache = LocalCache;
var major;
if (elmAnalyseVersion.split('.')[0] === '0') {
    major = '0.' + elmAnalyseVersion.split('.')[1];
}
else {
    major = elmAnalyseVersion.split('.')[0];
}
var globalCachePath = path.resolve(osHomedir(), '.elm-analyse', major);
function readPackageDependencyInfo(cb) {
    fs.readFile(path.resolve(globalCachePath, 'all-packages.json'), function (err, data) {
        if (err) {
            cb(err, undefined);
        }
        else {
            var s = data.toString();
            var parsed;
            try {
                parsed = JSON.parse(s);
            }
            catch (e) {
                cb(e, undefined);
                return;
            }
            cb(null, parsed);
        }
    });
}
exports.readPackageDependencyInfo = readPackageDependencyInfo;
function storePackageDependencyInfo(data) {
    fs.writeFile(path.resolve(globalCachePath, 'all-packages.json'), JSON.stringify(data), function () { });
}
exports.storePackageDependencyInfo = storePackageDependencyInfo;
function readDependencyJson(dependency, version, cb) {
    //TODO Error handling
    fs.readFile(path.resolve(globalCachePath, 'interfaces', dependency, version, 'dependency.json'), cb);
}
exports.readDependencyJson = readDependencyJson;
function storeDependencyJson(dependency, version, content) {
    var targetDir = path.resolve(globalCachePath, 'interfaces', dependency, version);
    var targetPath = path.resolve(targetDir, 'dependency.json');
    fsExtra.ensureDirSync(targetDir);
    //TODO Hanlding
    fs.writeFile(targetPath, content, function () { });
}
exports.storeDependencyJson = storeDependencyJson;
