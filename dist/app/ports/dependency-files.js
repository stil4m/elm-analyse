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
function setup(app, directory, fileReader) {
    app.ports.loadDependencyFiles.subscribe(function (dependency) {
        var result = fileGatherer.getDependencyFiles(directory, dependency);
        var promises = result.map(function (fileName) { return new Promise(function (accept) { return fileReader.readFile(directory, fileName, accept); }); });
        Promise.all(promises).then(function (targets) {
            return app.ports.onDependencyFiles.send({
                dependency: dependency,
                files: targets
            });
        }, function (e) {
            console.log('Error when loading files for loadDependencyFiles:', dependency);
            console.log(e);
        });
    });
}
exports.setup = setup;
