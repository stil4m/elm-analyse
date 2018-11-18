#!/usr/bin/env node

import minimist from 'minimist';
import * as fs from 'fs';
import * as path from 'path';
import Server from '../server/app';
import Analyser from '../analyser';

var args = minimist(process.argv.slice(2), {
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

(function() {
    const elmAnalyseVersion = require(path.join(__dirname, '../../..', 'package.json')).version;

    const elmFormatPath = args['elm-format-path'] || 'elm-format';

    const validFormats = ['json', 'human'];

    const config = {
        port: args.port || 3000,
        elmFormatPath: elmFormatPath,
        format: validFormats.indexOf(args.format) != -1 ? args.format : 'human',
        open: args.open || false
    };
    const info = {
        version: elmAnalyseVersion,
        cwd: process.cwd(),
        config: config
    };

    if (args.help) {
        console.log('Usages:');
        console.log('  $ elm-analyse');
        console.log('    # Analyse the project and log messages to the console\n');
        console.log('  $ elm-analyse -s');
        console.log(
            '    # Analyse the project and start a server. Allows inspection of messages through a browser (Default: http://localhost:3000).\n'
        );
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

    const packageFileExists = fs.existsSync('./elm.json');
    if (!packageFileExists) {
        console.log('There is no elm.json file in this directory. elm-analyse will only work in directories where such a file is located.');
        process.exit(1);
    }

    const projectFile = JSON.parse(fs.readFileSync('./elm.json').toString());

    if (args.serve) {
        Server.start(config, info, projectFile);
        return;
    }
    Analyser.start(config, projectFile);
})();
