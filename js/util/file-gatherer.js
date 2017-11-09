const fs = require('fs');
const _ = require('lodash');
const find = require('find');
const _path = require('path');

function isRealElmPaths(sourceDir, filePath) {
    const modulePath = filePath.replace(_path.normalize(sourceDir + '/'), '');
    const moduleParts = modulePath.split('/');
    return _.every(moduleParts, m => m.match('^[A-Z].*'));
}

function includedInFileSet(path) {
    if (!path.match(/\.elm$/)) {
        return false;
    }

    return (
        path.indexOf('elm-stuff') === -1 && path.indexOf('node_modules') === -1
    );
}
function targetFilesForPathAndPackage(directory, path, pack) {
    const packTargetDirs = pack['source-directories'];
    const targetFiles = _.uniq(
        _.flatten(
            packTargetDirs.map(x => {
                const sourceDir = _path.normalize(path + '/' + x);
                const exists = fs.existsSync(sourceDir);
                if (!exists) {
                    return [];
                }

                const dirFiles = find
                    .fileSync(/\.elm$/, sourceDir)
                    .filter(x => {
                        const resolvedX = _path.resolve(x);
                        const resolvedPath = _path.resolve(path);
                        const relativePath = resolvedX.replace(
                            resolvedPath,
                            ''
                        );
                        return includedInFileSet(relativePath) && x.length > 0;
                    });
                return dirFiles.filter(x => isRealElmPaths(sourceDir, x));
            })
        )
    ).map(function(s) {
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

        const result = dirParts.map(() => '../').join() + sParts.join('/');
        return _path.normalize(result);
    });
    return targetFiles;
}

function dependencyFiles(directory, dep, version) {
    const depPath = directory + '/elm-stuff/packages/' + dep + '/' + version;
    const depPackageFile = require(depPath + '/elm-package.json');
    const unfilteredTargetFiles = targetFilesForPathAndPackage(
        directory,
        depPath,
        depPackageFile
    );

    const exposedModules = depPackageFile['exposed-modules'].map(x =>
        _path.normalize('/' + x.replace(new RegExp('\\.', 'g'), '/') + '.elm')
    );
    return unfilteredTargetFiles.filter(function(x) {
        return exposedModules.filter(e => x.endsWith(e))[0];
    });
}

function gather(directory) {
    const packageFile = require(directory + '/elm-package.json');
    const exactDeps = require(directory + '/elm-stuff/exact-dependencies.json');
    const dependencies = Object.keys(packageFile['dependencies']);

    var interfaceFiles = dependencies
        .filter(x => exactDeps[x])
        .map(x => [x, exactDeps[x]]);

    dependencies.filter(x => !exactDeps[x]).forEach(x => {
        console.log(
            'WARN: Missing dependency `' +
                x +
                '`. Maybe run elm-package to update the dependencies.'
        );
    });

    const input = {
        interfaceFiles: interfaceFiles,
        sourceFiles: targetFilesForPathAndPackage(
            directory,
            directory,
            packageFile
        )
    };
    return input;
}

module.exports = {
    gather: gather,
    getDependencyFiles: dependencyFiles,
    includedInFileSet: includedInFileSet
};
