const fs = require('fs');
const fileGatherer = require('../util/file-gatherer');

module.exports = function setup(app, directory) {
    const checkedSubscribe = require('./checked-subscribe')(app);

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
};
