const fs = require('fs');
const fileGatherer = require('../util/file-gatherer');

const cp = require('child_process');
const cache = require('./cache');

module.exports = function(app, config, directory) {
    const fileReader = require('../fileReader')(config);

    function checkedSubscribe(key, f) {
        if (app.ports[key]) {
            app.ports[key].subscribe(f);
        } else {
            console.log('WARN: Port ', key, ' is not defined');
        }
    }

    checkedSubscribe('loadContext', function() {
        const input = fileGatherer.gather(directory);
        var configuration;
        try {
            configuration = fs.readFileSync('./elm-analyse.json').toString();
        } catch (e) {
            configuration = '';
        }
        const data = {
            sourceFiles: input.sourceFiles,
            interfaceFiles: input.interfaceFiles,
            configuration: configuration
        };

        setTimeout(function() {
            app.ports.onLoadedContext.send(data);
        }, 5);
    });

    checkedSubscribe('storeAstForSha', function(x) {
        const sha1 = x[0];
        const content = x[1];
        cache.storeShaJson(sha1, content);
    });

    checkedSubscribe('loadFile', function(x) {
        fileReader(directory, x, function(result) {
            app.ports.fileContent.send(result);
        });
    });

    checkedSubscribe('loadRawDependency', function(x) {
        var dependency = x[0];
        var version = x[1];
        cache.readDependencyJson(dependency, version, function(err, content) {
            if (err) {
                //TODO
                app.ports.onRawDependency.send([dependency, version, '' + x]);
            } else {
                app.ports.onRawDependency.send([
                    dependency,
                    version,
                    content.toString()
                ]);
            }
        });
    });

    checkedSubscribe('storeRawDependency', function(x) {
        cache.storeDependencyJson(x[0], x[1], x[2]);
    });

    checkedSubscribe('loadDependencyFiles', function(dep) {
        var depName = dep[0];
        var version = dep[1];
        var result = fileGatherer.getDependencyFiles(
            directory,
            depName,
            version
        );

        const promises = result.map(
            fileName =>
                new Promise(function(accept) {
                    fileReader(directory, fileName, accept);
                })
        );
        Promise.all(promises).then(
            function(targets) {
                app.ports.onDependencyFiles.send([depName, version, targets]);
            },
            function(e) {
                console.log(
                    'Error when loading files for loadDependencyFiles:',
                    dep
                );
                console.log(e);
            }
        );
    });

    checkedSubscribe('loadFileContentWithSha', function(fileName) {
        new Promise(function(accept) {
            fileReader(directory, fileName, accept);
        }).then(
            function(pair) {
                app.ports.onFileContentWithShas.send({
                    file: {
                        version: pair.sha1,
                        path: pair.path
                    },
                    content: pair.content
                });
            },
            function(e) {
                console.log(
                    'Error when loading files for loadFileContentWithShas:'
                );
                console.log(e);
            }
        );
    });

    checkedSubscribe('storeFiles', function(file) {
        new Promise(function(accept) {
            fs.writeFile(file[0], file[1], function() {
                console.log('Written file', file[0], '...');
                try {
                    cp.execSync(config.elmFormatPath + ' --yes ' + file[0], {
                        stdio: []
                    });
                    console.log('Formatted file', file[0]);
                    accept();
                } catch (e) {
                    console.log('Could not formated file', file[0]);
                    accept();
                }
            });
        }).then(function() {
            app.ports.onStoredFiles.send(true);
        });
    });
};
