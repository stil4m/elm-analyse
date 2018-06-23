const fileGatherer = require('../util/file-gatherer');

module.exports = function setup(app, config, directory) {
    const fileReader = require('../fileReader')(config);
    const checkedSubscribe = require('./checked-subscribe')(app);

    checkedSubscribe('loadDependencyFiles', dep => {
        var depName = dep[0];
        var version = dep[1];
        var result = fileGatherer.getDependencyFiles(
            directory,
            depName,
            version
        );

        const promises = result.map(
            fileName =>
                new Promise(accept => fileReader(directory, fileName, accept))
        );
        Promise.all(promises).then(
            targets =>
                app.ports.onDependencyFiles.send([depName, version, targets]),
            e => {
                console.log(
                    'Error when loading files for loadDependencyFiles:',
                    dep
                );
                console.log(e);
            }
        );
    });
};
