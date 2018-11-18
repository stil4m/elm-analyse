import * as cache from '../util/cache';

import { ElmApp, DependencyPointer, DependencyStore } from '../domain';

function setup(app: ElmApp) {
    app.ports.storeRawDependency.subscribe((x: DependencyStore) => {
        const dependency = x.dependency;
        cache.storeDependencyJson(dependency.name, dependency.version, x.content);
    });

    app.ports.loadRawDependency.subscribe((dependency: DependencyPointer) => {
        cache.readDependencyJson(dependency.name, dependency.version, function(err, content) {
            if (err) {
                app.ports.onRawDependency.send({
                    dependency: dependency,
                    json: null
                });
            } else {
                try {
                    const parsed: JSON = JSON.parse(content.toString());

                    app.ports.onRawDependency.send({
                        dependency: dependency,
                        json: parsed
                    });
                } catch (e) {
                    app.ports.onRawDependency.send({
                        dependency: dependency,
                        json: null
                    });
                }
            }
        });
    });
}

export { setup };
