/** @type {import('./$types').PageServerLoad} */

export async function load({ cookies }) {
    const authToken = cookies.get("auth_token");
	return { authToken };
}