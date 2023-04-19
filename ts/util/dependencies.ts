import axios from 'axios';
import * as cache from './cache';

export type Registry = RegistryItem[];

export interface RegistryItem {
    name: string;
    summary: string;
    license: string;
    versions: string[];
}
const fetchDependencies = function(cb: (jsonValue: Registry | null) => void) {
    axios.get<Registry>('http://package.elm-lang.org/search.json')
        .then(response => cb(response.data))
        .catch(() => cb(null))
};

const updatePackageDependencyInfo = function(cb: (jsonValue: any) => void, defaultValue: any) {
    fetchDependencies(function(result: any) {
        console.log('Fetched dependencies');
        if (result == null) {
            cb(defaultValue);
            return;
        }
        cache.storePackageDependencyInfo({
            timestamp: new Date().getTime(),
            data: result
        });
        cb(result);
    });
};

const isOutdated = function(timestamp: number): boolean {
    const barrier = new Date().getTime() - 1000 * 60 * 60;
    return timestamp < barrier;
};

const getDependencies = function(cb: (jsonValue: any) => void) {
    cache.readPackageDependencyInfo(function(err: unknown, cached?: { timestamp: number; data: any }) {
        if (err || cached == null) {
            console.log('Fetching package information from package.elm-lang.org.');
            updatePackageDependencyInfo(cb, null);
        } else {
            if (isOutdated(cached.timestamp)) {
                console.log('Cached package information invalidated. Fetching new data from package.elm-lang.org');
                updatePackageDependencyInfo(cb, cached.data);
            } else {
                cb(cached.data);
            }
        }
    });
};

export { getDependencies };
