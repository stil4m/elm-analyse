const fileGatherer= require('../util/file-gatherer');
const fileReader = require('../fileReader');
const fileLoadingPorts = require('../util/file-loading-ports')
const fs =require('fs');

module.exports =function worker(config) {
  const directory = process.cwd();
  const input = fileGatherer.gather(directory);
  var Elm = require('../backend-elm.js');

  var app = Elm.Analyser.worker(input);

  app.ports.sendMessages.subscribe(function(x) {
      console.log("Found " + x.length + " message(s)");
  });

  fileLoadingPorts(app, config, process.cwd());
  return app;
}
