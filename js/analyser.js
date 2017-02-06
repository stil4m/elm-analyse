const fs = require('fs');
const cp = require('child_process');
const _ = require('lodash');
const fileReader = require('./fileReader');
const fileGatherer= require('./util/file-gatherer');
const fakeDir = "."
const directory = process.cwd() + "/" +fakeDir;


module.exports = function() {
    const input = fileGatherer.gather(directory);

    const Elm = require('./backend-elm');
    var app = Elm.Analyser.worker(input);
    // app.ports.messagesAsJson.subscribe(function(x) {
    //   console.log("JSON Messages:")
    //   console.log("---------")
    //   x.forEach(y => console.log(y));
    // });
    app.ports.sendMessages.subscribe(function(x) {
        console.log("Messages:")
        console.log("---------")
        x.forEach(y => console.log(y));
    });

    var fileLoadingPorts = require('./util/file-loading-ports');
    fileLoadingPorts(app, directory);

};
