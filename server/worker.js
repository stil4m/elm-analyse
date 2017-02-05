const fileGatherer= require('../util/file-gatherer');
const fileReader = require('../fileReader');
const fs =require('fs');

module.exports =function worker(state) {
  const directory = process.cwd();
  const input = fileGatherer(directory);
  var Elm = require('../elm.js');

  var app = Elm.Analyser.worker(input);

  app.ports.sendMessages.subscribe(function(x) {
      console.log("Messages:");
      console.log("---------");
      x.forEach(y => console.log(y));
  })
  app.ports.storeAstForSha.subscribe(function(x) {
      const sha1 = x[0];
      const content = x[1];
      fs.writeFileSync(directory + '/cache/' + sha1 + ".json", content);
  })
  app.ports.loadFile.subscribe(function(x) {
      fileReader(directory, x, function(result) {
          app.ports.fileContent.send(result);
      });
  });
}
