import * as fileLoadingPorts from './file-loading-ports';
import * as loggingPorts from './util/logging-ports';
import { Registry } from './util/dependencies';
import * as dependencies from './util/dependencies';
import { ElmApp, Config, Report } from './domain';
import Reporter from './reporter';

const directory = process.cwd();
const Elm = require('./backend-elm');

function start(config: Config, project: {}) {
    const reporter = Reporter.build(config.format);

    dependencies.getDependencies(function(registry: Registry) {
        const app: ElmApp = Elm.Elm.Analyser.init({
            flags: {
                server: false,
                registry: registry || [],
                project: project
            }
        });

        app.ports.sendReportValue.subscribe(function(report: Report) {
            reporter.report(report);
            const fail = report.messages.length > 0 || report.unusedDependencies.length > 0;
            process.exit(fail ? 1 : 0);
        });

        loggingPorts.setup(app, config);
        fileLoadingPorts.setup(app, config, directory);
    });
}

export default { start };
