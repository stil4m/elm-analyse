const fs = require('fs');
const cp = require('child_process');
const _ = require('lodash');

const directory = process.cwd();

module.exports = function(config) {
    const fileReader = require('./fileReader')(config);
    const fileLoadingPorts = require('./util/file-loading-ports');
    const loggingPorts = require('./util/logging-ports');
    const Elm = require('./backend-elm');

    var app = Elm.Analyser.worker();

    app.ports.sendMessages.subscribe(function(x) {
        console.log("Messages:")
        console.log("---------")
        x.forEach(y => console.log(y));
    });

    loggingPorts(app, config, directory);
    fileLoadingPorts(app, config, directory);
};
