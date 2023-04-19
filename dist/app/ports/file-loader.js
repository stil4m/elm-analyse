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
var fs = __importStar(require("fs"));
var cp = __importStar(require("child_process"));
function setup(app, config, directory, cache, fileReader) {
    app.ports.loadFile.subscribe(function (fileName) {
        fileReader.readFile(directory, fileName, function (result) { return app.ports.fileContent.send(result); });
    });
    app.ports.storeAstForSha.subscribe(function (data) {
        var sha1 = data.sha1;
        var content = data.ast;
        cache.storeShaJson(sha1, content);
    });
    app.ports.storeFile.subscribe(function (file) {
        new Promise(function (accept) {
            fs.writeFile(file.file, file.newContent, function () {
                try {
                    cp.execSync(config.elmFormatPath + ' --yes ' + file.file, {
                        stdio: []
                    });
                    console.log('Formatted file', file.file);
                    accept();
                }
                catch (e) {
                    console.log('Could not formated file', file.file);
                    accept();
                }
            });
        }).then(function () {
            app.ports.onStoredFiles.send(true);
        });
    });
    app.ports.loadFileContentWithSha.subscribe(function (fileName) {
        new Promise(function (accept) {
            fileReader.readFile(directory, fileName, accept);
        }).then(function (fileContent) {
            var x = {
                file: {
                    version: fileContent.sha1,
                    path: fileContent.path
                },
                content: fileContent.content
            };
            app.ports.onFileContentWithShas.send(x);
        }, function (e) {
            console.log('Error when loading files for loadFileContentWithShas:');
            console.log(e);
        });
    });
}
exports.setup = setup;
