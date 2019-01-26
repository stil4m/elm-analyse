import * as path from 'path';
import { Config, Info, ElmApp, Report, Message } from '../domain';
import _ from 'lodash';
import worker from './worker';
import watcher from './watcher';
import {
    createConnection,
    TextDocuments,
    TextDocument,
    Diagnostic,
    DiagnosticSeverity,
    ProposedFeatures,
    InitializeParams
} from 'vscode-languageserver';

function start(config: Config, info: Info, project: {}) {
    let connection = createConnection(ProposedFeatures.all);
    worker.run(config, project, function(elm: ElmApp) {
        let report: Report | null = null;
        let documents: TextDocuments = new TextDocuments();

        watcher.run(elm);
        documents.listen(connection);
        connection.listen();

        connection.onInitialize((params: InitializeParams) => ({
            capabilities: {
                textDocumentSync: {
                    openClose: true,
                    willSave: true
                },
                textDocument: {
                    publishDiagnostics: {
                        relatedInformation: true
                    }
                }
            }
        }));
        // The content of a text document has changed. This event is emitted
        // when the text document first opened or when its content has changed.
        documents.onDidChangeContent(change => {
            validateTextDocument(change.document);
        });
        documents.onDidSave(change => {
            validateTextDocument(change.document);
        });
        function publishDiagnostics(messages: Message[], uri: string) {
            const messagesForFile = messages.filter(m =>
                // Windows paths have a forward slash in the `message.file`, which won't
                // match with the end of the file URI we have from the language server event,
                // so this replaces backslashes before matching to get consistent behavior
                uri.endsWith(m.file.replace('\\', '/'))
            );

            let diagnostics: Diagnostic[] = messagesForFile.map(messageToDiagnostic);
            connection.sendDiagnostics({ uri: uri, diagnostics });
        }
        async function waitForReport(): Promise<Report> {
            return report ? Promise.resolve(report) : sleep(500).then(waitForReport);
        }

        async function validateTextDocument(textDocument: TextDocument): Promise<void> {
            const report = await waitForReport();
            publishDiagnostics(report.messages, textDocument.uri);
        }

        elm.ports.sendReportValue.subscribe(function(newReport) {
            report = newReport;

            // When publishing diagnostics it looks like you have to publish
            // for one URI at a time, so this groups all of the messages for
            // each file and sends them as a batch
            _.forEach(_.groupBy(report.messages, 'file'), (messages, file) => 
                publishDiagnostics(messages, fileUrl(file))
            );
        });
    });
}

function messageToDiagnostic(message: Message): Diagnostic {
    let [lineStart, colStart, lineEnd, colEnd] = message.data.properties.range;
    const range = {
        start: { line: lineStart - 1, character: colStart - 1 },
        end: { line: lineEnd - 1, character: colEnd - 1 }
    };
    return {
        severity: DiagnosticSeverity.Warning,
        range: range,
        // Clean up the error message a bit, removing the end of the line, e.g.
        // "Record has only one field. Use the field's type or introduce a Type. At ((14,5),(14,20))"
        message:
            message.data.description.split(/at .+$/i)[0] +
            '\n' +
            `See https://stil4m.github.io/elm-analyse/#/messages/${message.type}`,
        source: 'elm-analyse'
    };
}

function fileUrl(str: string) {
    if (typeof str !== 'string') {
        throw new Error('Expected a string');
    }
    var pathName = path.resolve(str).replace(/\\/g, '/');
    // Windows drive letter must be prefixed with a slash
    if (pathName[0] !== '/') {
        pathName = '/' + pathName;
    }
    return encodeURI('file://' + pathName);
}

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default { start };
