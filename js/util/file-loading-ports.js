const fs = require('fs');
const fileGatherer = require('../util/file-gatherer');
const fileReader = require('../fileReader');
const cp = require('child_process');
const cache = require('./cache');

module.exports = function(app, directory) {
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

    })
}
