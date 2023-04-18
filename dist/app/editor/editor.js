"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
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
