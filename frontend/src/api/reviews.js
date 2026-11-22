import { apiRequest } from "./api";
import { apiMutation } from "./auth";

export function getReviewSummary(ongId) {
    return apiRequest(`/api/ongs/${ongId}/reviews/summary`);
}

export function getReviews(ongId, page = 0, size = 10) {
    return apiRequest(`/api/ongs/${ongId}/reviews?page=${page}&size=${size}`);
}

export function createReview(ongId, data) {
    return apiMutation(`/api/ongs/${ongId}/reviews`, "POST", data);
}