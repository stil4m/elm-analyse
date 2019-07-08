const watch = require('node-watch');
import * as fileGatherer from '../util/file-gatherer';
import { ElmApp, FileChange } from '../domain';

function run(elmWorker: ElmApp) {
    const pack = require(process.cwd() + '/elm.json');
    watch(pack['source-directories'] || ['src'], { recursive: true }, function(evt: string, name: string) {
        const change: FileChange = { event: evt, file: name, content: null };
        if (fileGatherer.includedInFileSet(name)) {
            elmWorker.ports.fileWatch.send(change);
        }
    });
}

export default { run };
