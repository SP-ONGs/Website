package com.spongs.api.dto;

import java.util.Map;

public record OngReviewSummaryResponse(
        double average,
        long total,
        Map<Integer, Long> distribution) {
}