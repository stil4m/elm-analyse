/*eslint no-undef: 0*/
// const Editor = this.Elm;
import * as WebSocketClient from './ws-client';
import { EditorData, EditorElmApp } from '../domain';

const Elm = require('./elm');
const Editor = Elm.Editor;

type EditorDataCb = ((data: EditorData) => void);
interface Listeners {
    [key: string]: EditorDataCb;
}

interface Editor {
    onState: ((cb: EditorDataCb) => void);
    start: (() => void);
    stop: (() => void);
}
module.exports = function setup(port: number): Editor {
    let ws: WebSocketClient.Client | null;

    var listenerId = 0;
    const listeners: Listeners = {};

    const app: EditorElmApp = Editor.worker({
        serverHost: 'localhost',
        serverPort: 3000
    });

    const eventListener: WebSocketClient.EventListener = {
        onMessage: function incoming(data) {
            try {
                const parsed = JSON.parse(data);
                app.ports.stateListener.send(parsed);
            } catch (e) {
                console.log('Parse state failed');
            }
        },
        onReconnect: () => console.log('Elm editor: On reconnect'),
        onOpen: () => console.log('Elm editor: On open')
    };

    app.ports.editorMessages.subscribe(function(x: EditorData) {
        Object.keys(listeners).forEach((k: string) => {
            listeners[k](x);
        });
    });
    return {
        start: function() {
            if (ws) {
                console.log('Already started');
                return;
            }
            ws = WebSocketClient.connect(
                'ws://localhost:' + port + '/state',
                eventListener
                //   {
                //     onMessage: onMessage,
                //     onReconnect: () => console.log('Elm editor: On reconnect'),
                //     onOpen: () => console.log('Elm editor: On open')
                // }
            );
        },
        onState: function(cb) {
            const identifier = listenerId++;
            listeners[identifier] = cb;
            return function cancel() {
                delete listeners[identifier];
            };
        },
        stop: function() {
            if (ws != null) {
                ws.stop();
            }
            ws = null;
        }
    };
};
