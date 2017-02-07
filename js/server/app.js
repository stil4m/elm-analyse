var express = require('express')
var app = express();
var expressWs = require('express-ws')(app);
const fs = require('fs');
app.use(express.static(__dirname + '/../public'))


module.exports = function(config) {
    console.log('Elm Analyser server starting with config:');
    console.log(config);
    const state = {
        initializing: true
    }

    const elm = require('./worker')(config);
    require('./dashboard')(app, elm, expressWs);
    require('./control')(app, elm, expressWs);

    app.get('/file', function(req, res) {
        const fileName = req.query.file;
        fs.readFile(fileName, function(err, content) {
            res.send(content);
        });
    });

    app.listen(config.port, function() {
        console.log("Server started");
    });
};
