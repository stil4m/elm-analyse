const directory = process.cwd();

module.exports = function(config) {
    const fileLoadingPorts = require("./util/file-loading-ports");
    const loggingPorts = require("./util/logging-ports");
    const Elm = require("./backend-elm");

    var app = Elm.Analyser.worker(false);

    app.ports.sendReportValue.subscribe(function(report) {
        const reporter = require("./reporter");
        reporter(config.format, report);
        process.exit(report.messages.length > 0 ? 1 : 0);
    });

    loggingPorts(app, config, directory);
    fileLoadingPorts(app, config, directory);
};
