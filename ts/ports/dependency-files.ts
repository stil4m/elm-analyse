import * as fileGatherer from '../util/file-gatherer';
import { ElmApp, DependencyPointer, FileContent } from '../domain';
import { FileReader } from '../fileReader';

function setup(app: ElmApp, directory: string, fileReader: FileReader) {
    app.ports.loadDependencyFiles.subscribe((dependency: DependencyPointer) => {
        const result = fileGatherer.getDependencyFiles(directory, dependency);

        const promises: Promise<FileContent>[] = result.map(
            fileName => new Promise(accept => fileReader.readFile(directory, fileName, accept))
        );
        Promise.all(promises).then(
            targets =>
                app.ports.onDependencyFiles.send({
                    dependency: dependency,
                    files: targets
                }),
            e => {
                console.log('Error when loading files for loadDependencyFiles:', dependency);
                console.log(e);
            }
        );
    });
}

export { setup };
