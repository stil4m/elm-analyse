import { ElmApp, Config } from './domain';

import * as DependencyFiles from './ports/dependency-files';
import * as RawDependencies from './ports/raw-dependencies';
import * as HttpDocumentation from './ports/http-documentation';
import * as FileLoader from './ports/file-loader';
import * as Context from './ports/context';

export function setup(app: ElmApp, config: Config, directory: string): void {
    HttpDocumentation.setup(app);
    RawDependencies.setup(app);
    DependencyFiles.setup(app, directory);
    FileLoader.setup(app, config, directory);
    Context.setup(app, directory);
}
