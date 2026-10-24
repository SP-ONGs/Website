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

export function registerOng(data) {
	return apiMutation("/api/ongs", "POST", data);
}
