package com.spongs.api.dto;

import java.util.List;

public record OngPublicResponse(
		Long id,
		String name,
		String cep,
		String houseNumber,
		String cnpj,
		String imageUrl,
		List<OngSocialMediaResponse> socialMedia,
		List<TagResponse> tags,
		OngReviewSummaryResponse reviewsSummary) {
}
