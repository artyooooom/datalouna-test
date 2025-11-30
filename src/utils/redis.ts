import { createClient, RedisClientType } from 'redis';
import { logger } from './logger';

export const RedisClientConfig: RedisClientType = createClient({
    url: process.env.REDIS_URL,
});

export async function initializeRedisClient(): Promise<RedisClientType> {
    if (redisClient) return redisClient;

    RedisClientConfig.on('error', (err: unknown) =>
        logger.error({
            method: initializeRedisClient.name,
            err,
        }),
    );
    RedisClientConfig.on('connect', () => logger.info('Redis connected'));

    await RedisClientConfig.connect();

    redisClient = RedisClientConfig;

    return RedisClientConfig
}

export const PRICES_CACHE_KEY = 'prices'
export const DEFAULT_TTL_SECONDS = 5 * 60;

export let redisClient: RedisClientType | null = null;