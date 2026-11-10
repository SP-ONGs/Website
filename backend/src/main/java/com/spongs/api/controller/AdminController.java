package com.spongs.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.spongs.api.service.AdminService;

import com.spongs.api.dto.OngAdminSummary;
import com.spongs.api.dto.OngAdminResponse;

import com.spongs.api.model.OngStatus;

import java.util.List;

@RestController
@RequestMapping("/api/admin/ongs")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
	private final AdminService adminService;

	public AdminController(AdminService adminService) {
		this.adminService = adminService;
	}

	@GetMapping("/pending")
	public ResponseEntity<List<OngAdminSummary>> getPendingOngs(
			@RequestParam(required = false) String name,
			@RequestParam(required = false) List<Long> tagIds) {
		return ResponseEntity.ok(adminService.getPendingOngs(name, tagIds));
	}

	@GetMapping("/{id}")
	public OngAdminResponse getOng(@PathVariable Long id) {
		return adminService.getAdminOng(id);
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
