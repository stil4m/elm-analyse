"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setup = void 0;
var DependencyFiles = __importStar(require("./ports/dependency-files"));
var RawDependencies = __importStar(require("./ports/raw-dependencies"));
var HttpDocumentation = __importStar(require("./ports/http-documentation"));
var FileLoader = __importStar(require("./ports/file-loader"));
var Context = __importStar(require("./ports/context"));
var cache_1 = require("./util/cache");
var fileReader_1 = require("./fileReader");
function setup(app, config, directory) {
    var localCache = new cache_1.LocalCache(directory);
    var fileReader = new fileReader_1.FileReader(localCache);
    HttpDocumentation.setup(app);
    RawDependencies.setup(app);
    DependencyFiles.setup(app, directory, fileReader);
    FileLoader.setup(app, config, directory, localCache, fileReader);
    Context.setup(app, directory);
}
exports.setup = setup;
