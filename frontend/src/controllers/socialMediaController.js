// --> Variables <-- //

// API
import { getSocialMediaTypes } from "../api/ongs"

// Values
let socialMediaTypes



// --> Functions <-- //

// Functions 1: Sync social media options // --
export async function getSocialMediaOptions() {
	if (socialMediaTypes) {
		return socialMediaTypes
	}

	const response = await getSocialMediaTypes()
	socialMediaTypes = response

	return socialMediaTypes
}

export async function getSocialMediaId(socialMediaName) {
	const options = await getSocialMediaOptions()

	for (const socialMediaOption of options) {
		if (socialMediaOption.name.toLowerCase() === socialMediaName) {
			return socialMediaOption.id
		}
	}

	return undefined
}
