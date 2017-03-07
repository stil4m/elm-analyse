const fs = require('fs');
const cp = require('child_process');
const _ = require('lodash');
const find = require('find');
const _path = require('path');

function targetFilesForPathAndPackage(directory, path, pack) {
    const packTargetDirs = pack['source-directories'];
    const targetFiles = _.uniq(_.flatten(packTargetDirs.map(x => {
        const exists = fs.existsSync(path + '/' + x);
        if (!exists) {
            return []
        }

        return find.fileSync(/\.elm$/, path + '/' + x)
            .filter(x => {
                const relativePath = x.replace(path, '')
                return relativePath.indexOf('elm-stuff') === -1
                      && relativePath.indexOf('node_modules') === -1
                      && (x.length > 0)
            });
    }))).map(function(s) {
        const sParts = s.split(_path.sep);
        const dirParts = directory.split(_path.sep);

        while (sParts.length > 0 && dirParts.length > 0) {
            if (sParts[0] == dirParts[0]) {
                sParts.shift();
                dirParts.shift();
            } else {
                break;
            }
        }

        const result = dirParts.map(_ => "../").join() + sParts.join('/');
        return result;
    });
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

    var interfaceFiles = dependencies
        .filter(x => exactDeps[x])
        .map(x => [x, exactDeps[x]]);

    dependencies.filter(x => !exactDeps[x]).forEach(x => {
        console.log('WARN: Missing dependency `' + x + '`. Maybe run elm-package to update the dependencies.');
    });

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
