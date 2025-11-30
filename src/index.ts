import 'dotenv/config';

import { Elysia } from 'elysia';
import { initializeRedisClient } from './utils/redis';
import { node } from '@elysiajs/node';
import { logger } from './utils/logger';
import { products } from './modules/products';
import { auth } from './modules/auth';
import { openapi } from '@elysiajs/openapi';

const app = new Elysia({ adapter: node() }).use(openapi()).use([products, auth]).listen(3000);
initializeRedisClient();

logger.info(`Live on :3000`);
