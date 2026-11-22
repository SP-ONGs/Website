package com.spongs.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.spongs.api.model.OngSocialMedia;

import java.util.Collection;
import java.util.List;

public interface OngSocialMediaRepository extends JpaRepository<OngSocialMedia, Long> {
	List<OngSocialMedia> findAllByOng_Id(Long ongId);

	@Query("select osm from OngSocialMedia osm join fetch osm.socialMedia where osm.ong.id in :ongIds")
	List<OngSocialMedia> findAllByOngIds(@Param("ongIds") Collection<Long> ongIds);

	void deleteAllByOng_Id(Long ongId);
}
