/** @type {import('./$types').PageServerLoad} */

import { ssFetch } from '$lib/fetch';

export async function load({ cookies, fetch }) {
    const authToken = cookies.get("auth_token");

    const res = await ssFetch(fetch, "dashboard", {
        headers: { "Authorization": `Bearer ${authToken}`}
    });
    const { payload: { replenishmentCount, productPriceCount, customerPriceCount } } = await res.json();

	return { productPriceCount, replenishmentCount, customerPriceCount, authToken };
}