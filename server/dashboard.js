module.exports = function(app, elm, expressWs) {

    var state = {
        messages: [],
        loading: true
    };

    function renderState() {
        return JSON.stringify(state)
    }


    app.ws('/dashboard', function(ws, req) {
        ws.send(renderState());

        ws.on('message', function(msg) {
            console.log("On message");
            ws.send(renderState())
        });
    });

    elm.ports.messagesAsJson.subscribe(function(x) {
        state.messages = x.map(i => JSON.parse(i));
        state.loading = false;
        expressWs.getWss().clients.forEach(x => x.send(renderState()))
    })

}
