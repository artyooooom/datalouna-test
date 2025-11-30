import { Elysia } from 'elysia';
import { AuthModel } from './model';
import { Auth } from './service';
import { AuthGuard } from '../../plugins/auth-guard';

export const auth = new Elysia({ prefix: '/auth' }).post(
    '/',
    async ({ body: { login, password } }) => {
        const token = await Auth.SignIn(login, password);

        return token;
    },
    {
        body: AuthModel.AuthPayload,
        response: AuthModel.AuthResponse,
    },
);
