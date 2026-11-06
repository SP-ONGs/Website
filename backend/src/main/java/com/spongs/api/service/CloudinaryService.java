package com.spongs.api.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Service
public class CloudinaryService {

	private static final long MAX_FILE_SIZE = 5 * 1024 * 1024;

	private final Cloudinary cloudinary;

	public CloudinaryService(Cloudinary cloudinary) {
		this.cloudinary = cloudinary;
	}

	public record UploadedImage(String url, String publicId) {
	}

	public UploadedImage uploadOngImage(MultipartFile file) {

		validateImage(file);

		try {
			Map<?, ?> result = cloudinary.uploader().upload(
					file.getBytes(),
					ObjectUtils.asMap(
							"folder", "sp-ongs/ongs",
							"public_id", UUID.randomUUID().toString(),
							"resource_type", "image",
							"overwrite", false));

			String url = (String) result.get("secure_url");
			String publicId = (String) result.get("public_id");

			if (url == null || publicId == null) {
				throw new IllegalStateException(
						"Cloudinary did not return the image URL and public ID.");
			}

			return new UploadedImage(url, publicId);

		} catch (IOException e) {
			throw new IllegalStateException("Could not upload image to Cloudinary.", e);
		}
	}

	public void deleteImage(String publicId) {

		if (publicId == null || publicId.isBlank()) {
			return;
		}

		try {
			Map<?, ?> result = cloudinary.uploader().destroy(
					publicId,
					ObjectUtils.asMap("resource_type", "image"));

			if (!"ok".equals(result.get("result"))
					&& !"not found".equals(result.get("result"))) {
				throw new IllegalStateException(
						"Cloudinary could not delete image: " + result);
			}

		} catch (IOException e) {
			throw new IllegalStateException("Could not delete image from Cloudinary.", e);
		}
	}

	private void validateImage(MultipartFile file) {

		if (file == null || file.isEmpty()) {
			throw new IllegalArgumentException("An image is required.");
		}

		if (file.getSize() > MAX_FILE_SIZE) {
			throw new IllegalArgumentException("Image must be 5 MB or smaller.");
		}

		/*
		 * try {
		 * BufferedImage image = ImageIO.read(
		 * new ByteArrayInputStream(file.getBytes()));
		 * 
		 * if (image == null) {
		 * throw new
		 * IllegalArgumentException("The uploaded file is not a valid image.");
		 * }
		 * 
		 * int width = image.getWidth();
		 * int height = image.getHeight();
		 * 
		 * // Allow a small tolerance around a 16:9 aspect ratio.
		 * double ratio = (double) width / height;
		 * 
		 * if (Math.abs(ratio - (16.0 / 9.0)) > 0.03) {
		 * throw new IllegalArgumentException(
		 * "ONG image must have a 16:9 aspect ratio.");
		 * }
		 * 
		 * } catch (IOException e) {
		 * throw new IllegalArgumentException("Could not read uploaded image.", e);
		 * }
		 */
	}
}
