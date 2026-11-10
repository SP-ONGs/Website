import { apiRequest } from "./api";
import { apiMutation } from "./auth";

export async function getPendingOngs(name = "", tagIds = []) {
	const params = new URLSearchParams()

	if (name.trim()) {
		params.set("name", name.trim())
	}

	tagIds.forEach(id => {
		params.append("tagIds", id)
	})

	const query = params.toString()
	const queryUrl = query ? `?${query}` : ""

	return apiRequest("/api/admin/ongs/pending" + queryUrl);
}

export async function getAdminOng(id) {
	return apiRequest(`/api/admin/ongs/${id}`);
}

export async function approveOng(id) {
	return apiMutation(`/api/admin/ongs/${id}/approve`, "POST");
}

export async function rejectOng(id) {
	return apiMutation(`/api/admin/ongs/${id}/reject`, "POST");
}

export async function reopenOng(id) {
	return apiMutation(`/api/admin/ongs/${id}/reopen`, "POST");
}

export async function removeOng(id) {
	return apiMutation(`/api/admin/ongs/${id}/remove`, "POST");
}
