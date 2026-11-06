export const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

async function parseResponse(response) {
	if (response.status === 204) {
		return null;
	}

	const contentType = response.headers.get("content-type");

	if (contentType?.includes("application/json")) {
		return response.json();
	}

	return null;
}

export async function apiRequest(endpoint, options = {}) {
	const isFormData = options.body instanceof FormData;

	const headers = {
		...options.headers
	};

	if (!isFormData && options.body !== undefined) {
		headers["Content-Type"] ??= "application/json";
	}

	const response = await fetch(
		`${API_BASE_URL}${endpoint}`,
		{
			...options,
			headers,
			credentials: "include"
		}
	);

	if (!response.ok) {
		const error = await response.text();
		throw new Error(error || `Request failed with status ${response.status}`);
	}

	if (response.status === 204) {
		return null;
	}

	return response.json();
}
