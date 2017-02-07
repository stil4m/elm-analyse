#!/usr/bin/env node

var minimist = require("minimist");

var args = minimist(process.argv.slice(2), {
    alias: {
        'serve': 's',
        'help': 'h',
        'port': 'p',
    },
    boolean: ['serve', 'help'],
    string: ['port', 'elm-format-path']
});

(function() {
    const elmFormatPath = args['elm-format-path'] || 'elm-format';
    const config = {
        port: args.port || 3000,
        elmFormatPath: elmFormatPath,
    }
    if (args.help) {
        console.log("TODO: Do help")
        return;
    }

    if (args.serve) {
        var server = require('../server/app.js');
        server(config);
        return
    }
    var analyser = require('../analyser.js');
    analyser(config);
})();
