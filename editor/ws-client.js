const WebSocket = require('ws');

module.exports = function(url, es) {
    var ws = new WebSocket(url);
    const autoReconnectInterval = 5000;
    var number = 0;

    function bind(ws, events, reconnect) {
        ws.on('open', () => {
            if (events.onOpen) {
                events.onOpen();
            }
        });
        ws.on('message', (data, flags) => {
            number++;
            if (events.onMessage) {
                events.onMessage(data, flags, number);
            }
        });
        ws.on('close', e => {
            switch (e) {
                case 1000:
                    break;
                default:
                    reconnect(e);
                    break;
            }
            if (events.onClose) {
                events.onClose(e);
            }
        });
        ws.on('error', e => {
            switch (e.code) {
                case 'ECONNREFUSED':
                    reconnect(e);
                    break;
                default:
                    if (events.onError) {
                        events.onError(e);
                    }
                    break;
            }
        });
    }
    const reconnect = function() {
        ws.removeAllListeners();
        setTimeout(function() {
            if (es.onReconnect) {
                es.onReconnect();
            }
            ws = new WebSocket(url);
            bind(ws, es, reconnect);
        }, autoReconnectInterval);
    };

    bind(ws, es, reconnect);
};
