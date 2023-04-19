"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fileLoadingPorts = __importStar(require("../file-loading-ports"));
var loggingPorts = __importStar(require("../util/logging-ports"));
var dependencies = __importStar(require("../util/dependencies"));
var opn = require('opn');
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
            opn('http://localhost:' + config.port);
        }
    });
}
exports.default = { run: run };
