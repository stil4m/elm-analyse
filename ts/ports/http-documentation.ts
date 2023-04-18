import axios from 'axios';
import { ElmApp, DependencyPointer } from '../domain';

function setup(app: ElmApp) {
    app.ports.loadHttpDocumentation.subscribe((pointer: DependencyPointer) => {
        const { name, version } = pointer;

        axios.get(`http://package.elm-lang.org/packages/${name}/${version}/docs.json`)
            .then((reponse) => {
                app.ports.onHttpDocumentation.send({
                    dependency: pointer,
                    json: reponse.data
                })
            })
            .catch(() => {
                app.ports.onHttpDocumentation.send({
                    dependency: pointer,
                    json: null
                });
            })
    });
}

export { setup };
