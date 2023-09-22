/** @type {import('./$types').PageLoad} */

import { ssFetch } from '$lib/fetch';

export async function load({ fetch, params }) {
    const res = await ssFetch(fetch, "categories");
    const data = await res.json();

	return { ...data };
}