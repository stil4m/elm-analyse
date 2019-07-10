import { ElmApp, Config } from './domain';

import * as DependencyFiles from './ports/dependency-files';
import * as RawDependencies from './ports/raw-dependencies';
import * as HttpDocumentation from './ports/http-documentation';
import * as FileLoader from './ports/file-loader';
import * as Context from './ports/context';
import { LocalCache } from './util/cache';
import { FileReader } from './fileReader';

export function setup(app: ElmApp, config: Config, directory: string): void {
    const localCache = new LocalCache(directory);
    const fileReader = new FileReader(localCache);

    HttpDocumentation.setup(app);
    RawDependencies.setup(app);
    DependencyFiles.setup(app, directory, fileReader);
    FileLoader.setup(app, config, directory, localCache, fileReader);
    Context.setup(app, directory);
}
