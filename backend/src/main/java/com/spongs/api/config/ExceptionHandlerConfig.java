package com.spongs.api.config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.spongs.api.exception.EmailAlreadyExistsException;

import java.util.Map;

@RestControllerAdvice
public class ExceptionHandlerConfig {
	@ExceptionHandler(IllegalArgumentException.class)
	public ResponseEntity<Map<String, String>> handleInvalidRequest(IllegalArgumentException exception) {
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", exception.getMessage()));
	}

	@ExceptionHandler(EmailAlreadyExistsException.class)
	public ResponseEntity<Map<String, String>> handleEmailAlreadyExists(EmailAlreadyExistsException exception) {
		return ResponseEntity.status(HttpStatus.CONFLICT)
				.body(Map.of("code", "EMAIL_ALREADY_EXISTS", "message", exception.getMessage()));
	}
}
