/** @type {import('./$types').PageLoad} */

import axios from 'axios';

export async function load({ params }) {
    const productsRes = await axios(`/products`);
    const categoriesRes = await axios(`/categories?parentId=null`);

	return {
        productsRes: productsRes.data,
        categoriesRes: categoriesRes.data,
    };
}