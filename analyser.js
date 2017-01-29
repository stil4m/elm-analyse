const fs = require('fs');
const cp = require('child_process');
const _ = require('lodash');
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
    return targetFilesForPathAndPackage(depPath, depPackageFile);
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
    app.ports.loadFile.subscribe(function(x) {
      console.log("Load file", x, "...")
      const real = x.replace(".", directory);
      fs.readFile(real, function(e, content) {
          app.ports.fileContent.send([x,content.toString()]);
      })
    });

})();
