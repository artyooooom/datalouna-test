import { Elysia } from 'elysia';
import { initializeRedisClient } from './utils/redis';
import { node } from '@elysiajs/node';
import { logger } from './utils/logger';
import { auth } from './modules/products';

const app = new Elysia({ adapter: node() }).use(auth).listen(3000);
initializeRedisClient();

logger.info(`Live on :3000`);
