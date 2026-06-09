import { AsyncLocalStorage } from 'async_hooks';

export class RequestContext {
    static storage = new AsyncLocalStorage<Map<string, any>>();

    static getDbName() {
        return this.storage.getStore()?.get('dbName');
    }
}