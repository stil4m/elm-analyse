import { ElmApp } from '../domain';

function run(app: any, elm: ElmApp) {
    app.ws('/control', function(ws: any) {
        ws.on('message', function(msg: string) {
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
}

export default { run };
