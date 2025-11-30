import { logger } from "../../utils/logger";
import { DEFAULT_TTL_SECONDS, PRICES_CACHE_KEY, redisClient } from "../../utils/redis";
import { skinPortService } from "../../utils/skinport";
import { ProductModel } from "./model";

export abstract class Product {
    static async getPrices(): Promise<ProductModel.productsResponse> {
        if (redisClient == null) {
            logger.error({
                method: this.getPrices.name,
                err: "Redis is not initialized",
            })

            throw new Error("Redis is not initialized")
        }

        let pricesResponse: ProductModel.productsResponse;

        const cachedPrices = await redisClient.get(PRICES_CACHE_KEY);

        if (cachedPrices != null) {
            try {
                const parsed = JSON.parse(cachedPrices) as ProductModel.productsResponse;
                return parsed;
            } catch (err) {
                logger.error({
                    method: this.getPrices.name,
                    err,
                    msg: 'Failed to parse cached prices from Redis',
                });
            }
        }

        const tradeableItems = await skinPortService.fetchItems()
        const nonTradeableItems = await skinPortService.fetchItems(false)

        pricesResponse = await skinPortService.combineTradeableAndNonTradeable(tradeableItems, nonTradeableItems)
        await redisClient.set(PRICES_CACHE_KEY, JSON.stringify(pricesResponse), {
            expiration: {
                type: "EX",
                value: DEFAULT_TTL_SECONDS
            }
        })

        return pricesResponse;
    }
}