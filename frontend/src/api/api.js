const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

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

export async function apiRequest(path, options = {}) {
	const response = await fetch(`${API_BASE_URL}${path}`, {
		...options,
		credentials: "include",
		headers: {
			...options.headers
		}
	});

	if (!response.ok) {
		const body = await parseResponse(response);

		const message = body?.message || body?.detail || `Request failed with status ${response.status}`;
		const error = new Error(message);

		error.status = response.status;
		throw error;
	}

	return parseResponse(response);
}
