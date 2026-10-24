import { API_BASE_URL } from "./api";

export function resolveImageUrl(imageUrl) {
	if (!imageUrl) return "";

	if (/^https?\/\//i.test(imageUrl)) {
		return imageUrl;
	}

	return `${API_BASE_URL}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
}
