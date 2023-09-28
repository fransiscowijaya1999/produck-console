import { redirect } from '@sveltejs/kit';

const unprotectedRoutes = ["/login"];

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	const authToken = event.cookies.get("auth_token");

	if (!authToken && !unprotectedRoutes.includes(event.url.pathname)) throw redirect(303, "/login");
	if (authToken && unprotectedRoutes.includes(event.url.pathname)) throw redirect(303, "/");

	const response = await resolve(event);
	return response;
}