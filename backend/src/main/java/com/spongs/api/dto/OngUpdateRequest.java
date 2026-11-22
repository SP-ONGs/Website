package com.spongs.api.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.util.List;

public record OngUpdateRequest(
		@NotBlank @Size(max = 150) String name,
		@NotBlank @Pattern(regexp = "\\d{8}") String cep,
		@NotBlank @Size(max = 30) String houseNumber,
		@Size(max = 18) String cnpj,
		@NotNull @Size(max = 10) List<@Valid SocialMediaEntry> socialMedia,
		@NotNull @Size(max = 20) List<@NotNull @Positive Long> tagIds) {

	public record SocialMediaEntry(
			@NotNull @Positive Long socialMediaId,
			@NotBlank @Size(max = 500) String description) {
	}
}
