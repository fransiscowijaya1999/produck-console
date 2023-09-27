/** @type {import('./$types').PageLoad} */

import { ssFetch } from '$lib/fetch';

export async function load({ fetch, params }) {
    const res = await ssFetch(fetch, `possessions/${params.id}`);
    const data = await res.json();

	return { ...data };
}