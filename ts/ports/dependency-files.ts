import * as fileGatherer from '../util/file-gatherer';
import { ElmApp } from '../domain';
import * as fileReader from '../fileReader';

function setup(app: ElmApp, directory: string) {
    app.ports.loadDependencyFiles.subscribe((dep: string[]) => {
        var depName = dep[0];
        var version = dep[1];
        var result = fileGatherer.getDependencyFiles(
            directory,
            depName,
            version
        );

        const promises = result.map(
            fileName =>
                new Promise(accept =>
                    fileReader.readFile(directory, fileName, accept)
                )
        );
        Promise.all(promises).then(
            targets =>
                //TODO
                app.ports.onDependencyFiles.send([depName, version, targets]),
            e => {
                console.log(
                    'Error when loading files for loadDependencyFiles:',
                    dep
                );
                console.log(e);
            }
        );
    });
}

export { setup };
