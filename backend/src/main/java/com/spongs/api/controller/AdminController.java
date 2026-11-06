package com.spongs.api.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.spongs.api.service.OngService;

import com.spongs.api.dto.OngAdminSummary;
import com.spongs.api.dto.OngAdminResponse;

import com.spongs.api.model.OngStatus;

import java.util.List;

@RestController
@RequestMapping("/api/admin/ongs")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
	private final OngService ongService;

	public AdminController(OngService ongService) {
		this.ongService = ongService;
	}

	@GetMapping("/pending")
	public List<OngAdminSummary> getPendingOngs() {
		return ongService.getPedingOngs();
	}

	@GetMapping("/{id}")
	public OngAdminResponse getOng(@PathVariable Long id) {
		return ongService.getAdminOng(id);
	}

	@PostMapping("/{id}/approve")
	public OngAdminResponse approveOng(@PathVariable Long id) {
		return ongService.reviewOng(id, OngStatus.APPROVED);
	}

	@PostMapping("/{id}/reject")
	public OngAdminResponse rejectOng(@PathVariable Long id) {
		return ongService.reviewOng(id, OngStatus.REJECTED);
	}

	@PostMapping("/{id}/reopen")
	public OngAdminResponse reopenOng(@PathVariable Long id) {
		return ongService.reviewOng(id, OngStatus.PENDING_REVIEW);
	}

	@PostMapping("/{id}/remove")
	public OngAdminResponse confirmRemoval(@PathVariable Long id) {
		return ongService.adminRemoveOng(id);
	}
}
