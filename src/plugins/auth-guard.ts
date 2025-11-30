import { Elysia, t } from 'elysia';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';

const JWT_SECRET = process.env.JWT_SECRET!;

export interface JwtUserPayload {
    userId: number;
    login: string;
}

export const AuthGuard = (app: Elysia) =>
    app.derive<{ user: JwtUserPayload }>(({ headers }) => {
        const authHeader = headers.authorization || headers.Authorization;
        if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
            throw new Error('Unauthorized');
        }

        const token = authHeader.slice('Bearer '.length);

        try {
            const payload = jwt.verify(token, JWT_SECRET) as { userId: number; login: string };
            return { user: payload };
        } catch {
            logger.error({
                method: 'authGuard',
                err: 'Invalid token',
            });

            throw new Error('Invalid token');
        }
    });
