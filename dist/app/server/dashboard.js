"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function run(app, elm, expressWs) {
    var state = {
        status: 'initialising',
        idCount: 0,
        queue: [],
        messages: [],
        modules: []
    };
    var report = null;
    function renderState() {
        return JSON.stringify(state);
    }
    app.ws('/state', function (ws) {
        ws.send(renderState());
        ws.on('message', function () {
            ws.send(renderState());
        });
        ws.on('error', function () {
            console.log('WARN: Socket not gracefully closed');
            console.log(ws.connection);
        });
    });
    elm.ports.sendReportValue.subscribe(function (newReport) {
        report = newReport;
    });
    elm.ports.sendState.subscribe(function (newState) {
        state = newState;
        expressWs.getWss().clients.forEach(function (x) { return x.send(renderState()); });
    });
    return {
        getState: function () {
            return state;
        },
        getReport: function () {
            return report;
        }
    };
}
exports.default = { run: run };
