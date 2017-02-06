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
    app.ports.messagesAsJson.subscribe(function(x) {
      console.log("JSON Messages:")
      console.log("---------")
      x.forEach(y => console.log(y));
    });
    app.ports.sendMessages.subscribe(function(x) {
        console.log("Messages:")
        console.log("---------")
        x.forEach(y => console.log(y));
    })
    app.ports.storeAstForSha.subscribe(function(x) {
        const sha1 = x[0];
        const content = x[1];
        fs.writeFileSync('./cache/_shas/' + sha1 + ".json", content);
    })
    app.ports.loadFile.subscribe(function(x) {
        fileReader(directory, x, function(result) {
            app.ports.fileContent.send(result);
        });
    });

    app.ports.loadRawDependency.subscribe(function(x) {
      //TODO
      fs.readFile('./cache/' + x[0] + "/" + x[1] + "/dependency.json", function (err, content) {
        if (err) {
          app.ports.onRawDependency.send([x[0], x[1],""+x]);
        } else {
          app.ports.onRawDependency.send([x[0], x[1],content.toString()]);
        }
      });
    });

    app.ports.storeRawDependency.subscribe(function(x) {
      console.log("Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.");
      console.log(x);
      cp.execSync('mkdir -p ' + './cache/' + x[0] + "/" + x[1]);
      fs.writeFileSync('./cache/' + x[0] + "/" + x[1] + "/dependency.json", x[2]);
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
      reduceTargets();

    })
})();
