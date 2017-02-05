const fs = require('fs');
const cp = require('child_process');
const _ = require('lodash');
const fileReader = require('./fileReader');
const fileGatherer= require('./util/file-gatherer');
const fakeDir = "."
const directory = process.cwd() + "/" +fakeDir;


(function() {
    const input = fileGatherer.gather(directory);

    const Elm = require('./elm');
    var app = Elm.Analyser.worker(input);
    app.ports.sendMessages.subscribe(function(x) {
        console.log("Messages:")
        console.log("---------")
        x.forEach(y => console.log(y));
    })
    app.ports.storeAstForSha.subscribe(function(x) {
        const sha1 = x[0];
        const content = x[1];
        fs.writeFileSync('./cache/' + sha1 + ".json", content);
    })
    app.ports.loadFile.subscribe(function(x) {
        fileReader(directory, x, function(result) {
            app.ports.fileContent.send(result);
        });
    });

    app.ports.loadRawDependency.subscribe(function(x) {
      //TODO
      setTimeout(function() {
        app.ports.onRawDependency.send([x[0], x[1],""+x]);
      },1);
    });

    app.ports.loadDependencyFiles.subscribe(function(dep) {
      var depName = dep[0];
      var version = dep[1];
      var result = fileGatherer.getDependencyFiles(directory, depName,version);
      var targets = [];

      //TODO Something with promises
      function reduceTargets() {
        if (targets.length == result.length) {
          console.log("Finished", depName, version);
          app.ports.onDependencyFiles.send([depName,version, targets]);
          return;
        }
        fileReader(directory, result[targets.length], function(y) {
          targets.push(y);
          reduceTargets();
        });
      }
      console.log("loadDependencyFiles",depName,version);
      reduceTargets();

    })
})();
