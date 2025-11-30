import { t } from 'elysia';

export namespace ProductModel {
	export const productItemResponse = t.Object({
		name: t.String(),
		min_price: t.Optional(t.Number()),
		min_price_tradeable: t.Optional(t.Number()),
	})

	export type productItemResponse = typeof productItemResponse.static;

	export const productsResponse = t.Array(productItemResponse);

	export type productsResponse = typeof productsResponse.static;
}
