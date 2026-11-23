package com.spongs.api.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.spongs.api.model.OngReview;

public interface OngReviewRepository extends JpaRepository<OngReview, Long> {
	List<OngReview> findAllByOng_IdOrderByCreatedAtDescIdDesc(Long ongId, Pageable pageable);

	// Each row: [rating (Integer), amount (Long)]
	@Query("select r.rating, count(r) from OngReview r where r.ong.id = :ongId group by r.rating")
	List<Object[]> countByRating(@Param("ongId") Long ongId);
	boolean existsByOng_IdAndGoogleSub(Long ongId, String googleSub);
}