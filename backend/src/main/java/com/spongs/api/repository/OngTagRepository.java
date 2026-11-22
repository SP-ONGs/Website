package com.spongs.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.spongs.api.model.OngTag;

import java.util.Collection;
import java.util.List;

public interface OngTagRepository extends JpaRepository<OngTag, Long> {
	List<OngTag> findAllByOng_Id(Long ongId);

	@Query("select ot from OngTag ot join fetch ot.tag where ot.ong.id in :ongIds")
	List<OngTag> findAllByOngIds(@Param("ongIds") Collection<Long> ongIds);

	void deleteAllByOng_Id(Long ongId);
}
