import * as path from 'path';
import express from 'express';
import ExpressWs from 'express-ws';
import * as fs from 'fs';
import * as fileGatherer from '../util/file-gatherer';
import { Config, Info, ElmApp } from '../domain';
import worker from './worker';
import watcher from './watcher';
import control from './control';
import Dashboard from './dashboard';
import * as bodyParser from 'body-parser';

const app = express();
const expressWs = ExpressWs(app);

app.use(bodyParser.json());
app.use(
    express.static(__dirname + '/../../public', {
        etag: false
    })
);

function start(config: Config, info: Info, project: {}) {
    console.log('Elm Analyser server starting with config:');
    console.log(config);

    worker.run(config, project, function(elm: ElmApp) {
        const dashboard = Dashboard.run(app, elm, expressWs);

        watcher.run(elm);
        control.run(app, elm);

        app.get('/file', function(req, res) {
            const fileName = req.query.file;
            fs.readFile(fileName, function(_err: any, content) {
                res.send(content);
            });
        });

        app.get('/api/tree', function(_req, res) {
            const directory = process.cwd();
            const x = fileGatherer.gather(directory);
            res.send(x.sourceFiles);
        });

        app.get('/info', function(_req, res) {
            res.send(info);
        });

        app.post('/api/fix', (req, res) => {
            const body: { id: number } = req.body;
            elm.ports.onFixMessage.send(body.id);
            res.send({});
        });

        app.get('/state', function(_req, res) {
            res.send(dashboard.getState());
        });

        app.get('/report', function(_req, res) {
            res.send(dashboard.getReport());
        });

        app.listen(config.port, function() {
            console.log('Listening on http://localhost:' + config.port);
        });

        app.get('*', function(_req, res) {
            res.sendFile(path.resolve(`${__dirname}`, `../../public/index.html`));
        });
    });
}

export default { start };
