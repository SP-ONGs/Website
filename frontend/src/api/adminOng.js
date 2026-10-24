import { apiRequest } from "./api";
import { apiMutation } from "./auth";

export function getPendingOngs() {
	return apiRequest("/api/admin/ongs/pending");
}

export function getAdminOng(id) {
	return apiRequest(`/api/admin/ongs/${id}`);
}

export function approveOng(id) {
	return apiMutation(`/api/admin/ongs/${id}/approve`, "POST");
}

export function rejectOng(id) {
	return apiMutation(`/api/admin/ongs/${id}/reject`, "POST");
}

export function reopenOng(id) {
	return apiMutation(`/api/admin/ongs/${id}/reopen`, "POST");
}

export function removeOng(id) {
	return apiMutation(`/api/admin/ongs/${id}/remove`, "POST");
}
