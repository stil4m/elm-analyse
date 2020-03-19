import * as request from 'request';
import * as path from 'path';
import * as os from 'os';

import { ElmApp, DependencyPointer } from '../domain';

function loadFromPackageSite({ name, version }: DependencyPointer, cb: (result: any) => void) {
    request.get(`http://package.elm-lang.org/packages/${name}/${version}/docs.json`, function(
        err: any,
        _response: request.Response,
        body: string
    ) {
        if (err) {
            cb(null);
        }
        try {
            const parsed = JSON.parse(body);
            cb(parsed);
        } catch (e) {
            cb(null);
        }
    });
}

function loadFromElmHome({ name, version }: DependencyPointer, directory: string) {
    const projectElmJson = path.resolve(directory, 'elm.json');
    const elmVersion = require(projectElmJson)['elm-version'];
    const elmHome = process.env.ELM_HOME || path.resolve(os.homedir(), '.elm');
    const docsJsonPath = path.resolve(elmHome, elmVersion, 'package', name, version, 'docs.json');
    return require(docsJsonPath);
}

function setup(app: ElmApp, directory: string) {
    app.ports.loadDocsJson.subscribe((pointer: DependencyPointer) => {
        const onLoaded = (json: any) =>
            app.ports.onDocsJsonLoaded.send({
                dependency: pointer,
                json
            });
        try {
            const docs = loadFromElmHome(pointer, directory);
            onLoaded(docs);
        } catch (e) {
            loadFromPackageSite(pointer, onLoaded);
        }
    });
}

export { setup };
