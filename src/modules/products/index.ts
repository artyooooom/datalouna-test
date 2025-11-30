import { Elysia } from 'elysia';

import { Product } from './service';
import { ProductModel } from './model';

export const auth = new Elysia({ prefix: '/products' })
    .get(
        '/',
        async () => {
            return [
                {
                    name: '',
                    min_price: 0,
                    min_price_tradeable: 0,
                },
            ];
        },
        {
            response: {
                200: ProductModel.productsResponse,
            },
        },
    )
    .get(
        '/prices',
        async () => {
            const prices = await Product.getPrices()
            return prices;
        },
        {
            response: {
                200: ProductModel.productsResponse,
            },
        },
    );
