import { apiRequest } from "./api";
import { apiMutation } from "./auth";

export function getPublicOngs() {
	return apiRequest("/api/ongs");
}

export function getOngById(id) {
	return apiRequest(`/api/ongs/${id}`);
}

export function getTags() {
	return apiRequest("/api/tags");
}

export function getSocialMediaTypes() {
	return apiRequest("/api/social-media");
}

export async function registerOng(data, imageFile) {
	const formData = new FormData();

	formData.append("data", new Blob([JSON.stringify(data)], { type: "application/json" }));
	formData.append("image", imageFile);

	return apiMutation("/api/ongs", "POST", formData)
};
