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
var cache = __importStar(require("../util/cache"));
var cp = __importStar(require("child_process"));
var fileReader = __importStar(require("../fileReader"));
function setup(app, config, directory) {
    app.ports.loadFile.subscribe(function (fileName) {
        fileReader.readFile(directory, fileName, function (result) {
            return app.ports.fileContent.send(result);
        });
    });
    app.ports.storeAstForSha.subscribe(function (data) {
        var sha1 = data[0];
        var content = data[1];
        cache.storeShaJson(sha1, content);
    });
    app.ports.storeFiles.subscribe(function (file) {
        new Promise(function (accept) {
            fs.writeFile(file[0], file[1], function () {
                console.log('Written file', file[0], '...');
                try {
                    cp.execSync(config.elmFormatPath + ' --yes ' + file[0], {
                        stdio: []
                    });
                    console.log('Formatted file', file[0]);
                    accept();
                }
                catch (e) {
                    console.log('Could not formated file', file[0]);
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
        }).then(function (pair) {
            var x = {
                file: {
                    version: pair.sha1,
                    path: pair.path
                },
                content: pair.content
            };
            app.ports.onFileContentWithShas.send(x);
        }, function (e) {
            console.log('Error when loading files for loadFileContentWithShas:');
            console.log(e);
        });
    });
}
exports.setup = setup;
