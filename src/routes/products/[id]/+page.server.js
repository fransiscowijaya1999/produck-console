/** @type {import('./$types').PageServerLoad} */

import { ssFetch } from '$lib/fetch';

export async function load({ fetch, params, cookies }) {
    const authToken = cookies.get("auth_token");

    const res = await ssFetch(fetch, `products/${params.id}`, {
        headers: { "Authorization": `Bearer ${authToken}` }
    });
    const data = await res.json();

	return { ...data, authToken };
}