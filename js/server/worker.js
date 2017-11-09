const fileLoadingPorts = require('../util/file-loading-ports');
const loggingPorts = require('../util/logging-ports');

module.exports = function worker(config) {
    const directory = process.cwd();
    var Elm = require('../backend-elm.js');
    var app = Elm.Analyser.worker(true);

    app.ports.sendReportValue.subscribe(function(report) {
        console.log('Found ' + report.messages.length + ' message(s)');
    });

    loggingPorts(app, config, directory);
    fileLoadingPorts(app, config, process.cwd());
    return app;
};
