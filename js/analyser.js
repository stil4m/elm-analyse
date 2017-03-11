const directory = process.cwd();

module.exports = function(config) {
    const fileLoadingPorts = require('./util/file-loading-ports');
    const loggingPorts = require('./util/logging-ports');
    const Elm = require('./backend-elm');

    var app = Elm.Analyser.worker();

    app.ports.sendMessages.subscribe(function(x) {
        if (x.length == 0) {
            console.log('No messages. Everything seems ok!');
        } else {
            console.log('Messages:');
            console.log('---------');
            x.forEach(y => console.log(y));

            process.exit(1);
        }
    });

    loggingPorts(app, config, directory);
    fileLoadingPorts(app, config, directory);
};
