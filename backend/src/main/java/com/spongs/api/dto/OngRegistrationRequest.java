package com.spongs.api.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record OngRegistrationRequest(
		@NotBlank(message = "Email is required.") @Email(message = "Enter a valid email address.") @Size(max = 254) String email,
		@NotBlank(message = "Password is required.") @Size(min = 8, max = 72, message = "Password must contain between 8 and 72 characters.") String password,
		@NotBlank(message = "ONG name is required.") @Size(max = 150) String name,
		@NotBlank(message = "CEP is required.") @Pattern(regexp = "\\d{5}-?\\d{3}", message = "CEP must contain 8 digits, optionally with a hyphen.") String cep,
		@NotBlank(message = "House number is required.") @Size(max = 30) String houseNumber,
		@Size(max = 18, message = "CNPJ is too long.") String cnpj,

		@NotNull(message = "Social media list is required.") @Size(min = 1, max = 3) List<@Valid SocialMediaEntry> socialMedia,
		@NotNull(message = "Tag list is required.") @Size(max = 20) List<@NotNull @Positive Long> tagIds) {

	public record SocialMediaEntry(
			@NotNull @Positive Long socialMediaId,
			@NotNull @Size(max = 500) String description) {
	}
}
