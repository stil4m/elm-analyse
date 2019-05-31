import * as fs from 'fs';
import * as fileGatherer from '../util/file-gatherer';
import { ElmApp, Context } from '../domain';
import * as path from 'path';

function setup(app: ElmApp, directory: string) {
    app.ports.loadContext.subscribe(() => {
        const input = fileGatherer.gather(directory);
        var configuration;
        try {
            configuration = fs.readFileSync(path.join(directory, 'elm-analyse.json')).toString();
        } catch (e) {
            configuration = '';
        }
        const data: Context = {
            sourceFiles: input.sourceFiles,
            interfaceFiles: input.interfaceFiles,
            configuration: configuration
        };

        setTimeout(function() {
            app.ports.onLoadedContext.send(data);
        }, 5);
    });
}

export { setup };
