const fs = require('fs');
const cp = require('child_process');
const _ = require('lodash');
const fileReader = require('./fileReader');

const directory = ".";

function targetFilesForPathAndPackage(path, pack) {
    const packTargetDirs = pack['source-directories'];
    const targetFiles = _.uniq(_.flatten(packTargetDirs.map(x => {
        return cp.execSync('find ' + (path + '/' + x) + ' -name "*.elm"')
            .toString()
            .split('\n')
            .filter(x => {
                return x.replace(path, '')
                    .indexOf('elm-stuff') === -1 && (x.length > 0)
            });
    }))).map(s => s.replace(directory, "."));
    return targetFiles;
}

function dependencyFiles(dep) {
    const exactDeps = require(directory + '/elm-stuff/exact-dependencies.json');
    const version = exactDeps[dep];
    const depPath = directory + "/elm-stuff/packages/" + dep + "/" + version;
    const depPackageFile = require(depPath + '/elm-package.json');
    const exposedModules = depPackageFile['exposed-modules'].map(x => '/' + x.replace('.', '/') + '.elm');
    const unfilteredTargetFiles = targetFilesForPathAndPackage(depPath, depPackageFile);
    return unfilteredTargetFiles.filter(function(x) {
        return exposedModules.filter(e => x.endsWith(e))[0];
    });
}

(function() {
    const packageFile = require(directory + '/elm-package.json');
    const targetDirs = packageFile['source-directories'];
    const dependencies = Object.keys(packageFile['dependencies']);

    var interfaceFiles = dependencies.map(x => [x, dependencyFiles(x)]);
    const input = {
        interfaceFiles: interfaceFiles,
        sourceFiles: targetFilesForPathAndPackage(directory, packageFile)
    }

    const Elm = require('./elm');
    var app = Elm.Analyser.worker(input);
    app.ports.sendMessages.subscribe(function(x) {
        console.log("Messages:")
        console.log("---------")
        x.forEach(y => console.log(y));
    })
    app.ports.storeAstForSha.subscribe(function(x) {
        const sha1 = x[0];
        const content = x[1];
        fs.writeFileSync('./cache/' + sha1 + ".json", content);
    })
    app.ports.loadFile.subscribe(function(x) {
        fileReader(directory, x, function(result) {
            app.ports.fileContent.send(result);
        });
    });

})();
