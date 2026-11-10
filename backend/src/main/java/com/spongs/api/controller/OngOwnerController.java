package com.spongs.api.controller;

import jakarta.validation.Valid;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.spongs.api.service.AccountAccessService;
import com.spongs.api.service.OngOwnerService;

import com.spongs.api.dto.OngOwnerResponse;
import com.spongs.api.dto.OngUpdateRequest;

@RestController
@RequestMapping("/api/owner")
@PreAuthorize("hasRole('ONG_OWNER')")
public class OngOwnerController {
	private final OngOwnerService ongOwnerService;
	private final AccountAccessService accountAccessService;

	public OngOwnerController(OngOwnerService ongOwnerService, AccountAccessService accountAccessService) {
		this.ongOwnerService = ongOwnerService;
		this.accountAccessService = accountAccessService;
	}

	@GetMapping
	public OngOwnerResponse getMyOng(Authentication authentication) {
		var account = accountAccessService.requireCurrentOwner(authentication);
		Long ongId = account.getOng().getId();

		return ongOwnerService.getOwnerOng(ongId);
	}

	@PutMapping
	public OngOwnerResponse updateMyOng(@Valid @RequestBody OngUpdateRequest request, Authentication authentication) {
		var account = accountAccessService.requireCurrentOwner(authentication);
		Long ongId = account.getOng().getId();

		return ongOwnerService.updateOwnerOng(ongId, request);
	}

	@PostMapping("/removal-request")
	public OngOwnerResponse requestRemoval(Authentication authentication) {
		var account = accountAccessService.requireCurrentOwner(authentication);

		Long ongId = account.getOng().getId();

		return ongOwnerService.requestOngRemoval(ongId);
	}
}
