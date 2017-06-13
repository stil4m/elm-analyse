var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);
const fs = require('fs');
const fileGatherer = require('../util/file-gatherer');
app.use(express.static(__dirname + '/../public', {
    etag: false
}));


module.exports = function(config) {
    console.log('Elm Analyser server starting with config:');
    console.log(config);

    const elm = require('./worker')(config);
    const dashboard = require('./dashboard')(app, elm, expressWs);

    require('./watcher')(app, elm);
    require('./control')(app, elm, expressWs);

    app.get('/file', function(req, res) {
        const fileName = req.query.file;
        fs.readFile(fileName, function(err, content) {
            res.send(content);
        });
    });

    app.get('/tree', function(req, res) {
        const directory = process.cwd();
        const x = fileGatherer.gather(directory);
        res.send(x.sourceFiles);
    });

    app.get('/state', function(req, res) {
        res.send(dashboard.getState());
    });

    app.listen(config.port, function() {
        console.log('Listening on http://localhost:' + config.port);
    });
};
