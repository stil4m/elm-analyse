import { Config, ElmApp, LogMessage } from '../domain';

export function setup(app: ElmApp, config: Config) {
    if (config.format === 'human') {
        app.ports.log.subscribe((data: LogMessage) => {
            console.log(data.level + ':', data.message);
        });
    }
}
