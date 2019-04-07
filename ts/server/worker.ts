import * as fileLoadingPorts from '../file-loading-ports';
import * as loggingPorts from '../util/logging-ports';
import * as dependencies from '../util/dependencies';
import { Config, ElmApp, Report } from '../domain';
const opn = require('opn');

function run(config: Config, project: {}, onload: (app: ElmApp) => void) {
    dependencies.getDependencies(function(registry) {
        const directory = process.cwd();
        var Elm = require('../backend-elm.js');
        var app = Elm.Elm.Analyser.init({
            flags: {
                server: true,
                registry: registry || [],
                project: project
            }
        });

        app.ports.sendReportValue.subscribe((report: Report) => {
            console.log('Found ' + report.messages.length + ' message(s)');
        });

        loggingPorts.setup(app, config);
        fileLoadingPorts.setup(app, config, directory);
        onload(app);
        if (config.open) {
            opn('http://localhost:' + config.port);
        }
    });
}

export default { run };
