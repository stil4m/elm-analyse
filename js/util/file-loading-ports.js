const fs = require('fs');
const fileGatherer = require('../util/file-gatherer');

const cp = require('child_process');
const cache = require('./cache');

module.exports = function(app, config, directory) {
    const fileReader = require('../fileReader')(config);
    app.ports.storeAstForSha.subscribe(function(x) {
        const sha1 = x[0];
        const content = x[1];
        cache.storeShaJson(sha1, content);
    })
    app.ports.loadFile.subscribe(function(x) {
        fileReader(directory, x, function(result) {
            app.ports.fileContent.send(result);
        });
    });

    app.ports.loadRawDependency.subscribe(function(x) {
        var dependency = x[0];
        var version = x[1];
        cache.readDependencyJson(dependency, version, function(err, content) {
            if (err) {
                //TODO
                app.ports.onRawDependency.send([dependency, version, "" + x]);
            } else {
                app.ports.onRawDependency.send([dependency, version, content.toString()]);
            }
        });
    });

    app.ports.storeRawDependency.subscribe(function(x) {
        cache.storeDependencyJson(x[0], x[1], x[2]);
    });

    app.ports.loadDependencyFiles.subscribe(function(dep) {
        var depName = dep[0];
        var version = dep[1];
        var result = fileGatherer.getDependencyFiles(directory, depName, version);
        var targets = [];

        //TODO Something with promises
        function reduceTargets() {
            if (targets.length == result.length) {
                app.ports.onDependencyFiles.send([depName, version, targets]);
                return;
            }
            fileReader(directory, result[targets.length], function(y) {
                targets.push(y);
                reduceTargets();
            });
        }
        reduceTargets();
    });

    app.ports.loadFileContentWithShas.subscribe(function(files) {
        console.log("Files", files);
        const promises = files.map(fileName => new Promise(function(accept) {
            fileReader(directory, fileName, accept);
        }))
        Promise.all(promises).then(function(pairs) {
            app.ports.onFileContentWithShas.send(pairs.map(x => [x.sha1, x.path, x.content]));
        }, function(e) {
            console.log("Error when loading files for loadFileContentWithShas:");
            console.log(e);
        });
    });

    app.ports.storeFiles.subscribe(function(files) {
        files.forEach(file => {
            fs.writeFile(file[0], file[1], function(err) {
                console.log("Written file", file[0], "...");
                try {
                    cp.execSync(config.elmFormatPath + ' --yes ' + file[0], {
                        stdio: []
                    });
                    console.log("Formatted file", file[0]);
                } catch (e) {
                    console.log("Could not formatted file", file[0]);
                }

            })
        })

    });

}
