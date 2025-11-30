import { Elysia } from 'elysia';
import { AuthModel } from './model';
import { Auth } from './service';
import { AuthGuard } from '../../plugins/auth-guard';

export const auth = new Elysia({ prefix: '/auth' })
    .post(
        '/',
        async ({ body: { login, password } }) => {
            const token = await Auth.SignIn(login, password);

            return token;
        },
        {
            body: AuthModel.AuthPayload,
            response: AuthModel.AuthResponse,
        },
    )
    .use(AuthGuard)
    .get(
        '/me',
        async ({ user }) => {
            const purchases = await Auth.getUserPurchases(user.userId);
            return purchases;
        },
        {
            response: AuthModel.UserPurchasesResponse,
        },
    );
