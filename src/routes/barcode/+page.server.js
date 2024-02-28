/** @type {import('./$types').PageServerLoad} */

import { ssFetch } from '$lib/fetch';

export async function load({ fetch, cookies }) {
    const authToken = cookies.get("auth_token");

    const fetchHeaders = { "Authorization": `Bearer ${authToken}` };

    const productsRes = await ssFetch(fetch, "products?emptyBarcode=true", { headers: fetchHeaders });

    const products = await productsRes.json();

	return {
        products,
        authToken
    };
}