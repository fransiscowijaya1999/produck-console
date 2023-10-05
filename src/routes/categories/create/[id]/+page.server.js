/** @type {import('./$types').PageServerLoad} */

import { ssFetch } from '$lib/fetch';

export async function load({ cookies, fetch, params }) {
    const authToken = cookies.get("auth_token");

    if (params.id == "null") return { authToken };
    const res = await ssFetch(fetch, `categories/${params.id}`, {
        headers: { "Authorization": `Bearer ${authToken}`}
    });
    const data = await res.json();

	return { ...data, authToken };
}