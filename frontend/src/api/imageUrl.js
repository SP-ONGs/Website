import { API_BASE_URL } from "./api";

export function resolveImageUrl(imageUrl) {
	if (!imageUrl) return "";

	if (/^https?\/\//i.test(imageUrl)) {
		return imageUrl;
	}

	return `${API_BASE_URL}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
}

export function cloudinaryResize(url, width = 400) {
	if (!url || !url.includes("/upload/")) return url
	return url.replace("/upload/", `/upload/w_${width},c_fill,f_auto,q_auto/`)
}
