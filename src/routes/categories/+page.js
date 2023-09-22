/** @type {import('./$types').PageLoad} */

export async function load({ fetch, params, url }) {
    const res = await fetch(`http://localhost:5000/categories?keyword=${url.searchParams.keyword}`);
    const data = await res.json();

	return {
        ...data
    };
}