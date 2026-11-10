package com.spongs.api.repository;

import com.spongs.api.model.Ong;
import com.spongs.api.model.OngStatus;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Param;

public interface OngRepository extends JpaRepository<Ong, Long> {
	List<Ong> findAllByStatus(OngStatus status);

	List<Ong> findAllByStatusOrderByNameAsc(OngStatus status);

	List<Ong> findAllByStatusOrderByCreatedAtAsc(OngStatus status);

	boolean existsByCnpj(String cnpj);

	@Query("""
	SELECT o FROM Ong o
	WHERE o.status = :status
	AND (
		:name IS NULL
		OR LOWER(o.name) LIKE LOWER(CONCAT('%', :name, '%'))
		)
	AND (
		:filterByTags = false
		OR EXISTS (
			SELECT ot.id
			FROM OngTag ot
			WHERE ot.ong.id = o.id
			AND ot.tag.id IN :tagIds
			)
		)
	ORDER BY o.createdAt ASC
	""")
	List<Ong> findFilteredByStatus(
			@Param("status") OngStatus status,
			@Param("name") String name,
			@Param("filterByTags") boolean filterByTags,
			@Param("tagIds") List<Long> tagIds
			);
}
