package com.spongs.api.controller;

import com.spongs.api.service.ImageStorageService;
import com.spongs.api.service.OngService;
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
	private final ImageStorageService imageStorageService;

	public OngController(OngService ongService, ImageStorageService imageStorageService) {
		this.ongService = ongService;
		this.imageStorageService = imageStorageService;
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
	public OngRegistrationResponse registerOng(
			@Valid @RequestPart("data") OngRegistrationRequest request, @RequestPart("image") MultipartFile image) {
		String imageUrl = imageStorageService.storeOngImage(image);

		Ong ong = ongService.registerOng(request, imageUrl);

		return OngRegistrationResponse.from(ong, request.email());
	}
}
