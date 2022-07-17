import NodeCache from 'node-cache';
export const createCache = (stdTTL= 600)=>{
    return new NodeCache({ stdTTL: stdTTL });
}
export const getCacheValue = function<T>(key: string){
    const cache = createCache();
    return cache.get<T>(key);
}

export const setCacheValue = (key: string, value: any)=>{
    const cache = createCache();
    return cache.set(key, value);
}
