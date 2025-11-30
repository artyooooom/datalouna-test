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
}
