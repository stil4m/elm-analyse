import { Config, ElmApp, LogLevel, LogMessage } from '../domain';

export function setup(app: ElmApp, config: Config) {
    if (config.format === 'human') {
        app.ports.log.subscribe((data: LogMessage) => {
            if (LogLevel[data.level] >= config.logLevel) {
                console.log(data.level + ':', data.message);
            }
        });
    }
}
