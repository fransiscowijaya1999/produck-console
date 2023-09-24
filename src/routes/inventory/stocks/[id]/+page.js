/** @type {import('./$types').PageLoad} */

import { ssFetch } from '$lib/fetch';

export async function load({ fetch, params }) {
    let locationId = params.id;
    if (params.id == "null") return { payload: { id: 0, name: "root", isRootLocation: true } };
    const res = await ssFetch(fetch, `locations/${locationId}`);
    const data = await res.json();

	return { ...data };
}