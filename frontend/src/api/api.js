export const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080"

export class ApiError extends Error {
	constructor(status, data) {
		super(data?.message || `Request failed with status ${status}`)

		this.name = "ApiError"
		this.status = status
		this.code = data?.code
	}
}

export async function apiRequest(endpoint, options = {}) {
	const isFormData = options.body instanceof FormData
	const headers = {
		...options.headers
	}

	if (!isFormData && options.body !== undefined) {
		headers["Content-Type"] ??= "application/json"
	}

	const response = await fetch(
		`${API_BASE_URL}${endpoint}`,
		{
			...options,
			headers,
			credentials: "include"
		}
	)

	if (!response.ok) {
		const errorData = await response.json().catch(() => null)
		throw new ApiError(response.status, errorData)
	}

	if (response.status === 204) {
		return null
	}

	return response.json()
}
