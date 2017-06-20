const watch = require("node-watch");
const fileGatherer = require("../util/file-gatherer");

module.exports = function(app, elmWorker) {
    const pack = require(process.cwd() + "/elm-package.json");
    watch(pack["source-directories"], { recursive: true }, function(evt, name) {
        const change = [evt, name];
        if (fileGatherer.includedInFileSet(name)) {
            elmWorker.ports.fileWatch.send(change);
        }
    });
};
