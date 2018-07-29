"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var human_reporter_1 = __importDefault(require("./human-reporter"));
var json_reporter_1 = __importDefault(require("./json-reporter"));
function build(reporter) {
    var rep;
    if (reporter === 'json') {
        rep = json_reporter_1.default;
    }
    else {
        rep = human_reporter_1.default;
    }
    return rep;
}
exports.default = { build: build };
