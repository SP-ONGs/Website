package com.spongs.api.dto;

import java.time.Instant;

import com.spongs.api.model.OngReview;

public record OngReviewResponse(
		Long id,
		String authorName,
		int rating,
		String comment,
		Instant createdAt) {

	public static OngReviewResponse from(OngReview review) {
		return new OngReviewResponse(
				review.getId(),
				review.getAuthorName(),
				review.getRating(),
				review.getComment(),
				review.getCreatedAt());
	}
}