const cache = require('../util/cache');

module.exports = function setup(app) {
    const checkedSubscribe = require('./checked-subscribe')(app);

    checkedSubscribe('storeRawDependency', function(x) {
        cache.storeDependencyJson(x[0], x[1], x[2]);
    });

    checkedSubscribe('loadRawDependency', function(x) {
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
};
