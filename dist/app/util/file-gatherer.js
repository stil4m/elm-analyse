"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
var lodash_1 = __importDefault(require("lodash"));
var find = __importStar(require("find"));
var _path = __importStar(require("path"));
function isRealElmPaths(sourceDir, filePath) {
    var modulePath = filePath.replace(_path.normalize(sourceDir + '/'), '');
    var moduleParts = modulePath.split('/');
    return lodash_1.default.every(moduleParts, function (m) { return m.match('^[A-Z].*'); });
}
function includedInFileSet(path) {
    if (!path.match(/\.elm$/)) {
        return false;
    }
    return path.indexOf('elm-stuff') === -1 && path.indexOf('node_modules') === -1;
}
exports.includedInFileSet = includedInFileSet;
function targetFilesForPathAndPackage(directory, path, pack) {
    var packTargetDirs = pack['source-directories'] || ['src'];
    var targetFiles = lodash_1.default.uniq(lodash_1.default.flatten(packTargetDirs.map(function (x) {
        var sourceDir = _path.normalize(path + '/' + x);
        var exists = fs.existsSync(sourceDir);
        if (!exists) {
            return [];
        }
        var dirFiles = find.fileSync(/\.elm$/, sourceDir).filter(function (x) {
            var resolvedX = _path.resolve(x);
            var resolvedPath = _path.resolve(path);
            var relativePath = resolvedX.replace(resolvedPath, '');
            return includedInFileSet(relativePath) && x.length > 0;
        });
        return dirFiles.filter(function (x) { return isRealElmPaths(sourceDir, x); });
    }))).map(function (s) {
        var sParts = s.split(_path.sep);
        var dirParts = directory.split(_path.sep);
        while (sParts.length > 0 && dirParts.length > 0) {
            if (sParts[0] == dirParts[0]) {
                sParts.shift();
                dirParts.shift();
            }
            else {
                break;
            }
        }
        var result = dirParts.map(function () { return '../'; }).join('') + sParts.join('/');
        return _path.normalize(result);
    });
    return targetFiles;
}
function getDependencyFiles(directory, dep) {
    var depPath = directory + "/elm-stuff/packages/" + dep.name + "/" + dep.version;
    var depPackageFile = require(depPath + '/elm.json');
    var unfilteredTargetFiles = targetFilesForPathAndPackage(directory, depPath, depPackageFile);
    var exposedModules = depPackageFile['exposed-modules'].map(function (x) {
        return _path.normalize('/' + x.replace(new RegExp('\\.', 'g'), '/') + '.elm');
    });
    return unfilteredTargetFiles.filter(function (x) {
        return exposedModules.filter(function (e) { return lodash_1.default.endsWith(x, e); })[0];
    });
}
exports.getDependencyFiles = getDependencyFiles;
function gather(directory) {
    var packageFile = require(directory + '/elm.json');
    var input = {
        interfaceFiles: [],
        sourceFiles: targetFilesForPathAndPackage(directory, directory, packageFile)
    };
    return input;
}
exports.gather = gather;
