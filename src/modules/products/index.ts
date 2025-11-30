import { Elysia } from 'elysia';

import { Product } from './service';
import { ProductModel } from './model';
import { AuthGuard, JwtUserPayload } from '../../plugins/auth-guard';

export const products = new Elysia({ prefix: '/products' })
    .get(
        '/',
        async () => {
            const products = await Product.getProducts();
            return products;
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
            const prices = await Product.getPrices();
            return prices;
        },
        {
            response: {
                200: ProductModel.pricesResponse,
            },
        },
    )
    .use(AuthGuard)
    .get(
        '/me',
        async ({ user }) => {
            const purchases = await Product.getUserPurchases(user.userId);
            return purchases;
        },
        {
            response: ProductModel.UserPurchasesResponse,
        },
    )
    .post(
        '/:id',
        async ({ user, params: { id } }) => {
            const updatedUserBalance = await Product.purchase(user.userId, Number(id));
            return updatedUserBalance;
        },
        {
            response: {
                200: ProductModel.purchaseResponse,
            },
        },
    );
