/** @type {import('./$types').PageServerLoad} */

import { ssFetch } from '$lib/fetch';

export async function load({ fetch, params, cookies }) {
    const authToken = cookies.get("auth_token");

    const fetchHeaders = { "Authorization": `Bearer ${authToken}` };

    const promises = await Promise.all([ssFetch(fetch, "products", { headers: fetchHeaders }), ssFetch(fetch, "categories", { headers: fetchHeaders })]);
    const productsRes = promises[0];
    const categoriesRes = promises[1];

    const productsData = await productsRes.json();
    const categoriesData = await categoriesRes.json();

	return {
        productsData: productsData,
        categoriesData: categoriesData,
        authToken
    };
}