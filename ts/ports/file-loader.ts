import * as fs from 'fs';
import * as cache from '../util/cache';
import * as cp from 'child_process';
import { ElmApp, Config, FileContent, FileContentSha } from '../domain';
import * as fileReader from '../fileReader';

function setup(app: ElmApp, config: Config, directory: string) {
    app.ports.loadFile.subscribe(fileName => {
        fileReader.readFile(directory, fileName, result =>
            app.ports.fileContent.send(result)
        );
    });

    app.ports.storeAstForSha.subscribe(data => {
        const sha1 = data[0];
        const content = data[1];
        cache.storeShaJson(sha1, content);
    });

    app.ports.storeFiles.subscribe(file => {
        new Promise(function(accept) {
            fs.writeFile(file[0], file[1], function() {
                console.log('Written file', file[0], '...');
                try {
                    cp.execSync(config.elmFormatPath + ' --yes ' + file[0], {
                        stdio: []
                    });
                    console.log('Formatted file', file[0]);
                    accept();
                } catch (e) {
                    console.log('Could not formated file', file[0]);
                    accept();
                }
            });
        }).then(function() {
            app.ports.onStoredFiles.send(true);
        });
    });

    app.ports.loadFileContentWithSha.subscribe(fileName => {
        new Promise<FileContent>(accept => {
            fileReader.readFile(directory, fileName, accept);
        }).then(
            (pair: FileContent) => {
                var x: FileContentSha = {
                    file: {
                        version: pair.sha1,
                        path: pair.path
                    },
                    content: pair.content
                };
                app.ports.onFileContentWithShas.send(x);
            },
            (e: any) => {
                console.log(
                    'Error when loading files for loadFileContentWithShas:'
                );
                console.log(e);
            }
        );
    });
}

export { setup };
