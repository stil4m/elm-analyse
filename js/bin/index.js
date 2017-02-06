#!/usr/bin/env node

var minimist = require("minimist");

var args = minimist(process.argv.slice(2), {
    alias: {
        'serve': 's',
        'help': 'h',
    },
    boolean: ['serve', 'help'],
    string: []
});

(function() {
    if (args.help) {
        console.log("TODO: Do help")
        return;
    }

    if (args.serve) {
        var server = require('../server/app.js');
        server();
        return
    }
    var analyser = require('../analyser.js');
    analyser();
})();
