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
        console.log("TODO: Do serve");
        return
    }
    console.log("Raw analyser");
})();
