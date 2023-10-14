import { ssFetch } from '$lib/fetch';
import { fail, redirect } from '@sveltejs/kit';

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request, cookies, fetch }) => {
		const form = await request.formData();
        const user = {
            username: form.get("username"),
            password: form.get("password")
        };

        const res = await ssFetch(fetch, "login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user)
        });

        const result = await res.json();
        if (result.isError) return fail(400, result.responseException.exceptionMessage );
        const authToken = result.result;

        cookies.set("auth_token", authToken, { secure: false, path: "/" });
        throw redirect(303, "/");
	}
};