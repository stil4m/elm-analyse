import { Config, ElmApp, LogMessage } from '../domain';
import * as readline from 'readline';

export function setup(app: ElmApp, config: Config) {
    if (config.format === 'human') {
        app.ports.log.subscribe((data: LogMessage) => {
            if (data.level === 'INFO') {
                printInPlace(data.level + ':' + data.message);
            } else {
                console.log(data.level, data.message);
            }
        });
    }
}

export function printInPlace(str: string) {
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(str);
}
