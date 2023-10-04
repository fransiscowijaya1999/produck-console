/** @type {import('./$types').PageServerLoad} */

import { ssFetch } from '$lib/fetch';

export async function load({ cookies, fetch }) {
    const authToken = cookies.get("auth_token");

    const res = await ssFetch(fetch, "products/negativeprice", {
        headers: { "Authorization": `Bearer ${authToken}`}
    });
    const result = await res.json();

	return { ...result, authToken };
}