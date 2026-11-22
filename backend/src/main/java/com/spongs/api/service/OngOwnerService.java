package com.spongs.api.service;

// Framework
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import org.springframework.web.server.ResponseStatusException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

// Models
import com.spongs.api.model.Ong;
import com.spongs.api.model.OngStatus;
import com.spongs.api.model.OngSocialMedia;
import com.spongs.api.model.OngTag;

// Repositorys
import com.spongs.api.repository.OngRepository;
import com.spongs.api.repository.SocialMediaRepository;
import com.spongs.api.repository.TagRepository;
import com.spongs.api.repository.OngSocialMediaRepository;
import com.spongs.api.repository.OngTagRepository;

// DTOs
import com.spongs.api.dto.OngSocialMediaResponse;
import com.spongs.api.dto.TagResponse;
import com.spongs.api.dto.OngUpdateRequest;
import com.spongs.api.dto.OngOwnerResponse;

// Utils
import java.util.HashSet;

@Service
public class OngOwnerService {
	private final OngRepository ongRepository;
	private final SocialMediaRepository socialMediaRepository;
	private final TagRepository tagRepository;
	private final OngSocialMediaRepository ongSocialMediaRepository;
	private final OngTagRepository ongTagRepository;

	private final OngService ongService;
	private final CloudinaryService cloudinaryService;

	private static final Logger log = LoggerFactory.getLogger(OngOwnerService.class);

	public OngOwnerService(
			OngRepository ongRepository,
			SocialMediaRepository socialMediaRepository,
			TagRepository tagRepository,
			OngSocialMediaRepository ongSocialMediaRepository,
			OngTagRepository ongTagRepository,
			OngService ongService,
			CloudinaryService cloudinaryService) {
		this.ongRepository = ongRepository;
		this.socialMediaRepository = socialMediaRepository;
		this.tagRepository = tagRepository;
		this.ongSocialMediaRepository = ongSocialMediaRepository;
		this.ongTagRepository = ongTagRepository;
		this.ongService = ongService;
		this.cloudinaryService = cloudinaryService;
	}

	@Transactional(readOnly = true)
	public OngOwnerResponse getOwnerOng(Long ongId) {
		Ong ong = ongRepository.findById(ongId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "ONG not found."));

