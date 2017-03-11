module.exports = function(app, elm, _expressWs) {

    app.ws('/control', function(ws, _req) {
        ws.on('message', function(msg) {
            if (msg === 'reload') {
                elm.ports.onReset.send(true);
            } else if (msg.match(/^fix:\d+$/)) {
                const messageId = parseInt(msg.replace('fix:', ''));
                elm.ports.onFixMessage.send(messageId);
            } else {
                console.log('Unknown message for control:', msg);
            }

        });
    });


    elm.ports.sendFixResult.subscribe(function(m) {
        console.log('FixResult');
        console.log(m);
    });

};
