#!/usr/bin/env node
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
var minimist_1 = __importDefault(require("minimist"));
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var app_1 = __importDefault(require("../server/app"));
var analyser_1 = __importDefault(require("../analyser"));
var args = minimist_1.default(process.argv.slice(2), {
    alias: {
        serve: 's',
        help: 'h',
        port: 'p',
        version: 'v',
        open: 'o'
    },
    boolean: ['serve', 'help', 'version', 'open'],
    string: ['port', 'elm-format-path', 'format']
});
(function () {
    var elmAnalyseVersion = require(path.join(__dirname, '../../..', 'package.json')).version;
    var elmFormatPath = args['elm-format-path'] || 'elm-format';
    var validFormats = ['json', 'human'];
    var config = {
        port: args.port || 3000,
        elmFormatPath: elmFormatPath,
        format: validFormats.indexOf(args.format) != -1 ? args.format : 'human',
        open: args.open || false
    };
    var info = {
        version: elmAnalyseVersion,
        cwd: process.cwd(),
        config: config
    };
    if (args.help) {
        console.log('Usages:');
        console.log('  $ elm-analyse');
        console.log('    # Analyse the project and log messages to the console\n');
        console.log('  $ elm-analyse -s');
        console.log('    # Analyse the project and start a server. Allows inspection of messages through a browser (Default: http://localhost:3000).\n');
        console.log('Options: ');
        console.log('   --help, -h          Print the help output.');
        console.log('   --serve, -s         Enable server mode. Disabled by default.');
        console.log('   --port, -p          The port on which the server should listen. Defaults to 3000.');
        console.log('   --open, -o          Open default browser when server goes live.');
        console.log('   --elm-format-path   Path to elm-format. Defaults to `elm-format`.');
        console.log('   --format            Output format for CLI. Defaults to "human". Options "human"|"json"');
        process.exit(1);
    }
    if (args.version) {
        console.log(elmAnalyseVersion);
        process.exit(0);
    }
    var packageFileExists = fs.existsSync('./elm.json');
    if (!packageFileExists) {
        console.log('There is no elm.json file in this directory. elm-analyse will only work in directories where such a file is located.');
        process.exit(1);
    }
    var projectFile = JSON.parse(fs.readFileSync('./elm.json').toString());
    if (args.serve) {
        app_1.default.start(config, info, projectFile);
        return;
    }
    analyser_1.default.start(config, projectFile);
})();
