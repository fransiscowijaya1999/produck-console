/** @type {import('../$types').PageServerLoad} */

import { ssFetch } from '$lib/fetch';

export async function load({ cookies, fetch, params }) {
    const authToken = cookies.get("auth_token");
    const res = await ssFetch(fetch, `pos/${params.id}`, {
        headers: { "Authorization": `Bearer ${authToken}`}
    });
    const data = await res.json();

	return { ...data, authToken };
}