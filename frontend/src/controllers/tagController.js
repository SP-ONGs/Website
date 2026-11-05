// --> Variables <-- //

// API
import { getTags } from "../api/ongs"

// Values
let tagsData



// --> Functions <-- //

// Functions 1: Sync social media options // --
export async function getTagsData() {
	if (tagsData) {
		return tagsData
	}

	const response = await getTags()
	tagsData = response

	return tagsData
}

export async function getTagId(tagName) {
	const options = await getTagsData()

	for (const tagOption of options) {
		if (tagOption.description === tagName) {
			return tagOption.id
		}
	}

	return undefined
}
