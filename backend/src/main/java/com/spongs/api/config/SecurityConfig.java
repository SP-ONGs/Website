package com.spongs.api.config;

// Framework
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.web.csrf.CsrfTokenRepository;
import org.springframework.security.web.csrf.HttpSessionCsrfTokenRepository;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import static org.springframework.security.config.Customizer.withDefaults;

// Services
import com.spongs.api.service.AccountUserDetailsService;

// Java
import java.util.List;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {
	@Value("${app.cors.allowed-origins}")
	private List<String> allowedOrigins;

	@Bean
	public SecurityContextRepository securityContextRepository() {
		return new HttpSessionSecurityContextRepository();
	}

	@Bean
	public CsrfTokenRepository csrfTokenRepository() {
		return new HttpSessionCsrfTokenRepository();
	}

	@Bean
	public AuthenticationManager authenticatorManager(AuthenticationConfiguration configuration) throws Exception {
		return configuration.getAuthenticationManager();
	}

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http,
			SecurityContextRepository securityContextRepository, CsrfTokenRepository csrfTokenRepository)
			throws Exception {
		http.cors(withDefaults()).csrf(csrf -> csrf.csrfTokenRepository(csrfTokenRepository))
				.securityContext(context -> context.securityContextRepository(securityContextRepository))
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
						.sessionFixation(fixation -> fixation.changeSessionId()))
				.formLogin(form -> form.disable()).httpBasic(basic -> basic.disable())
				.authorizeHttpRequests(auth -> auth
						// Public authentication
						.requestMatchers("/api/auth/csrf", "/api/auth/login").permitAll()

						// Public ONG registration
						.requestMatchers(HttpMethod.POST, "/api/ongs").permitAll()

						// Public ONG catalogue
						.requestMatchers(HttpMethod.GET, "/api/ongs", "/api/ongs/**", "/api/tags", "/api/social-media")
						.permitAll()

						// Only admin routes
						.requestMatchers("/api/admin/**")
						.hasRole("ADMIN")

						// Only ONG owner routes
						.requestMatchers("/api/owner/**")
						.hasRole("ONG_OWNER")

						// All other routes (Require authentication)
						.anyRequest().authenticated());

		return http.build();
	}

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();

		configuration.setAllowedOrigins(allowedOrigins);
		configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
		configuration.setAllowedHeaders(List.of("Content-Type", "X-CSRF-TOKEN"));
		configuration.setAllowCredentials(true);

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);

		return source;
	}
}
