const watch = require('node-watch');
import * as fileGatherer from '../util/file-gatherer';
import { ElmApp } from '../domain';

function run(elmWorker: ElmApp) {
    const pack = require(process.cwd() + '/elm-package.json');
    watch(pack['source-directories'], { recursive: true }, function(
        evt: string,
        name: string
    ) {
        const change = [evt, name];
        if (fileGatherer.includedInFileSet(name)) {
            elmWorker.ports.fileWatch.send(change);
        }
    });
}

export default { run };
