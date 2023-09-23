/** @type {import('./$types').PageLoad} */

import { ssFetch } from '$lib/fetch';

export async function load({ fetch, params }) {
    const res = await ssFetch(fetch, `categories/${params.id}`);
    const data = await res.json();
    
    if (!data.payload.productCategoryId) return { ...data }

    const parentRes = await ssFetch(fetch, `categories/${data.payload.productCategoryId}`);
    const parentData = await parentRes.json();
    data.payload.parentCategory = parentData.payload;

	return { ...data };
}