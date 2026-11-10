import { apiRequest } from "./api";
import { apiMutation } from "./auth";

export async function getMyOng() {
	return apiRequest("/api/owner/ong");
}

export async function updateMyOng(ongData) {
	return apiMutation("/api/owner/ong", "PUT", ongData);
}

export async function requestMyOngRemoval() {
	return apiMutation("/api/owner/ong/removal-request", "POST");
}
