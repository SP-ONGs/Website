package com.spongs.api.service;

// Framework
import org.springframework.security.crypto.password.PasswordEncoder;
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
import com.spongs.api.model.SocialMedia;
import com.spongs.api.model.OngSocialMedia;
import com.spongs.api.model.Tag;
import com.spongs.api.model.OngTag;
import com.spongs.api.model.UserAccount;

// DTOs
import com.spongs.api.dto.OngPublicSummary;
import com.spongs.api.dto.OngPublicResponse;
import com.spongs.api.dto.OngSocialMediaResponse;
import com.spongs.api.dto.SocialMediaTypeResponse;
import com.spongs.api.dto.TagResponse;
import com.spongs.api.dto.OngRegistrationRequest;
import com.spongs.api.dto.OngUpdateRequest;
import com.spongs.api.dto.OngOwnerResponse;
import com.spongs.api.dto.OngAdminSummary;
import com.spongs.api.dto.OngAdminResponse;

// Utils
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class OngService {
	private final OngRepository ongRepository;
	private final SocialMediaRepository socialMediaRepository;
	private final TagRepository tagRepository;
	private final OngSocialMediaRepository ongSocialMediaRepository;
	private final OngTagRepository ongTagRepository;
	private final UserAccountRepository userAccountRepository;

	private final PasswordEncoder passwordEncoder;

	public OngService(
			OngRepository ongRepository,
			SocialMediaRepository socialMediaRepository,
			TagRepository tagRepository,
			OngSocialMediaRepository ongSocialMediaRepository,
			OngTagRepository ongTagRepository,
			UserAccountRepository userAccountRepository,
			PasswordEncoder passwordEncoder) {
		this.ongRepository = ongRepository;
		this.socialMediaRepository = socialMediaRepository;
		this.tagRepository = tagRepository;
		this.ongSocialMediaRepository = ongSocialMediaRepository;
		this.ongTagRepository = ongTagRepository;
		this.userAccountRepository = userAccountRepository;
		this.passwordEncoder = passwordEncoder;
	}

	@Transactional(readOnly = true)
	public List<OngPublicSummary> getPublicOngs() {
		return ongRepository.findAllByStatusOrderByNameAsc(OngStatus.APPROVED).stream()
				.map(ong -> new OngPublicSummary(
						ong.getId(),
						ong.getName(),
						ong.getCep(),
						ong.getImageUrl()))
				.toList();
	}

	@Transactional(readOnly = true)
	public OngPublicResponse getPublicOngById(Long id) {
		Ong ong = ongRepository.findById(id).filter(item -> item.getStatus() == OngStatus.APPROVED)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "ONG not found"));

		List<OngSocialMediaResponse> socialMedia = ongSocialMediaRepository.findAllByOng_Id(id).stream()
				.map(entry -> new OngSocialMediaResponse(
						entry.getSocialMedia().getId(),
						entry.getSocialMedia().getName(),
						entry.getDescription()))
				.toList();

		List<TagResponse> tags = ongTagRepository.findAllByOng_Id(id).stream().map(entry -> new TagResponse(
				entry.getTag().getId(),
				entry.getTag().getDescription())).toList();

		return new OngPublicResponse(
				ong.getId(),
				ong.getName(),
				ong.getCep(),
				ong.getHouseNumber(),
				ong.getCnpj(),
				ong.getImageUrl(),
				socialMedia,
				tags);
	}

	@Transactional(readOnly = true)
	public List<TagResponse> getAvailableTags() {
		return tagRepository.findAllByOrderByDescriptionAsc().stream().map(tag -> new TagResponse(
				tag.getId(),
				tag.getDescription())).toList();
	}

	@Transactional(readOnly = true)
	public List<SocialMediaTypeResponse> getAvailableSocialMedia() {
		return socialMediaRepository.findAllByOrderByNameAsc().stream().map(type -> new SocialMediaTypeResponse(
				type.getId(),
				type.getName())).toList();
	}

	@Transactional
	public Ong registerOng(OngRegistrationRequest request, String imageUrl) {

		// Normalize and validate basic fields
		String normalizedEmail = normalizeEmail(request.email());

		if (request.password() == null || request.password().isBlank()) {
			throw new IllegalArgumentException("Password is required.");
		}

		if (request.name() == null || request.name().isBlank()) {
			throw new IllegalArgumentException("ONG name is required.");
		}

		if (request.cep() == null || !request.cep().matches("\\d{8}")) {
			throw new IllegalArgumentException("Invalid CEP format.");
		}

		if (request.houseNumber() == null || request.houseNumber().isBlank()) {
			throw new IllegalArgumentException("House number is required.");
		}

		// Check if the email is already registered
		boolean IS_ALREADY_REGISTERED = userAccountRepository.findByEmail(normalizedEmail).isPresent();

		if (IS_ALREADY_REGISTERED) {
			throw new IllegalArgumentException("An account with this email already exists.");
		}

		// Normal and validate optional CNPJ
		String normalizedCnpj = normalizeCnpj(request.cnpj());

		if (normalizedCnpj != null && ongRepository.existsByCnpj(normalizedCnpj)) {
			throw new IllegalArgumentException("An ONG with this CNPJ is already registered");
		}

		// Validate catalogue IDs before creating the ONG.
		List<Long> socialMediaIds = request.socialMedia().stream()
				.map(OngRegistrationRequest.SocialMediaEntry::socialMediaId).toList();
		List<Long> tagIds = request.tagIds();

		ensureNoDuplicates(socialMediaIds, "social media");
		ensureNoDuplicates(tagIds, "tag");

		Map<Long, SocialMedia> socialMediaById = socialMediaRepository.findAllById(socialMediaIds).stream()
				.collect(Collectors.toMap(SocialMedia::getId, Function.identity()));

		boolean SOCIAL_MEDIA_ARE_VALID = socialMediaById.size() == socialMediaIds.size();

		if (!SOCIAL_MEDIA_ARE_VALID) {
			throw new IllegalArgumentException("One or more social media types do not exist.");
		}

		Map<Long, Tag> tagsById = tagRepository.findAllById(tagIds).stream()
				.collect(Collectors.toMap(Tag::getId, Function.identity()));

		boolean TAGS_ARE_VALID = tagsById.size() == tagIds.size();

		if (!TAGS_ARE_VALID) {
			throw new IllegalArgumentException("One or more tags do not exist.");
		}

		// Save ONG
		Ong ong = new Ong(
				request.name().trim(),
				request.cep(),
				request.houseNumber().trim(),
				normalizedCnpj,
				imageUrl);

		ong.setStatus(OngStatus.IN_REVIEW);

		Ong savedOng = ongRepository.save(ong);

		// Save social media connections
		List<OngSocialMedia> socialMediaEntries = request.socialMedia().stream()
				.map(entry -> new OngSocialMedia(savedOng, socialMediaById.get(entry.socialMediaId()),
						entry.description().trim()))
				.toList();

		ongSocialMediaRepository.saveAll(socialMediaEntries);

		// Save tags connections
		List<OngTag> tagEntries = tagIds.stream().map(tagId -> new OngTag(savedOng, tagsById.get(tagId))).toList();

		ongTagRepository.saveAll(tagEntries);

		// Create ONG owner account
		String passwordHash = passwordEncoder.encode(request.password());

		UserAccount owner = UserAccount.createOwner(normalizedEmail, passwordHash, savedOng);

		userAccountRepository.save(owner);

		return savedOng;
	}

	@Transactional(readOnly = true)
	public List<Ong> getApprovedOngs() {
		return ongRepository.findAllByStatus(OngStatus.APPROVED);
	}

	@Transactional(readOnly = true)
	public Optional<Ong> getApprovedOngById(Long id) {
		return ongRepository.findById(id).filter(ong -> ong.getStatus() == OngStatus.APPROVED);
	}

	private String normalizeEmail(String email) {
		if (email == null || email.isBlank()) {
			throw new IllegalArgumentException("Email is required.");
		}

		return email.trim().toLowerCase(Locale.ROOT);
	}

	private String normalizeCnpj(String cnpj) {
		if (cnpj == null || cnpj.isBlank()) {
			return null;
		}

		// Allow only digits
		String digits = cnpj.replaceAll("\\D", "");

		if (digits.length() != 14) {
			throw new IllegalArgumentException("CNPJ must contain 14 digits when provided.");
		}

		return digits;
	}

	private void ensureNoDuplicates(List<Long> ids, String fieldName) {
		Set<Long> uniqueIds = new HashSet<>(ids);

		if (uniqueIds.size() != ids.size()) {
			throw new IllegalArgumentException("Duplicate " + fieldName + " IDs are not allowed.");
		}
	}

	// ONG owner methods
	@Transactional(readOnly = true)
	public OngOwnerResponse getOwnerOng(Long ongId) {
		Ong ong = ongRepository.findById(ongId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "ONG not found."));

		return toOwnerResponse(ong);
	}

	public OngOwnerResponse updateOwnerOng(Long ongId, OngUpdateRequest request) {
		Ong ong = ongRepository.findById(ongId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "ONG not found."));

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

		String newCnpj = normalizeCnpj(request.cnpj());
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
		ong.setImageUrl(request.imageUrl());

		/*
		 * Changing cnpj requires another review
		 * if (CNPJ_CHANGED) {
		 * ong.setStatus(OngStatus.IN_REVIEW);
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

	// Administrator methods
	@Transactional(readOnly = true)
	public List<OngAdminSummary> getPedingOngs() {
		return ongRepository.findAllByStatusOrderByCreatedAtAsc(OngStatus.IN_REVIEW).stream().map(ong -> {
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
		if (newStatus != OngStatus.APPROVED && newStatus != OngStatus.REJECTED && newStatus != OngStatus.IN_REVIEW) {
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
