package com.spongs.api.dto;

import java.util.List;

public record OngPublicSummary(
		Long id,
		String name,
		String imageUrl,
		List<Long> tagIds) {
}
