const fs = require('fs');
const cache = require('../util/cache');
const cp = require('child_process');

module.exports = function setup(app, config, directory) {
    const fileReader = require('../fileReader')(config);
    const checkedSubscribe = require('./checked-subscribe')(app);

    checkedSubscribe('loadFile', fileName => {
        fileReader(directory, fileName, result =>
            app.ports.fileContent.send(result)
        );
    });

    checkedSubscribe('storeAstForSha', data => {
        const sha1 = data[0];
        const content = data[1];
        cache.storeShaJson(sha1, content);
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
};
