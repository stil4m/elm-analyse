import { Config, ElmApp } from '../domain';

export function setup(app: ElmApp, config: Config) {
    if (config.format === 'human') {
        app.ports.log.subscribe((data: string[]) => {
            console.log(data[0] + ':', data[1]);
        });
    }
}
