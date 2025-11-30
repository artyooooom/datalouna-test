import { t } from 'elysia';

export namespace AuthModel {
    export const AuthPayload = t.Object({
        login: t.String(),
        password: t.String(),
    });

    export type AuthPayload = typeof AuthPayload.static;

    export const AuthResponse = t.Object({
        token: t.String(),
    });

    export type AuthResponse = typeof AuthResponse.static;

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
