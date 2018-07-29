"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fileGatherer = __importStar(require("../util/file-gatherer"));
var fileReader = __importStar(require("../fileReader"));
function setup(app, directory) {
    app.ports.loadDependencyFiles.subscribe(function (dep) {
        var depName = dep[0];
        var version = dep[1];
        var result = fileGatherer.getDependencyFiles(directory, depName, version);
        var promises = result.map(function (fileName) {
            return new Promise(function (accept) {
                return fileReader.readFile(directory, fileName, accept);
            });
        });
        Promise.all(promises).then(function (targets) {
            //TODO
            return app.ports.onDependencyFiles.send([depName, version, targets]);
        }, function (e) {
            console.log('Error when loading files for loadDependencyFiles:', dep);
            console.log(e);
        });
    });
}
exports.setup = setup;
