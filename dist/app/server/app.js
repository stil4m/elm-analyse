"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var express_ws_1 = __importDefault(require("express-ws"));
var fs = __importStar(require("fs"));
var fileGatherer = __importStar(require("../util/file-gatherer"));
var worker_1 = __importDefault(require("./worker"));
var watcher_1 = __importDefault(require("./watcher"));
var control_1 = __importDefault(require("./control"));
var dashboard_1 = __importDefault(require("./dashboard"));
var app = express_1.default();
var expressWs = express_ws_1.default(app);
app.use(express_1.default.static(__dirname + '/../../public', {
    etag: false
}));
function start(config, info) {
    console.log('Elm Analyser server starting with config:');
    console.log(config);
    worker_1.default.run(config, function (elm) {
        var dashboard = dashboard_1.default.run(app, elm, expressWs);
        watcher_1.default.run(elm);
        control_1.default.run(app, elm);
        app.get('/file', function (req, res) {
            var fileName = req.query.file;
            fs.readFile(fileName, function (_err, content) {
                res.send(content);
            });
        });
        app.get('/tree', function (_req, res) {
            var directory = process.cwd();
            var x = fileGatherer.gather(directory);
            res.send(x.sourceFiles);
        });
        app.get('/info', function (_req, res) {
            res.send(info);
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
    });
}
exports.default = { start: start };
