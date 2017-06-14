var watch = require("node-watch");

module.exports = function(app, elmWorker) {
    const pack = require(process.cwd() + "/elm-package.json");
    watch(pack["source-directories"], { recursive: true }, function(evt, name) {
        const change = [evt, name];
        elmWorker.ports.fileWatch.send(change);
    });
};
