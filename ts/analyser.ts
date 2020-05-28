import * as fileLoadingPorts from './file-loading-ports';
import * as loggingPorts from './util/logging-ports';
import { Registry } from './util/dependencies';
import * as dependencies from './util/dependencies';
import { ElmApp, Config, Report, FileStore } from './domain';
import Reporter from './reporter';
import { printInPlace } from './util/logging-ports';

const directory = process.cwd();
const Elm = require('./backend-elm');

function start(config: Config, project: {}) {
    const reporter = Reporter.build(config.format);

    startAnalyser(config, project, function(_, report: Report) {
        reporter.report(report);
        const fail = report.messages.length > 0 || report.unusedDependencies.length > 0;
        process.exit(fail ? 1 : 0);
    });
}

function fix(path: string, config: Config, project: {}) {
    let initialReport: Report;
    startAnalyser(config, project, function onReport(app: ElmApp, report: Report) {
        if (!initialReport) {
            initialReport = report;
        } else {
            let reportForFile = { ...initialReport, messages: initialReport.messages.filter(m => m.file == path) };
            let newReportForFile = { ...report, messages: report.messages.filter(m => m.file == path) };
            printReport(`Fix Complete for ${path}`, reportForFile, newReportForFile);
            return;
        }
        app.ports.storeFile.subscribe(() => {
            printInPlace(`Writing file: ${path}`);
            app.ports.onReset.send(true);
        });
        app.ports.onFixFileMessage.send(path);
    });
}

function fixAll(config: Config, project: {}) {
    let initialReport: Report;
    startAnalyser(config, project, function onReport(app: ElmApp, report: Report) {
        if (!initialReport) {
            initialReport = report;
        } else {
            printReport(`Fix Complete`, initialReport, report);
            return;
        }

        const files = new Set(report.messages.map(m => m.file));
        let filesLeftToSave = files.size;
        app.ports.storeFile.subscribe((fileStore: FileStore) => {
            printInPlace(`Writing file ${fileStore.file}`);
            filesLeftToSave--;
            if (filesLeftToSave === 0) {
                app.ports.onReset.send(true);
            }
        });
        files.forEach((file: string) => {
            printInPlace(`Fixing file: ${file}`);
            app.ports.onFixFileMessage.send(file);
        });
    });
}

function printReport(title: string, initialReport: Report, newReport: Report) {
    console.log('\n');
    console.log(`Elm Analyse - ${title}`);
    console.log('------------------------------');
    console.log(`Messages Before: ${initialReport.messages.length}`);
    console.log(`Messages After : ${newReport.messages.length}`);
    console.log(`Issues Fixed   : ${initialReport.messages.length - newReport.messages.length}`);
    console.log('------------------------------');
}

function startAnalyser(config: Config, project = {}, onReport: (app: ElmApp, report: Report) => any) {
    dependencies.getDependencies(function(registry: Registry) {
        const app: ElmApp = Elm.Elm.Analyser.init({
            flags: {
                server: false,
                registry: registry || [],
                project: project
            }
        });

        app.ports.sendReportValue.subscribe(function(report) {
            onReport(app, report);
        });

        loggingPorts.setup(app, config);
        fileLoadingPorts.setup(app, config, directory);
    });
}

export default { start, fix, fixAll };
