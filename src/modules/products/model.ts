import { t } from 'elysia';

export namespace ProductModel {
    export const pricesItemResponse = t.Object({
        name: t.String(),
        min_price: t.Optional(t.Number()),
        min_price_tradeable: t.Optional(t.Number()),
    });

    export type pricesItemResponse = typeof pricesItemResponse.static;

    export const pricesResponse = t.Array(pricesItemResponse);

    export type pricesResponse = typeof pricesResponse.static;

    export const productItemResponse = t.Object({
        id: t.Number(),
        name: t.String(),
        price: t.String(),
    });

    export type productItemResponse = typeof productItemResponse.static;

    export const productsResponse = t.Array(productItemResponse);

    export type productsResponse = typeof productsResponse.static;

    export const purchaseResponse = t.Object({
        user_balance: t.Number(),
    });

    export type purchaseResponse = typeof purchaseResponse.static;

    export const UserPurchaseItem = t.Object({
        id: t.Number(),
        product_id: t.Number(),
        product_name: t.String(),
        price: t.String(),
        created_at: t.Date(),
    });

    export type UserPurchaseItem = typeof UserPurchaseItem.static;

    export const UserPurchasesResponse = t.Array(UserPurchaseItem);
    export type UserPurchasesResponse = typeof UserPurchasesResponse.static;
}
