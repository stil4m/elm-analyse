import * as request from 'request';
import { ElmApp } from '../domain';

function setup(app: ElmApp) {
    //TODO
    app.ports.loadHttpDocumentation.subscribe((depPair: string[]) => {
        const name = depPair[0];
        const version = depPair[1];

        request.get(
            `http://package.elm-lang.org/packages/${name}/${version}/documentation.json`,
            function(err: any, _response: request.Response, body: string) {
                if (err) {
                    app.ports.onHttpDocumentation.send([depPair, null]);
                    return;
                }
                try {
                    const parsed = JSON.parse(body);
                    app.ports.onHttpDocumentation.send([depPair, parsed]);
                } catch (e) {
                    app.ports.onHttpDocumentation.send([depPair, null]);
                }
            }
        );
    });
}

export { setup };
