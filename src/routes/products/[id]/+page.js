/** @type {import('./$types').PageLoad} */

import axios from 'axios';

export async function load({ params }) {
    const res = await axios(`/products/${params.id}`);

	return { ...res.data };
}