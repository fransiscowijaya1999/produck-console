/** @type {import('./$types').PageLoad} */

import { ssFetch } from '$lib/fetch';

export async function load({ fetch, params }) {
    const productsRes = await ssFetch(fetch, "products");
    const categoriesRes = await ssFetch(fetch, "categories");
    const productsData = await productsRes.json();
    const categoriesData = await categoriesRes.json();

	return {
        productsData: productsData,
        categoriesData: categoriesData,
    };
}