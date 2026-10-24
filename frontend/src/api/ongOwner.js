import { apiRequest } from "./api";
import { apiMutation } from "./auth";

export function getMyOng() {
	return apiRequest("/api/owner/ong");
}

export function updateMyOng(ongData) {
	return apiMutation("/api/owner/ong", "PUT", ongData);
}

export function requestMyOngRemoval() {
	return apiMutation("/api/owner/ong/removal-request", "POST");
}
