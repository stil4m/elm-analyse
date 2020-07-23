import * as fs from 'fs';
import * as fileGatherer from '../util/file-gatherer';
import { Config, ElmApp, Context } from '../domain';

function setup(config: Config, app: ElmApp, directory: string) {
    app.ports.loadContext.subscribe(() => {
        const input = fileGatherer.gather(config, directory);
        var configuration;
        try {
            configuration = fs.readFileSync('./elm-analyse.json').toString();
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
