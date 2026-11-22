package com.spongs.api.controller;

import jakarta.validation.Valid;

import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.spongs.api.service.AccountAccessService;
import com.spongs.api.service.OngOwnerService;
import com.spongs.api.service.CloudinaryService;

import com.spongs.api.dto.OngOwnerResponse;
import com.spongs.api.dto.OngUpdateRequest;

@RestController
@RequestMapping("/api/owner")
@PreAuthorize("hasRole('ONG_OWNER')")
public class OngOwnerController {
	private final OngOwnerService ongOwnerService;
	private final AccountAccessService accountAccessService;
	private final CloudinaryService cloudinaryService;

	public OngOwnerController(OngOwnerService ongOwnerService, AccountAccessService accountAccessService,
			CloudinaryService cloudinaryService) {
		this.ongOwnerService = ongOwnerService;
		this.accountAccessService = accountAccessService;
		this.cloudinaryService = cloudinaryService;
	}

	@GetMapping
	public OngOwnerResponse getMyOng(Authentication authentication) {
		var account = accountAccessService.requireCurrentOwner(authentication);
		Long ongId = account.getOng().getId();

		return ongOwnerService.getOwnerOng(ongId);
	}

	@PutMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public OngOwnerResponse updateMyOng(@Valid @RequestPart("data") OngUpdateRequest request,
			@RequestPart(value = "image", required = false) MultipartFile image, Authentication authentication) {
		var account = accountAccessService.requireCurrentOwner(authentication);
		Long ongId = account.getOng().getId();

		// No new image: update only data
		if (image == null || image.isEmpty()) {
			return ongOwnerService.updateOwnerOng(ongId, request);
		}

		CloudinaryService.UploadedImage uploaded = cloudinaryService.uploadOngImage(image);

		try {
			return ongOwnerService.updateOwnerOng(ongId, request, uploaded.url(), uploaded.publicId());
		} catch (RuntimeException e) {
			try {
				cloudinaryService.deleteImage(uploaded.publicId());
			} catch (RuntimeException cleanupError) {
				e.addSuppressed(cleanupError);
			}
			throw e;
		}
	}

	@PostMapping("/removal-request")
	public OngOwnerResponse requestRemoval(Authentication authentication) {
		var account = accountAccessService.requireCurrentOwner(authentication);

		Long ongId = account.getOng().getId();

		return ongOwnerService.requestOngRemoval(ongId);
	}
}
