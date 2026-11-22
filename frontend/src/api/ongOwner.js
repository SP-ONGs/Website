import { apiRequest } from "./api";
import { apiMutation } from "./auth";

export async function getMyOng() {
	return apiRequest("/api/owner");
}

export async function updateMyOng(data, imageFile) {
	const formData = new FormData()
	formData.append("data", new Blob([JSON.stringify(data)], { type: "application/json" }))

	if (imageFile) {
		formData.append("image", imageFile)
	}

	return apiMutation("/api/owner", "PUT", formData)
}

export async function requestMyOngRemoval() {
	return apiMutation("/api/owner/ong/removal-request", "POST");
}
