import { sql } from '../../utils/db';
import { logger } from '../../utils/logger';
import { AuthModel } from './model';
import jwt from 'jsonwebtoken';

export abstract class Auth {
    static async SignIn(login: string, password: string): Promise<AuthModel.AuthResponse> {
        const [user] = await sql`
                SELECT id, login, password, balance
                FROM users
                WHERE login = ${login} AND password = ${password}
                LIMIT 1;
            `;

        if (user == null) {
            logger.error({
                method: Auth.SignIn.name,
                err: 'Invalid Credentials',
            });

            throw new Error('Invalid credentials');
        }

        const token = jwt.sign(
            {
                userId: user.id,
                login: user.login,
            },
            process.env.JWT_SECRET!,
            { expiresIn: '1h' },
        );

        return { token };
    }

    static async getUserPurchases(userId: number): Promise<AuthModel.UserPurchasesResponse> {
        try {
            const rows = await sql<AuthModel.UserPurchaseItem[]>`
                SELECT
                    p.id,
                    p.product_id,
                    pr.name AS product_name,
                    pr.price,
                    p.created_at
                FROM purchases p
                JOIN products pr ON pr.id = p.product_id
                WHERE p.user_id = ${userId}
                ORDER BY p.created_at DESC;
            `;

            return rows;
        } catch (err) {
            logger.error({
                method: this.getUserPurchases.name,
                err,
            });
            throw new Error('Failed to fetch user purchases');
        }
    }
}
