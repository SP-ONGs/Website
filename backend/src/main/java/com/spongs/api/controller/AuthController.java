package com.spongs.api.controller;

// Framework
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

// Repository
import com.spongs.api.repository.UserAccountRepository;

// DTO
import com.spongs.api.dto.CsrfResponse;
import com.spongs.api.dto.LoginResponse;
import com.spongs.api.dto.LoginRequest;

// Model
import com.spongs.api.model.UserAccount;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
	private final AuthenticationManager authenticationManager;
	private final SecurityContextRepository securityContextRepository;
	private final UserAccountRepository userAccountRepository;

	public AuthController(
			AuthenticationManager authenticationManager,
			SecurityContextRepository securityContextRepository,
			UserAccountRepository userAccountRepository) {
		this.authenticationManager = authenticationManager;
		this.securityContextRepository = securityContextRepository;
		this.userAccountRepository = userAccountRepository;
	}

	@GetMapping("/csrf")
	public CsrfResponse getCsrfResponse(CsrfToken csrfToken) {
		return new CsrfResponse(csrfToken.getToken());
	}

	@PostMapping("/login")
	public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest,
			HttpServletResponse httpResponse) {
		String email = request.email().trim().toLowerCase(java.util.Locale.ROOT);

		final Authentication authentication;

		try {
			authentication = authenticationManager
					.authenticate(new UsernamePasswordAuthenticationToken(email, request.password()));
		} catch (AuthenticationException exception) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(java.util.Map.of("message", "Invalid email or password."));
		}

		// Change session ID after authentication
		if (httpRequest.getSession(false) != null) {
			httpRequest.changeSessionId();
		}

		SecurityContext context = SecurityContextHolder.createEmptyContext();

		context.setAuthentication(authentication);
		SecurityContextHolder.setContext(context);

		// Save authentication
		securityContextRepository.saveContext(context, httpRequest, httpResponse);

		UserAccount account = userAccountRepository.findByEmail(email).orElseThrow();

		Long ongId = account.getOng() == null ? null : account.getOng().getId();

		return ResponseEntity.ok(new LoginResponse(account.getEmail(), account.getRole(), ongId));
	}

	@GetMapping("/me")
	public LoginResponse getCurrentAccount(@AuthenticationPrincipal UserDetails principal) {
		UserAccount account = userAccountRepository.findByEmail(principal.getUsername()).orElseThrow();

		Long ongId = account.getOng() == null ? null : account.getOng().getId();

		return new LoginResponse(account.getEmail(), account.getRole(), ongId);
	}

	@PostMapping("/logout")
	public ResponseEntity<Void> logout(HttpServletRequest request, HttpServletResponse response,
			Authentication authentication) {
		new SecurityContextLogoutHandler().logout(request, response, authentication);

		return ResponseEntity.noContent().build();
	}
}
