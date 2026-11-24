package com.spongs.api.dto;

import com.spongs.api.model.OngStatus;

import java.util.List;

public record OngOwnerResponse(
		Long id,
		String name,
		String cep,
		String houseNumber,
		String cnpj,
		String imageUrl,
		OngStatus status,
		List<OngSocialMediaResponse> socialMedia,
		List<TagResponse> tags,
		OngReviewSummaryResponse reviewsSummary) {
}
