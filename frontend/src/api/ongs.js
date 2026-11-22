import { apiRequest } from "./api";
import { apiMutation } from "./auth";

export async function getPublicOngs(name = '', tagIds = []) {
	const params = new URLSearchParams()

	if (name.trim()) {
		params.set("name", name.trim())
	}

	tagIds.forEach(id => {
		params.append("tagIds", id)
	})

	const query = params.toString()
	const queryUrl = query ? `?${query}` : ""

	return apiRequest("/api/ongs" + queryUrl);
}

export async function getOngById(id) {
	return apiRequest(`/api/ongs/${id}`);
}

export async function getTags() {
	return apiRequest("/api/tags");
}

export async function getSocialMediaTypes() {
	return apiRequest("/api/social-media");
}

export async function registerOng(data, imageFile) {
	const formData = new FormData();

	formData.append("data", new Blob([JSON.stringify(data)], { type: "application/json" }));
	formData.append("image", imageFile);

	return apiMutation("/api/ongs", "POST", formData)
};
