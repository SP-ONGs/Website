export function getInstagramUrl(value) {
	if (!value) return null
	const trimmed = value.trim()

	// Already a full URL: only accept instagram.com
	if (/^https?:\/\//i.test(trimmed)) {
		try {
			const url = new URL(trimmed)
			return url.hostname.endsWith("instagram.com") ? url.href : null
		} catch {
			return null
		}
	}

	const handle = trimmed.replace(/^@/, "")
	return `https://www.instagram.com/${encodeURIComponent(handle)}/`
}

export function getWhatsappUrl(value) {
	if (!value) return null

	// Keep only digits: "11 2642-7395" -> "1126427395"
	let digits = String(value).replace(/\D/g, "")

	// Remove a leading 0 (some people write 011...)
	digits = digits.replace(/^0+/, "")

	// Brazilian numbers without country code: 10 digits (landline) or 11 (mobile)
	if (digits.length === 10 || digits.length === 11) {
		digits = "55" + digits
	}

	// Sanity check: 55 + DDD + 8 or 9 digits = 12 or 13 digits
	if (digits.length < 12 || digits.length > 13) return null

	return `https://wa.me/${digits}`
}
