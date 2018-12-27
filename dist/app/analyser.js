"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fileLoadingPorts = __importStar(require("./file-loading-ports"));
var loggingPorts = __importStar(require("./util/logging-ports"));
var dependencies = __importStar(require("./util/dependencies"));
var reporter_1 = __importDefault(require("./reporter"));
var directory = process.cwd();
var Elm = require('./backend-elm');
function start(config, project) {
    var reporter = reporter_1.default.build(config.format);
    dependencies.getDependencies(function (registry) {
        var app = Elm.Elm.Analyser.init({
            flags: {
                server: false,
                registry: registry || [],
                project: project
            }
        });
        app.ports.sendReportValue.subscribe(function (report) {
            reporter.report(report);
            var fail = report.messages.length > 0 || report.unusedDependencies.length > 0;
            process.exit(fail ? 1 : 0);
        });
        loggingPorts.setup(app, config);
        fileLoadingPorts.setup(app, config, directory);
    });
}
exports.default = { start: start };
