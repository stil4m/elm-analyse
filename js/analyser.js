const directory = process.cwd();

const fileLoadingPorts = require('./file-loading-ports');
const loggingPorts = require('./util/logging-ports');
const Elm = require('./backend-elm');
const dependencies = require('./util/dependencies');

module.exports = function(config) {
    dependencies.getDependencies(function(registry) {
        var app = Elm.Analyser.worker({ server: false, registry: registry });

        app.ports.sendReportValue.subscribe(function(report) {
            const reporter = require('./reporter');
            reporter(config.format, report);
            const fail =
                report.messages.length > 0 ||
                report.unusedDependencies.length > 0;
            process.exit(fail ? 1 : 0);
        });

        loggingPorts(app, config, directory);
        fileLoadingPorts(app, config, directory);
    });
};
