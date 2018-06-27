"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var DependencyFiles = __importStar(require("./ports/dependency-files"));
var RawDependencies = __importStar(require("./ports/raw-dependencies"));
var HttpDocumentation = __importStar(require("./ports/http-documentation"));
var FileLoader = __importStar(require("./ports/file-loader"));
var Context = __importStar(require("./ports/context"));
function setup(app, config, directory) {
    HttpDocumentation.setup(app);
    RawDependencies.setup(app);
    DependencyFiles.setup(app, directory);
    FileLoader.setup(app, config, directory);
    Context.setup(app, directory);
}
exports.setup = setup;
