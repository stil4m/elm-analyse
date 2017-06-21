module.exports = function(app, elm, expressWs) {
    var state = {
        status: "initialising",
        idCount: 0,
        queue: [],
        messages: []
    };

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

    elm.ports.sendState.subscribe(function(stateString) {
        state = JSON.parse(stateString);
        expressWs.getWss().clients.forEach(x => x.send(renderState()));
    });

    return {
        getState: function() {
            return state;
        }
    };
};
