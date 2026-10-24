import { apiRequest } from "./api";
import { apiMutation } from "./auth";

export function login(email, password) {
	return apiMutation("/api/auth/login", "POST", { email, password });
}

export function getCurrentAccount() {
	return apiRequest("/api/auth/me");
}

export function logout() {
	return apiMutation("/api/auth/logout", "POST");
}
