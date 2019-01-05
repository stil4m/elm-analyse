"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var opn_1 = __importDefault(require("opn"));
var fileLoadingPorts = __importStar(require("../file-loading-ports"));
var loggingPorts = __importStar(require("../util/logging-ports"));
var dependencies = __importStar(require("../util/dependencies"));
function run(config, project, onload) {
    dependencies.getDependencies(function (registry) {
        var directory = process.cwd();
        var Elm = require('../backend-elm.js');
        var app = Elm.Elm.Analyser.init({
            flags: {
                server: true,
                registry: registry || [],
                project: project
            }
        });
        app.ports.sendReportValue.subscribe(function (report) {
            console.log('Found ' + report.messages.length + ' message(s)');
        });
        loggingPorts.setup(app, config);
        fileLoadingPorts.setup(app, config, directory);
        onload(app);
        if (config.open) {
            opn_1.default('http://localhost:' + config.port);
        }
    });
}
exports.default = { run: run };
