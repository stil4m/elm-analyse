const fs = require('fs');
const cp = require('child_process');
const _ = require('lodash');
const find = require('find');

function targetFilesForPathAndPackage(directory, path, pack) {
    const packTargetDirs = pack['source-directories'];

    const targetFiles = _.uniq(_.flatten(packTargetDirs.map(x => {
        return find.fileSync(/\.elm$/, path + '/' + x)
            .filter(x => {
                return x.replace(path, '')
                    .indexOf('elm-stuff') === -1 && (x.length > 0)
            });
    }))).map(s => s.replace(directory, "."));
    return targetFiles;
}

function dependencyFiles(directory, dep, version) {
    const depPath = directory + "/elm-stuff/packages/" + dep + "/" + version;
    const depPackageFile = require(depPath + '/elm-package.json');

    const unfilteredTargetFiles = targetFilesForPathAndPackage(directory, depPath, depPackageFile);

    const exposedModules = depPackageFile['exposed-modules'].map(x => '/' + x.replace('.', '/') + '.elm');
    return unfilteredTargetFiles.filter(function(x) {
        return exposedModules.filter(e => x.endsWith(e))[0];
    });
}

function gather(directory) {
    const packageFile = require(directory + '/elm-package.json');
    const exactDeps = require(directory + '/elm-stuff/exact-dependencies.json');
    const targetDirs = packageFile['source-directories'];
    const dependencies = Object.keys(packageFile['dependencies']);

    //TODO Missing Exact Dep
    var interfaceFiles = dependencies.map(x => [x, exactDeps[x]]);
    const input = {
        interfaceFiles: interfaceFiles,
        sourceFiles: targetFilesForPathAndPackage(directory, directory, packageFile)
    };
    return input;
}

module.exports = {
    gather: gather,
    getDependencyFiles: dependencyFiles
}
