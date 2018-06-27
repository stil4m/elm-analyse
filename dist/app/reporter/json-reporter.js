"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function report(report) {
    var output = JSON.stringify(report);
    console.log(output);
}
var reporter = { report: report };
exports.default = reporter;
