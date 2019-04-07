import WebSocket from 'ws';

export interface EventListener {
    onOpen?: (() => void);
    onReconnect?: (() => void);
    onError?: ((err: any) => void);
    onClose?: ((err: any) => void);
    onMessage?: ((data: string, index: number) => void);
}

export interface Client {
    stop: (() => void);
}

export function connect(url: string, es: EventListener): Client {
    var ws: WebSocket = new WebSocket(url);
    const autoReconnectInterval = 5000;
    var number = 0;

    function bind(ws: WebSocket, events: EventListener, reconnect: ((err: any) => void)) {
        ws.on('open', () => {
            if (events.onOpen) {
                events.onOpen();
            }
        });
        ws.on('message', (data: string) => {
            number++;
            if (events.onMessage) {
                events.onMessage(data, number);
            }
        });
        ws.on('close', (e: any) => {
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
        ws.on('error', (e: any) => {
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
    const reconnect = function(): void {
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
    return {
        stop: () => {
            ws.close();
        }
    };
}
