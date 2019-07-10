"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = __importDefault(require("lodash"));
function report(report) {
    var messages = report.messages;
    var unusedDependencies = report.unusedDependencies;
    console.log('Found ' + report.messages.length + ' message(s)');
    if (messages.length > 0) {
        var index_1 = lodash_1.default.groupBy(messages, 'file');
        console.log();
        console.log('Messages:');
        Object.keys(index_1).forEach(function (file) {
            console.log('- ' + file);
            index_1[file].forEach(function (x) {
                console.log('  > ' + x.data.description);
            });
        });
    }
    if (unusedDependencies.length > 0) {
        console.log();
        console.log('Unused dependencies:');
        unusedDependencies.forEach(function (dep) { return console.log('- ' + dep); });
    }
}
var reporter = { report: report };
exports.default = reporter;
