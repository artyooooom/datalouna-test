import { Elysia } from 'elysia';

import { Product } from './service';
import { ProductModel } from './model';

export const auth = new Elysia({ prefix: '/products' })
    .get(
        '/',
        async () => {
            return [
                {
                    id: 3,
                    name: '',
                    min_price: '',
                    min_price_tradeable: '',
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

            return [
                {
                    id: 3,
                    name: '',
                    min_price: '',
                    min_price_tradeable: '',
                },
            ];
        },
        {
            response: {
                200: ProductModel.productsResponse,
            },
        },
    );
