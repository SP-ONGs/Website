package com.spongs.api.service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.spongs.api.dto.OngReviewRequest;
import com.spongs.api.dto.OngReviewResponse;
import com.spongs.api.dto.OngReviewSummaryResponse;
import com.spongs.api.model.Ong;
import com.spongs.api.model.OngReview;
import com.spongs.api.model.OngStatus;
import com.spongs.api.repository.OngRepository;
import com.spongs.api.repository.OngReviewRepository;

@Service
public class OngReviewService {
    private static final int MAX_PAGE_SIZE = 50;

    private final OngRepository ongRepository;
    private final OngReviewRepository reviewRepository;

    public OngReviewService(OngRepository ongRepository, OngReviewRepository reviewRepository) {
        this.ongRepository = ongRepository;
        this.reviewRepository = reviewRepository;
    }

    @Transactional
    public OngReviewResponse createReview(Long ongId, OngReviewRequest request) {
        Ong ong = findApprovedOng(ongId);

        String authorName = clean(request.authorName());
        String comment = clean(request.comment());

        OngReview review = reviewRepository.save(new OngReview(
                ong,
                authorName == null ? "Anônimo" : authorName,
                request.rating(),
                comment));

        return OngReviewResponse.from(review);
    }

    @Transactional(readOnly = true)
    public List<OngReviewResponse> getReviews(Long ongId, int page, int size) {
        findApprovedOng(ongId);

        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), MAX_PAGE_SIZE);

        return reviewRepository
                .findAllByOng_IdOrderByCreatedAtDescIdDesc(ongId, PageRequest.of(safePage, safeSize))
                .stream()
                .map(OngReviewResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public OngReviewSummaryResponse getSummary(Long ongId) {
        findApprovedOng(ongId);

        Map<Integer, Long> distribution = new LinkedHashMap<>();
        for (int star = 5; star >= 1; star--) {
            distribution.put(star, 0L);
        }

        for (Object[] row : reviewRepository.countByRating(ongId)) {
            distribution.put(((Number) row[0]).intValue(), ((Number) row[1]).longValue());
        }

        long total = 0;
        long sum = 0;
        for (Map.Entry<Integer, Long> entry : distribution.entrySet()) {
            total += entry.getValue();
            sum += (long) entry.getKey() * entry.getValue();
        }

        double average = total == 0 ? 0.0 : Math.round((double) sum / total * 10) / 10.0;

        return new OngReviewSummaryResponse(average, total, distribution);
    }

    private Ong findApprovedOng(Long ongId) {
        return ongRepository.findById(ongId)
                .filter(ong -> ong.getStatus() == OngStatus.APPROVED)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "ONG not found"));
    }

    private String clean(String value) {
        if (value == null) {
            return null;
        }

        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}