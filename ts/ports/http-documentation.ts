import * as request from 'request';
import { ElmApp, DependencyPointer } from '../domain';

function setup(app: ElmApp) {
    app.ports.loadHttpDocumentation.subscribe((pointer: DependencyPointer) => {
        const { name, version } = pointer;

        request.get(`http://package.elm-lang.org/packages/${name}/${version}/docs.json`, function(
            err: any,
            _response: request.Response,
            body: string
        ) {
            if (err) {
                app.ports.onHttpDocumentation.send({
                    dependency: pointer,
                    json: null
                });
                return;
            }
            try {
                const parsed = JSON.parse(body);
                app.ports.onHttpDocumentation.send({
                    dependency: pointer,
                    json: parsed
                });
            } catch (e) {
                app.ports.onHttpDocumentation.send({
                    dependency: pointer,
                    json: null
                });
            }
        });
    });
}

export { setup };
