"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function run(app, elm) {
    app.ws('/control', function (ws) {
        ws.on('message', function (msg) {
            if (msg === 'reload') {
                elm.ports.onReset.send(true);
            }
            else if (msg.match(/^fix:\d+$/)) {
                var messageId = parseInt(msg.replace('fix:', ''));
                elm.ports.onFixMessage.send(messageId);
            }
            else {
                console.log('Unknown message for control:', msg);
            }
        });
    });
}
exports.default = { run: run };
