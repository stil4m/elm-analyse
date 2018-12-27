"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path = __importStar(require("path"));
var express_1 = __importDefault(require("express"));
var express_ws_1 = __importDefault(require("express-ws"));
var fs = __importStar(require("fs"));
var fileGatherer = __importStar(require("../util/file-gatherer"));
var worker_1 = __importDefault(require("./worker"));
var watcher_1 = __importDefault(require("./watcher"));
var control_1 = __importDefault(require("./control"));
var dashboard_1 = __importDefault(require("./dashboard"));
var bodyParser = __importStar(require("body-parser"));
var app = express_1.default();
var expressWs = express_ws_1.default(app);
app.use(bodyParser.json());
app.use(express_1.default.static(__dirname + '/../../public', {
    etag: false
}));
function start(config, info, project) {
    console.log('Elm Analyser server starting with config:');
    console.log(config);
    worker_1.default.run(config, project, function (elm) {
        var dashboard = dashboard_1.default.run(app, elm, expressWs);
        watcher_1.default.run(elm);
        control_1.default.run(app, elm);
        app.get('/file', function (req, res) {
            var fileName = req.query.file;
            fs.readFile(fileName, function (_err, content) {
                res.send(content);
            });
        });
        app.get('/api/tree', function (_req, res) {
            var directory = process.cwd();
            var x = fileGatherer.gather(directory);
            res.send(x.sourceFiles);
        });
        app.get('/info', function (_req, res) {
            res.send(info);
        });
        app.post('/api/fix', function (req, res) {
            var body = req.body;
            elm.ports.onFixMessage.send(body.id);
            res.send({});
        });
        app.get('/state', function (_req, res) {
            res.send(dashboard.getState());
        });
        app.get('/report', function (_req, res) {
            res.send(dashboard.getReport());
        });
        app.listen(config.port, function () {
            console.log('Listening on http://localhost:' + config.port);
        });
        app.get('*', function (_req, res) {
            res.sendFile(path.resolve("" + __dirname, "../../public/index.html"));
        });
    });
}
exports.default = { start: start };
