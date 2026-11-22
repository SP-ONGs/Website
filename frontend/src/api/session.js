import { apiRequest } from "./api";
import { apiMutation } from "./auth";

export async function login(email, password) {
	return apiMutation("/api/auth/login", "POST", { email, password });
}

export async function getCurrentAccount() {
	return apiRequest("/api/auth/me");
}

export async function logout() {
	return apiMutation("/api/auth/logout", "POST");
}
