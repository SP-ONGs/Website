package com.spongs.api.dto;

import java.util.List;

public record OngSummaryReponse(
		Long id,
		String name,
		String imageUrl,
		List<Long> tagIds) {
}
