import NodeCache from 'node-cache';
export const createCache = (stdTTL= 0, checkPeriod = 600)=>{
    return new NodeCache({ stdTTL: stdTTL, checkperiod: checkPeriod });
}
export const getCacheValue = function<T>(key: string){
    const cache = createCache();
    return cache.get<T>(key);
}

export const setCacheValue = (key: string, value: any, stdTTL= 0, checkPeriod = 600)=>{
    const cache = createCache(stdTTL, checkPeriod);    
    return cache.set(key, value, stdTTL);
}

export const deleteCacheValue = (key: string)=>{
    const cache = createCache();
    return cache.del(key);
}
