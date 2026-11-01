package com.spongs.api.service;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.*;
import java.util.UUID;

import javax.imageio.ImageIO;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ImageStorageService {
	private final Path uploadDirectory;

	public ImageStorageService(@Value("${spongs.upload-dir:uploads}") String uploadDir) {
		this.uploadDirectory = Paths.get(uploadDir).toAbsolutePath().normalize();
	}

	public String storeOngImage(MultipartFile file) {
		if (file == null || file.isEmpty()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "An ONG image is required.");
		}

		if (file.getSize() > 5L * 1024 * 1024) {
			throw new ResponseStatusException(HttpStatus.PAYLOAD_TOO_LARGE, "The image must be 5 MB or smaller");
		}

		try {
			BufferedImage image;

			try (InputStream input = file.getInputStream()) {
				image = ImageIO.read(input);
			}

			if (image == null) {
				throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The uploaded file is not a supported image.");
			}

			/*
			 * Check image aspect ratio (16:9)
			 * int width = image.getWidth();
			 * int height = image.getHeight();
			 * 
			 * if (width <= 0 || height <= 0 || Math.abs((double) width / height - (16.0 /
			 * 9.0)) > 0.01) {
			 * throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
			 * "The image must have a 16:9 aspect ratio.");
			 * }
			 */

			String format = detectFormat(file);

			String extension = switch (format) {
				case "png" -> ".png";
				case "jpeg" -> ".jpg";
				default ->
					throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only PNG and JPEG images are supported.");
			};

			Files.createDirectories(uploadDirectory);

			String filename = UUID.randomUUID() + extension;
			Path destination = uploadDirectory.resolve(filename).normalize();

			if (!destination.startsWith(uploadDirectory)) {
				throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid image filename");
			}

			try (InputStream input = file.getInputStream()) {
				Files.copy(input, destination, StandardCopyOption.REPLACE_EXISTING);
			}

			return "/uploads" + filename;
		} catch (ResponseStatusException exception) {
			throw exception;
		} catch (IOException exception) {
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not store the uploaded image.");
		}
	}

	private String detectFormat(MultipartFile file) throws IOException {
		try (InputStream input = file.getInputStream()) {
			var readers = ImageIO.getImageReaders(ImageIO.createImageInputStream(input));

			if (!readers.hasNext()) {
				throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported image format.");
			}

			String format = readers.next().getFormatName().toLowerCase();

			return switch (format) {
				case "jpg", "jpeg" -> "jpeg";
				case "png" -> "png";
				default -> format;
			};
		}
	}
}
