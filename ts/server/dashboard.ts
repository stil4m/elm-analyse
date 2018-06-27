import { ElmApp, Report, State } from '../domain';

function run(app: any, elm: ElmApp, expressWs: any) {
    var state: State = {
        status: 'initialising',
        idCount: 0,
        queue: [],
        messages: [],
        modules: []
    };

    var report: Report | null = null;

    function renderState() {
        return JSON.stringify(state);
    }

    app.ws('/state', function(ws: any) {
        ws.send(renderState());
        ws.on('message', function() {
            ws.send(renderState());
        });
        ws.on('error', function() {
            console.log('WARN: Socket not gracefully closed');
            console.log(ws.connection);
        });
    });

    elm.ports.sendReportValue.subscribe(function(newReport) {
        report = newReport;
    });

    elm.ports.sendState.subscribe(function(newState: State) {
        state = newState;
        expressWs.getWss().clients.forEach((x: any) => x.send(renderState()));
    });

    return {
        getState: function() {
            return state;
        },
        getReport: function() {
            return report;
        }
    };
}

export default { run };
