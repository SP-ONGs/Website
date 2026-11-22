// --> Variables <-- //

// API
import { getTags } from "../api/ongs"

// Values
let tagsData



// --> Functions <-- //

// Functions 1: Sync tags options // --
export async function getTagsData() {
	if (!tagsData) {
		const response = await getTags()
		tagsData = response
	}

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

export async function getTagName(tagId) {
	const options = await getTagsData()

	for (const tagOption of options) {
		if (tagOption.id === tagId) {
			return tagOption.description
		}
	}

	return undefined
}
