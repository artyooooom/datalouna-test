import { sql } from '../../utils/db';
import { logger } from '../../utils/logger';
import { DEFAULT_TTL_SECONDS, PRICES_CACHE_KEY, redisClient } from '../../utils/redis';
import { skinPortService } from '../../utils/skinport';
import { ProductModel } from './model';

export abstract class Product {
    static async purchase(userId: number, productId: number): Promise<ProductModel.purchaseResponse> {
        try {
            const result = await sql.begin(async (tx) => {
                const [user] = await tx`
                    SELECT id, balance
                    FROM users
                    WHERE id = ${userId}
                    FOR UPDATE
                `;

                if (user == null) {
                    logger.error({
                        method: Product.purchase.name,
                        err: 'User not found',
                    });

                    throw new Error('User not found');
                }

                const [product] = await tx`
                    SELECT id, price
                    FROM products
                    WHERE id = ${productId}
                `;

                if (product == null) {
                    logger.error({
                        method: Product.purchase.name,
                        err: 'Product not found',
                    });

                    throw new Error('Product not found');
                }

                const price = Number(product.price);
                const balance = Number(user.balance);

                if (Number.isNaN(price) || Number.isNaN(balance)) {
                    logger.error({
                        method: Product.purchase.name,
                        err: 'Invalid numeric values in DB',
                    });

                    throw new Error('Invalid numeric values in DB');
                }

                if (balance < price) {
                    logger.error({
                        method: Product.purchase.name,
                        err: 'Insufficient balance',
                    });
                    throw new Error('Insufficient balance');
                }

                const [updatedUser] = await tx`
                    UPDATE users
                    SET balance = balance - ${price}, updated_at = NOW()
                    WHERE id = ${userId}
                    RETURNING balance
                `;

                // 4. Записываем покупку
                await tx`
                    INSERT INTO purchases (user_id, product_id, created_at, updated_at)
                    VALUES (${userId}, ${productId}, NOW(), NOW())
                `;

                return {
                    user_balance: Number(updatedUser.balance),
                } as ProductModel.purchaseResponse;
            });

            return result;
        } catch (err) {
            logger.error({
                method: this.purchase.name,
                err,
            });
            throw err;
        }
    }

    static async getProducts(): Promise<ProductModel.productsResponse> {
        const products = await sql<ProductModel.productsResponse>`SELECT * FROM products ORDER BY id;`;

        return products;
    }

    static async getPrices(): Promise<ProductModel.pricesResponse> {
        if (redisClient == null) {
            logger.error({
                method: this.getPrices.name,
                err: 'Redis is not initialized',
            });

            throw new Error('Redis is not initialized');
        }

        let pricesResponse: ProductModel.pricesResponse;

        const cachedPrices = await redisClient.get(PRICES_CACHE_KEY);

        if (cachedPrices != null) {
            try {
                const parsed = JSON.parse(cachedPrices) as ProductModel.pricesResponse;
                return parsed;
            } catch (err) {
                logger.error({
                    method: this.getPrices.name,
                    err,
                    msg: 'Failed to parse cached prices from Redis',
                });
            }
        }

        const tradeableItems = await skinPortService.fetchItems();
        const nonTradeableItems = await skinPortService.fetchItems(false);

        pricesResponse = await skinPortService.combineTradeableAndNonTradeable(tradeableItems, nonTradeableItems);
        await redisClient.set(PRICES_CACHE_KEY, JSON.stringify(pricesResponse), {
            expiration: {
                type: 'EX',
                value: DEFAULT_TTL_SECONDS,
            },
        });

        return pricesResponse;
    }

    static async getUserPurchases(userId: number): Promise<ProductModel.UserPurchasesResponse> {
        try {
            const rows = await sql<ProductModel.UserPurchaseItem[]>`
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
