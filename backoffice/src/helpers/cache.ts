import { createClient } from 'redis';

export const createCacheClient = async (url = process.env.CACHE_REDIS) => {
    const client = createClient({ url });
    await client.connect();
}
export const disposeCacheClient = async (client: any) => await client.close()

export const getCacheValue = async (key: string, providedClient: any = null) => {
    try {
        const client = providedClient != null ? providedClient : await createCacheClient();
        return await client.get(key);
    } catch (error) {
        return null
    }
}

export const setCacheValue = async (key: string, value: any, providedClient: any = null) => {
    try {
        const client = providedClient != null ? providedClient : await createCacheClient();
        return await client.set(key, value);
    } catch (error) {
        return false
    }
}