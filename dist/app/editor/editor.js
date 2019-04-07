"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
/*eslint no-undef: 0*/
// const Editor = this.Elm;
var WebSocketClient = __importStar(require("./ws-client"));
var Elm = require('./elm');
var Editor = Elm.Editor;
module.exports = function setup(port) {
    var ws;
    var listenerId = 0;
    var listeners = {};
    var app = Editor.worker({
        serverHost: 'localhost',
        serverPort: 3000
    });
    var eventListener = {
        onMessage: function incoming(data) {
            try {
                var parsed = JSON.parse(data);
                app.ports.stateListener.send(parsed);
            }
            catch (e) {
                console.log('Parse state failed');
            }
        },
        onReconnect: function () { return console.log('Elm editor: On reconnect'); },
        onOpen: function () { return console.log('Elm editor: On open'); }
    };
    app.ports.editorMessages.subscribe(function (x) {
        Object.keys(listeners).forEach(function (k) {
            listeners[k](x);
        });
    });
    return {
        start: function () {
            if (ws) {
                console.log('Already started');
                return;
            }
            ws = WebSocketClient.connect('ws://localhost:' + port + '/state', eventListener
            //   {
            //     onMessage: onMessage,
            //     onReconnect: () => console.log('Elm editor: On reconnect'),
            //     onOpen: () => console.log('Elm editor: On open')
            // }
            );
        },
        onState: function (cb) {
            var identifier = listenerId++;
            listeners[identifier] = cb;
            return function cancel() {
                delete listeners[identifier];
            };
        },
        stop: function () {
            if (ws != null) {
                ws.stop();
            }
            ws = null;
        }
    };
};
