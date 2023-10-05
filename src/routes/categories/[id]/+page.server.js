/** @type {import('./$types').PageServerLoad} */

import { ssFetch } from '$lib/fetch';

export async function load({ cookies, fetch, params }) {
    const authToken = cookies.get("auth_token");
    const res = await ssFetch(fetch, `categories/${params.id}`, {
        headers: { "Authorization": `Bearer ${authToken}` }
    });
    const data = await res.json();
    
    if (!data.payload.productCategoryId) return { ...data, authToken }

    const parentRes = await ssFetch(fetch, `categories/${data.payload.productCategoryId}`, {
        headers: { "Authorization": `Bearer ${authToken}` }
    });
    const parentData = await parentRes.json();
    data.payload.parentCategory = parentData.payload;

	return { ...data, authToken };
}