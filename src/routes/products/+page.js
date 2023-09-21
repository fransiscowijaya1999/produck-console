/** @type {import('./$types').PageLoad} */

import axios from 'axios';

export async function load({ params }) {
    const res = await axios(`/products`);
    console.log(res);

	return { ...res.data };
}