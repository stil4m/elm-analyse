"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
var fileGatherer = __importStar(require("../util/file-gatherer"));
var path = __importStar(require("path"));
function setup(app, directory) {
    app.ports.loadContext.subscribe(function () {
        var input = fileGatherer.gather(directory);
        var configuration;
        try {
            configuration = fs.readFileSync(path.join(directory, 'elm-analyse.json')).toString();
        }
        catch (e) {
            configuration = '';
        }
        var data = {
            sourceFiles: input.sourceFiles,
            interfaceFiles: input.interfaceFiles,
            configuration: configuration
        };
        setTimeout(function () {
            app.ports.onLoadedContext.send(data);
        }, 5);
    });
}
exports.setup = setup;
