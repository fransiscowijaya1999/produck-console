import axios from 'axios';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	axios.defaults.baseURL = 'http://localhost:5000';
	axios.defaults.headers.post['Content-Type'] = 'application/json';
	
	const response = await resolve(event);
	return response;
}