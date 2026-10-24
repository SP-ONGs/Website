package com.spongs.api.config;

import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class UploadResourceConfig implements WebMvcConfigurer {
	private final String uploadDir;

	public UploadResourceConfig(@Value("${spongs.upload-dir:uploads}") String uploadDir) {
		this.uploadDir = uploadDir;
	}

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		Path directory = Paths.get(uploadDir).toAbsolutePath().normalize();

		registry.addResourceHandler("/upload/**").addResourceLocations(directory.toUri().toString());
	}
}
