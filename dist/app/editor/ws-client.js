"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ws_1 = __importDefault(require("ws"));
function connect(url, es) {
    var ws = new ws_1.default(url);
    var autoReconnectInterval = 5000;
    var number = 0;
    function bind(ws, events, reconnect) {
        ws.on('open', function () {
            if (events.onOpen) {
                events.onOpen();
            }
        });
        ws.on('message', function (data) {
            number++;
            if (events.onMessage) {
                events.onMessage(data, number);
            }
        });
        ws.on('close', function (e) {
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
        ws.on('error', function (e) {
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
    var reconnect = function () {
        ws.removeAllListeners();
        setTimeout(function () {
            if (es.onReconnect) {
                es.onReconnect();
            }
            ws = new ws_1.default(url);
            bind(ws, es, reconnect);
        }, autoReconnectInterval);
    };
    bind(ws, es, reconnect);
    return {
        stop: function () {
            ws.close();
        }
    };
}
exports.connect = connect;
