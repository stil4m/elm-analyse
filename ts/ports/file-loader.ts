import * as fs from 'fs';
import { LocalCache } from '../util/cache';
import * as cp from 'child_process';
import { ElmApp, FileStore, AstStore, Config, FileContent, FileContentSha } from '../domain';
import { FileReader } from '../fileReader';

function setup(app: ElmApp, config: Config, directory: string, cache: LocalCache, fileReader: FileReader) {
    app.ports.loadFile.subscribe(fileName => {
        fileReader.readFile(directory, fileName, result => app.ports.fileContent.send(result));
    });

    app.ports.storeAstForSha.subscribe((data: AstStore) => {
        const sha1 = data.sha1;
        const content = data.ast;
        cache.storeShaJson(sha1, content);
    });

    app.ports.storeFile.subscribe((file: FileStore) => {
        new Promise(function(accept) {
            fs.writeFile(file.file, file.newContent, function() {
                try {
                    cp.execSync(config.elmFormatPath + ' --yes ' + file.file, {
                        stdio: []
                    });
                    console.log('Formatted file', file.file);
                    accept();
                } catch (e) {
                    console.log('Could not formated file', file.file);
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
            (fileContent: FileContent) => {
                const x: FileContentSha = {
                    file: {
                        version: fileContent.sha1,
                        path: fileContent.path
                    },
                    content: fileContent.content
                };
                app.ports.onFileContentWithShas.send(x);
            },
            (e: any) => {
                console.log('Error when loading files for loadFileContentWithShas:');
                console.log(e);
            }
        );
    });
}

export { setup };
