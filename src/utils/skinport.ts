import axios from 'axios';
import { ProductModel } from '../modules/products/model';

export type SkinPortResponseItem = {
    market_hash_name: string;
    min_price: number | null;
};

export class SkinPort {
    constructor() {}

    async fetchItems(tradeable: boolean = true): Promise<SkinPortResponseItem[]> {
        const res = await axios.get<SkinPortResponseItem[]>(`https://api.skinport.com/v1/items?tradable=${tradeable}`);

        return res.data;
    }

    async combineTradeableAndNonTradeable(tradeableItems: SkinPortResponseItem[], nonTradeableItems: SkinPortResponseItem[]): Promise<ProductModel.pricesResponse> {
        const map = new Map<string, ProductModel.pricesItemResponse>();

        for (const item of tradeableItems) {
            const existing = map.get(item.market_hash_name) ?? {
                name: item.market_hash_name,
            };

            if (item.min_price != null) {
                existing.min_price_tradeable = item.min_price;
            }

            map.set(item.market_hash_name, existing);
        }

        for (const item of nonTradeableItems) {
            const existing = map.get(item.market_hash_name) ?? {
                name: item.market_hash_name,
            };

            if (item.min_price != null) {
                existing.min_price = item.min_price;
            }

            map.set(item.market_hash_name, existing);
        }

        return Array.from(map.values());
    }
}

export const skinPortService = new SkinPort();
