/** @type {import('./$types').PageLoad} */

import { ssFetch } from '$lib/fetch';

export async function load({ fetch, params }) {
    if (params.id == "null") return;
    const res = await ssFetch(fetch, `categories/${params.id}`);
    const data = await res.json();

	return { ...data };
}