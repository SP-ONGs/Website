import { apiRequest } from "./api";

export async function getCsrfToken() {
	const data = await apiRequest("/api/auth/csrf");

	if (!data?.token) {
		throw new Error("Could not obtain CSRF token.");
	}

	return data.token;
}

export async function apiMutation(path, method, body) {
	const csrfToken = await getCsrfToken();

	return apiRequest(path, {
		method,
		headers: {
			"Content-Type": "application/json",
			"X-CSRF-TOKEN": csrfToken
		},
		...(body === undefined ? {} : { body: JSON.stringify(body) })
	});
}
