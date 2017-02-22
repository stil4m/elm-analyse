const fileReader = require('../fileReader');
const fileLoadingPorts = require('../util/file-loading-ports')
const loggingPorts = require('../util/logging-ports');
const fs = require('fs');

module.exports = function worker(config) {
    const directory = process.cwd();
    var Elm = require('../backend-elm.js');
    var app = Elm.Analyser.worker();

    app.ports.sendMessages.subscribe(function(x) {
        console.log("Found " + x.length + " message(s)");
    });

    loggingPorts(app, config, directory);
    fileLoadingPorts(app, config, process.cwd());
    return app;
}
