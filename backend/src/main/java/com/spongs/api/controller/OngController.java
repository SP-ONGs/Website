package com.spongs.api.controller;

import com.spongs.api.service.OngService;
import com.spongs.api.service.CloudinaryService;

import com.spongs.api.model.Ong;

import com.spongs.api.dto.OngPublicSummary;
import com.spongs.api.dto.OngPublicResponse;
import com.spongs.api.dto.OngRegistrationRequest;
import com.spongs.api.dto.OngRegistrationResponse;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/ongs")
public class OngController {
	private final OngService ongService;
	private final CloudinaryService cloudinaryService;

	public OngController(OngService ongService, CloudinaryService cloudinaryService) {
		this.ongService = ongService;
		this.cloudinaryService = cloudinaryService;
	}

	@GetMapping
	public List<OngPublicSummary> getPublicOngs() {
		return ongService.getPublicOngs();
	}

	@GetMapping("/{id}")
	public OngPublicResponse getPublicOngById(@PathVariable Long id) {
		return ongService.getPublicOngById(id);
	}

	@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<OngRegistrationResponse> registerOng(
			@Valid @RequestPart("data") OngRegistrationRequest request,
			@RequestPart("image") MultipartFile image) {
		CloudinaryService.UploadedImage uploaded = cloudinaryService.uploadOngImage(image);

		try {
			Ong ong = ongService.registerOng(
					request,
					uploaded.url(),
					uploaded.publicId());

			return ResponseEntity.status(HttpStatus.CREATED)
					.body(OngRegistrationResponse.from(ong, request.email()));

		} catch (RuntimeException e) {
			// The database registration failed after the upload.
			// Remove the image to avoid leaving an orphaned asset.
			try {
				cloudinaryService.deleteImage(uploaded.publicId());
			} catch (RuntimeException cleanupError) {
				e.addSuppressed(cleanupError);
			}

			throw e;
		}
	}
}
