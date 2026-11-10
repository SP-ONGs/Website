package com.spongs.api.service;

// Framework
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

// Repositorys
import com.spongs.api.repository.OngRepository;
import com.spongs.api.repository.SocialMediaRepository;
import com.spongs.api.repository.TagRepository;
import com.spongs.api.repository.OngSocialMediaRepository;
import com.spongs.api.repository.OngTagRepository;
import com.spongs.api.repository.UserAccountRepository;

// Models
import com.spongs.api.model.Ong;
import com.spongs.api.model.OngStatus;
import com.spongs.api.model.UserAccount;

// DTOs
import com.spongs.api.dto.OngSocialMediaResponse;
import com.spongs.api.dto.TagResponse;
import com.spongs.api.dto.OngAdminSummary;
import com.spongs.api.dto.OngAdminResponse;

// Utils
import java.util.List;

@Service
public class AdminService {
	private final OngRepository ongRepository;
	private final OngSocialMediaRepository ongSocialMediaRepository;
	private final OngTagRepository ongTagRepository;
	private final UserAccountRepository userAccountRepository;

	public AdminService(
			OngRepository ongRepository,
			SocialMediaRepository socialMediaRepository,
			TagRepository tagRepository,
			OngSocialMediaRepository ongSocialMediaRepository,
			OngTagRepository ongTagRepository,
			UserAccountRepository userAccountRepository) {
		this.ongRepository = ongRepository;
		this.ongSocialMediaRepository = ongSocialMediaRepository;
		this.ongTagRepository = ongTagRepository;
		this.userAccountRepository = userAccountRepository;
	}

	@Transactional(readOnly = true)
	public List<OngAdminSummary> getPedingOngs() {
		return ongRepository.findAllByStatusOrderByCreatedAtAsc(OngStatus.PENDING_REVIEW).stream().map(ong -> {
			UserAccount account = userAccountRepository.findByOng_Id(ong.getId())
					.orElseThrow(() -> new IllegalStateException("ONG has no associated owner account"));

			return new OngAdminSummary(
					ong.getId(),
					account.getEmail(),
					ong.getName(),
					ong.getCep(),
					ong.getCnpj(),
					ong.getStatus(),
					ong.getCreatedAt());
		}).toList();
	}

	@Transactional(readOnly = true)
	public OngAdminResponse getAdminOng(Long ongId) {
		Ong ong = ongRepository.findById(ongId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "ONG not found."));

		UserAccount account = userAccountRepository.findByOng_Id(ongId)
				.orElseThrow(() -> new IllegalStateException("ONG has no associated owner account"));

		List<OngSocialMediaResponse> socialMedia = ongSocialMediaRepository.findAllByOng_Id(ongId).stream()
				.map(entry -> new OngSocialMediaResponse(
						entry.getSocialMedia().getId(),
						entry.getSocialMedia().getName(),
						entry.getDescription()))
				.toList();

		List<TagResponse> tags = ongTagRepository.findAllByOng_Id(ongId).stream().map(entry -> new TagResponse(
				entry.getTag().getId(),
				entry.getTag().getDescription())).toList();

		return new OngAdminResponse(
				ong.getId(),
				account.getEmail(),
				ong.getName(),
				ong.getCep(),
				ong.getHouseNumber(),
				ong.getCnpj(),
				ong.getImageUrl(),
				ong.getStatus(),
				ong.getCreatedAt(),
				socialMedia,
				tags);
	}

	@Transactional
	public OngAdminResponse reviewOng(Long ongId, OngStatus newStatus) {
		if (newStatus != OngStatus.APPROVED && newStatus != OngStatus.REJECTED && newStatus != OngStatus.PENDING_REVIEW) {
			throw new IllegalArgumentException("Invalid review status");
		}

		Ong ong = ongRepository.findById(ongId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "ONG not found."));

		// Check if ONG is removed
		boolean IS_REMOVED = ong.getStatus() == OngStatus.REMOVAL_REQUESTED || ong.getStatus() == OngStatus.ADMIN_REMOVED;

		if (IS_REMOVED) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "A removed ONG cannot be reactivated.");
		}

		// Set new ONG status
		ong.setStatus(newStatus);

		Ong savedOng = ongRepository.save(ong);

		return getAdminOng(savedOng.getId());
	}

	@Transactional
	public OngAdminResponse adminRemoveOng(Long ongId) {
		Ong ong = ongRepository.findById(ongId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "ONG not found."));

		if (ong.getStatus() == OngStatus.ADMIN_REMOVED || ong.getStatus() == OngStatus.REMOVAL_REQUESTED) {
			throw new ResponseStatusException(HttpStatus.GONE, "This ONG has already been removed");
		}

		ong.setStatus(OngStatus.ADMIN_REMOVED);

		Ong savedOng = ongRepository.save(ong);

		return getAdminOng(savedOng.getId());
	}
}
