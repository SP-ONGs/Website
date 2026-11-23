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
import com.spongs.api.service.GoogleTokenVerifier.GoogleUser;

@Service
public class OngReviewService {
    private static final int MAX_PAGE_SIZE = 50;

    private final OngRepository ongRepository;
    private final OngReviewRepository reviewRepository;
    private final GoogleTokenVerifier googleTokenVerifier;

    public OngReviewService(OngRepository ongRepository, OngReviewRepository reviewRepository,
                            GoogleTokenVerifier googleTokenVerifier) {
        this.ongRepository = ongRepository;
        this.reviewRepository = reviewRepository;
        this.googleTokenVerifier = googleTokenVerifier;
    }

    @Transactional
    public OngReviewResponse createReview(Long ongId, OngReviewRequest request) {
        Ong ong = findApprovedOng(ongId);
        GoogleUser user = googleTokenVerifier.verify(request.idToken());

        if (reviewRepository.existsByOng_IdAndGoogleSub(ongId, user.sub())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "You already reviewed this ONG");
        }

        OngReview review = reviewRepository.save(new OngReview(
                ong,
                user.name().length() > 80 ? user.name().substring(0, 80) : user.name(),
                user.sub(),
                user.picture(),
                request.rating(),
                clean(request.comment())));

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