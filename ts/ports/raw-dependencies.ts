import * as cache from '../util/cache';

import { ElmApp } from '../domain';

function setup(app: ElmApp) {
    app.ports.storeRawDependency.subscribe(x => {
        cache.storeDependencyJson(x[0], x[1], x[2]);
    });

    app.ports.loadRawDependency.subscribe(x => {
        var dependency = x[0];
        var version = x[1];
        cache.readDependencyJson(dependency, version, function(err, content) {
            if (err) {
                //TODO
                app.ports.onRawDependency.send([dependency, version, '' + x]);
            } else {
                app.ports.onRawDependency.send([
                    dependency,
                    version,
                    content.toString()
                ]);
            }
        });
    });
}

export { setup };
