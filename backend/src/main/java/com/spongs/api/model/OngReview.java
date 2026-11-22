package com.spongs.api.model;

import java.time.Instant;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "ong_review")
public class OngReview {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "ong_id", nullable = false)
	private Ong ong;

	@Column(name = "author_name", nullable = false, length = 80)
	private String authorName;

	@Column(nullable = false)
	private int rating;

	@Column(length = 1000)
	private String comment;

	@CreationTimestamp
	@Column(name = "created_at", nullable = false, updatable = false)
	private Instant createdAt;

	protected OngReview() {
	}

	public OngReview(Ong ong, String authorName, int rating, String comment) {
		this.ong = ong;
		this.authorName = authorName;
		this.rating = rating;
		this.comment = comment;
	}

	public Long getId() {
		return id;
	}

	public Ong getOng() {
		return ong;
	}

	public String getAuthorName() {
		return authorName;
	}

	public int getRating() {
		return rating;
	}

	public String getComment() {
		return comment;
	}

	public Instant getCreatedAt() {
		return createdAt;
	}
}