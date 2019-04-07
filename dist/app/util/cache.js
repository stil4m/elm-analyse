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
var cachePath = path.resolve('elm-stuff', '.elm-analyse');
var packageJsonPath = path.resolve(__dirname, '..', '..', '..', 'package.json');
var elmAnalyseVersion = require(packageJsonPath).version;
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
function storeShaJson(sha1, content) {
    fs.writeFile(path.resolve(cachePath, '_shas', sha1 + '.json'), JSON.stringify(content), function () { });
}
exports.storeShaJson = storeShaJson;
function storeDependencyJson(dependency, version, content) {
    var targetDir = path.resolve(globalCachePath, 'interfaces', dependency, version);
    var targetPath = path.resolve(targetDir, 'dependency.json');
    fsExtra.ensureDirSync(targetDir);
    //TODO Hanlding
    fs.writeFile(targetPath, content, function () { });
}
exports.storeDependencyJson = storeDependencyJson;
function elmCachePathForSha(sha) {
    return path.resolve(cachePath, '_shas', sha + '.elma');
}
exports.elmCachePathForSha = elmCachePathForSha;
function astCachePathForSha(sha) {
    return path.resolve(cachePath, '_shas', sha + '.json');
}
function hasAstForSha(sha) {
    return fs.existsSync(astCachePathForSha(sha));
}
exports.hasAstForSha = hasAstForSha;
function readAstForSha(sha) {
    return fs.readFileSync(astCachePathForSha(sha)).toString();
}
exports.readAstForSha = readAstForSha;
function setupShaFolder() {
    fsExtra.ensureDirSync(path.resolve(cachePath, '_shas'));
}
exports.setupShaFolder = setupShaFolder;
