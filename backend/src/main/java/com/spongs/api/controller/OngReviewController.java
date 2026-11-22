package com.spongs.api.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.spongs.api.dto.OngReviewRequest;
import com.spongs.api.dto.OngReviewResponse;
import com.spongs.api.dto.OngReviewSummaryResponse;
import com.spongs.api.service.OngReviewService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/ongs/{ongId}/reviews")
public class OngReviewController {
    private final OngReviewService reviewService;

    public OngReviewController(OngReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping
    public List<OngReviewResponse> getReviews(
            @PathVariable Long ongId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return reviewService.getReviews(ongId, page, size);
    }

    @GetMapping("/summary")
    public OngReviewSummaryResponse getSummary(@PathVariable Long ongId) {
        return reviewService.getSummary(ongId);
    }

    @PostMapping
    public ResponseEntity<OngReviewResponse> createReview(
            @PathVariable Long ongId,
            @Valid @RequestBody OngReviewRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(reviewService.createReview(ongId, request));
    }
}