const fileGatherer= require('../util/file-gatherer');
const fileReader = require('../fileReader');
const fileLoadingPorts = require('../util/file-loading-ports')
const fs =require('fs');

module.exports =function worker(state) {
  const directory = process.cwd();
  const input = fileGatherer.gather(directory);
  var Elm = require('../backend-elm.js');

  var app = Elm.Analyser.worker(input);

  app.ports.sendMessages.subscribe(function(x) {
      console.log("Messages:");
      console.log("---------");
      x.forEach(y => console.log(y));
  });

  fileLoadingPorts(app, process.cwd());
  return app;
}
