/** @type {import('./$types').PageLoad} */

import { ssFetch } from '$lib/fetch';

export async function load({ cookies, fetch, params }) {
    const authToken = cookies.get("auth_token");

    let locationId = params.id;
    if (params.id == "null") return { payload: { id: 0, name: "root", isRootLocation: true }, authToken };
    const res = await ssFetch(fetch, `locations/${locationId}`, {
        headers: { "Authorization": `Bearer ${authToken}`}
    });
    const data = await res.json();

	return { ...data, authToken };
}