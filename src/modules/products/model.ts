import { t } from 'elysia';

export namespace ProductModel {
    export const productsResponse = t.Array(
        t.Object({
            id: t.Number(),
            name: t.String(),
            min_price: t.String(), // using strings to prevent num inaccuracies
            min_price_tradeable: t.String(), // using strings to prevent num inaccuracies
        }),
    );

    export type productsResponse = typeof productsResponse.static;
}
