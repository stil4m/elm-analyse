const fs = require('fs');
const cp = require('child_process');
const _ = require('lodash');
const fileGatherer = require('./util/file-gatherer');

const directory = process.cwd();

module.exports = function(config) {
    const fileReader = require('./fileReader')(config);
    const fileLoadingPorts = require('./util/file-loading-ports');

    const input = fileGatherer.gather(directory);

    const Elm = require('./backend-elm');
    var app = Elm.Analyser.worker(input);

    app.ports.sendMessages.subscribe(function(x) {
        console.log("Messages:")
        console.log("---------")
        x.forEach(y => console.log(y));
    });

    fileLoadingPorts(app, config, directory);
};
