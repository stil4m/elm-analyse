module.exports = function(app, elm, expressWs) {
    var state = {
        status: "initialising",
        idCount: 0,
        queue: [],
        messages: [],
        modules: []
    };

    var report = null;

    function renderState() {
        return JSON.stringify(state);
    }

    app.ws("/state", function(ws, _req) {
        ws.send(renderState());
        ws.on("message", function(_msg) {
            ws.send(renderState());
        });
        ws.on("error", function(_msg) {
            console.log("WARN: Socket not gracefully closed");
            console.log(ws.connection);
        });
    });

    elm.ports.sendReportValue.subscribe(function(newReport) {
        report = newReport;
    });

    elm.ports.sendState.subscribe(function(newState) {
        state = newState;
        expressWs.getWss().clients.forEach(x => x.send(renderState()));
    });

    return {
        getState: function() {
            return state;
        },
        getReport: function() {
            return report;
        }
    };
};
