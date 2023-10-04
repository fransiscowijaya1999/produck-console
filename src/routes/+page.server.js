/** @type {import('./$types').PageServerLoad} */

import { ssFetch } from '$lib/fetch';

export async function load({ cookies, fetch }) {
    const authToken = cookies.get("auth_token");

    const replenishmentRes = await ssFetch(fetch, "categories/replenishment", {
        headers: { "Authorization": `Bearer ${authToken}`}
    });
    const { pagination: { count: replenishmentCount } } = await replenishmentRes.json();

    const priceCorrectionRes = await ssFetch(fetch, "products/negativeprice", {
        headers: { "Authorization": `Bearer ${authToken}`}
    });
    const { pagination: { count: priceCorrectionCount } } = await priceCorrectionRes.json();

	return { priceCorrectionCount, replenishmentCount, authToken };
}