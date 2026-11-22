package com.spongs.api.controller;

import com.spongs.api.service.AdminService;
import com.spongs.api.service.CloudinaryService;
import com.spongs.api.service.OngOwnerService;

import com.spongs.api.dto.OngPublicResponse;
import com.spongs.api.dto.OngAdminResponse;
import com.spongs.api.dto.OngOwnerResponse;
import com.spongs.api.dto.OngUpdateRequest;

import com.spongs.api.model.Ong;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.spongs.api.model.OngStatus;

import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/admin/ongs")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
	private final AdminService adminService;
	private final CloudinaryService cloudinaryService;
	private final OngOwnerService ongOwnerService;

	public AdminController(AdminService adminService, CloudinaryService cloudinaryService,
			OngOwnerService ongOwnerService) {
		this.adminService = adminService;
		this.cloudinaryService = cloudinaryService;
		this.ongOwnerService = ongOwnerService;
	}

	@GetMapping("/pending")
	public ResponseEntity<List<OngPublicResponse>> getPendingOngs(
			@RequestParam(required = false) String name,
			@RequestParam(required = false) List<Long> tagIds) {
		return ResponseEntity.ok(adminService.getPendingOngs(name, tagIds));
	}

	@GetMapping("/{id}")
	public OngAdminResponse getOng(@PathVariable Long id) {
		return adminService.getAdminOng(id);
	}

	@PostMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public OngOwnerResponse updateOng(@PathVariable Long id, @Valid @RequestPart("data") OngUpdateRequest request,
			@RequestPart(value = "image", required = false) MultipartFile image) {

		// No new image: update only the data
		if (image == null || image.isEmpty()) {
			return ongOwnerService.updateOwnerOng(id, request);
		}

		CloudinaryService.UploadedImage uploaded = cloudinaryService.uploadOngImage(image);

		try {
			return ongOwnerService.updateOwnerOng(id, request, uploaded.url(), uploaded.publicId());
		} catch (RuntimeException e) {
			// The update failed after the upload: remove the NEW image
			try {
				cloudinaryService.deleteImage(uploaded.publicId());
			} catch (RuntimeException cleanupError) {
				e.addSuppressed(cleanupError);
			}
			throw e;
		}
	}

	@PostMapping("/{id}/approve")
	public OngAdminResponse approveOng(@PathVariable Long id) {
		return adminService.reviewOng(id, OngStatus.APPROVED);
	}

	@PostMapping("/{id}/reject")
	public OngAdminResponse rejectOng(@PathVariable Long id) {
		return adminService.reviewOng(id, OngStatus.REJECTED);
	}

	@PostMapping("/{id}/reopen")
	public OngAdminResponse reopenOng(@PathVariable Long id) {
		return adminService.reviewOng(id, OngStatus.PENDING_REVIEW);
	}

	@PostMapping("/{id}/remove")
	public OngAdminResponse confirmRemoval(@PathVariable Long id) {
		return adminService.adminRemoveOng(id);
	}
}
