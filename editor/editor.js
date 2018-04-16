/*eslint no-undef: 0*/
// const Editor = this.Elm;
const WebSocketClient = require('./ws-client');
const Elm = require('./elm');
const Editor = Elm.Editor;

module.exports = function() {
    var ws = null;

    var listenerId = 0;
    const listeners = {};

    const app = Editor.worker({
        serverHost: 'localhost',
        serverPort: 3000
    });

    const onMessage = function incoming(data) {
        try {
            const parsed = JSON.parse(data);
            app.ports.stateListener.send(parsed);
        } catch (e) {
            console.log('Parse state failed');
        }
    };

    app.ports.editorMessages.subscribe(function(x) {
        Object.keys(listeners).forEach(k => {
            listeners[k](x);
        });
    });
    return {
        start: function() {
            if (ws) {
                console.log('Already started');
                return;
            }
            ws = WebSocketClient('ws://localhost:3000/state', {
                onMessage: onMessage,
                onReconnect: () => console.log('Elm editor: On reconnect'),
                onOpen: () => console.log('Elm editor: On open')
            });
        },
        onState: function(cb) {
            const identifier = listenerId++;
            listeners[identifier] = cb;
            return function cancel() {
                delete listeners[identifier];
            };
        },
        stop: function() {
            ws.close();
            ws = null;
        }
    };
};
// //
// const editor = module.exports();
// const cancel = editor.onState(function(s) {
//     console.log('On Client');
//     console.log(s);
// });
// console.log('Cancel:', cancel);
// //cancel();
// editor.start();