		return toOwnerResponse(ong);
	}

	@Transactional
	public OngOwnerResponse updateOwnerOng(Long ongId, OngUpdateRequest request) {
		return updateOwnerOng(ongId, request, "", "");
	}

	@Transactional
	public OngOwnerResponse updateOwnerOng(Long ongId, OngUpdateRequest request, String newImageUrl,
			String newImagePublicId) {
		Ong ong = ongRepository.findById(ongId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "ONG not found."));
		String oldPublicId = ong.getImagePublicId();

		// Check if ONG is removed
		boolean IS_REMOVED = ong.getStatus() == OngStatus.REMOVAL_REQUESTED || ong.getStatus() == OngStatus.ADMIN_REMOVED;

		if (IS_REMOVED) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "This ONG has already been removed.");
		}

		// Validate unique social media and tags IDs
		var socialMediaIds = request.socialMedia().stream().map(OngUpdateRequest.SocialMediaEntry::socialMediaId)
				.toList();
		var tagIds = request.tagIds();

		if (new HashSet<>(socialMediaIds).size() != socialMediaIds.size()) {
			throw new IllegalArgumentException("Duplicate social media types are not allowed.");
		}

		if (new HashSet<>(tagIds).size() != tagIds.size()) {
			throw new IllegalArgumentException("Duplicate tags are not allowed.");
		}

		// Valid social media and tags exists
		var socialMediaTypes = socialMediaRepository.findAllById(socialMediaIds);
		var tags = tagRepository.findAllById(tagIds);

		boolean SOCIAL_MEDIAS_EXISTS = socialMediaTypes.size() == socialMediaIds.size();
		boolean TAGS_EXISTS = tags.size() == tagIds.size();

		if (!SOCIAL_MEDIAS_EXISTS) {
			throw new IllegalArgumentException("One or more social medias do not exist.");
		}

		if (!TAGS_EXISTS) {
			throw new IllegalArgumentException("One or more tags do not exist.");
		}

		String newCnpj = ongService.normalizeCnpj(request.cnpj());
		String oldCnpj = ong.getCnpj();

		boolean CNPJ_CHANGED = !java.util.Objects.equals(oldCnpj, newCnpj);

		if (CNPJ_CHANGED && newCnpj != null && ongRepository.existsByCnpj(newCnpj)) {
			throw new IllegalArgumentException("This CNPJ is already registered.");
		}

		// Update the ONG's editable fields
		ong.setName(request.name().trim());
		ong.setCep(request.cep());
		ong.setHouseNumber(request.houseNumber().trim());
		ong.setCnpj(newCnpj);

		if (!newImageUrl.isEmpty()) {
			ong.setImageUrl(newImageUrl);
		}

		if (!newImagePublicId.isEmpty()) {
			ong.setImagePublicId(newImagePublicId);
		}

		boolean DELETE_OLD_IMAGE = oldPublicId != null && !oldPublicId.equals(newImagePublicId);

		if (DELETE_OLD_IMAGE) {
			TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
				@Override
				public void afterCommit() {
					try {
						cloudinaryService.deleteImage(oldPublicId);
					} catch (RuntimeException e) {
						// An orphaned old image is not worth failing the request
						log.warn("Could not delete old image {}", oldPublicId, e);
					}
				}
			});
		}

		/*
		 * Changing cnpj requires another review
		 * if (CNPJ_CHANGED) {
		 * ong.setStatus(OngStatus.PENDING_REVIEW);
		 * }
		 */

		Ong savedOng = ongRepository.save(ong);

		// Replace social media entries
		ongSocialMediaRepository.deleteAllByOng_Id(ongId);

		var newSocialMediaEntries = request.socialMedia().stream().map(entry -> {
			var type = socialMediaTypes.stream().filter(item -> item.getId().equals(entry.socialMediaId())).findFirst()
					.orElseThrow();

			return new OngSocialMedia(savedOng, type, entry.description().trim());
		}).toList();

		ongSocialMediaRepository.saveAll(newSocialMediaEntries);

		// Replace tags entries
		ongTagRepository.deleteAllByOng_Id(ongId);

		var newOngTags = tags.stream().map(tag -> new OngTag(savedOng, tag)).toList();

		ongTagRepository.saveAll(newOngTags);

		return toOwnerResponse(savedOng);
	}

	@Transactional
	public OngOwnerResponse requestOngRemoval(Long ongId) {
		Ong ong = ongRepository.findById(ongId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "ONG not found."));

		if (ong.getStatus() == OngStatus.ADMIN_REMOVED || ong.getStatus() == OngStatus.REMOVAL_REQUESTED) {
			throw new ResponseStatusException(HttpStatus.GONE, "This ONG has already been removed");
		}

		ong.setStatus(OngStatus.REMOVAL_REQUESTED);

		Ong savedOng = ongRepository.save(ong);

		return toOwnerResponse(savedOng);
	}

	private OngOwnerResponse toOwnerResponse(Ong ong) {
		var socialMedia = ongSocialMediaRepository.findAllByOng_Id(ong.getId()).stream()
				.map(entry -> new OngSocialMediaResponse(
						entry.getSocialMedia().getId(),
						entry.getSocialMedia().getName(),
						entry.getDescription()))
				.toList();

		var tags = ongTagRepository.findAllByOng_Id(ong.getId()).stream().map(entry -> new TagResponse(
				entry.getTag().getId(),
				entry.getTag().getDescription())).toList();

		return new OngOwnerResponse(
				ong.getId(),
				ong.getName(),
				ong.getCep(),
				ong.getHouseNumber(),
				ong.getCnpj(),
				ong.getImageUrl(),
				ong.getStatus(),
				socialMedia,
				tags);
	}
}
