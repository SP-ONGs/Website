// --> Variables <-- //

// API
import { getPublicOngs } from "../api/ongs.js"
import { getPendingOngs } from "../api/adminOng.js"

// Controllers
import { getTagId } from "./tagController.js"

// Values
const loadedOngs = {}
let ongState = {
	inLoading: false,
	displayOngs: []
}

let useFilter = false
let nameFilter
let tagsFilter = []
let inFilterOngs = []

let cardsAmount = 6
let currentIndex = 1
let ongType = "Public"

const listeners = new Set()



// --> Functions <-- //

// Functions 1: Get ongs //
async function getLoadedPublicOngs() {
	if (!loadedOngs["Public"]) {
		ongState.inLoading = true
		loadedOngs["Public"] = await getPublicOngs()
		ongState.inLoading = false
	}

	return loadedOngs["Public"]
}

async function getLoadedPendingOngs() {
	if (!loadedOngs["Pending"]) {
		ongState.inLoading = true
		loadedOngs["Pending"] = await getPendingOngs()
		ongState.inLoading = false
	}

	return loadedOngs["Pending"]
}

export async function refreshOngs() {
	const firstOng = 0 + (currentIndex - 1) * cardsAmount
	const lastOng = firstOng + cardsAmount

	const referenceOngList = useFilter && inFilterOngs || ongType === "Public" && await getLoadedPublicOngs() || await getLoadedPendingOngs()
	const newOngList = referenceOngList.slice(firstOng, lastOng)

	updateOngState({ displayOngs: newOngList })
}

export function getOngsSnapshot() {
	return ongState
}

export function addOngCard(listener) {
	listeners.add(listener)
	return () => listeners.delete(listener)
}

export function updateOngState(patch) {
	ongState = { ...ongState, ...patch }
	listeners.forEach((l) => l())
}



// Function 2: Update variables //
export function usePendingOngs(isPending) {
	ongType = isPending && "Pending" || "Public"

	useFilter = false
	nameFilter
	tagsFilter = []
	inFilterOngs = []
}

export function updateCurrentIndex(newIndex) {
	currentIndex = newIndex
}

export function updateCardsAmount(newCardsAmount) {
	cardsAmount = newCardsAmount
}



// Functions 3: Filter //
async function doFilter() {
	const USE_NAME_FILTER = nameFilter && nameFilter !== ""
	const USE_TAG_FILTER = tagsFilter.length == 0

	useFilter = USE_NAME_FILTER || USE_TAG_FILTER

	if (!useFilter) {
		return
	}

	const ongsList = ongType === "Public" && await getLoadedPublicOngs() || await getLoadedPendingOngs()
	const newFilteredOngs = []

	function ongInTagFilter(ong) {
		if (!USE_TAG_FILTER) {
			return true
		}

		for (const tagId of tagsFilter) {
			const IN_TAG_FILTER = !USE_TAG_FILTER || ong.tagIds.find(tagId)

			if (IN_TAG_FILTER) {
				return true
			}
		}

		return false
	}

	for (const ong of ongsList) {
		const IN_NAME_FILTER = !USE_NAME_FILTER || ong.name.toLowerCase().includes(nameFilter)
		const IN_TAG_FILTER = ongInTagFilter(ong)

		if (IN_NAME_FILTER && IN_TAG_FILTER) {
			newFilteredOngs.append(ong)
		}
	}
}

export function updateNameFilter(name) {
	const USE_NAME_FILTER = name.trim() !== ""

	nameFilter = USE_NAME_FILTER && name.trim() || undefined

	doFilter()
	refreshOngs()
}

export function addTagInFilter(tagName) {
	const tagId = getTagId(tagName)

	tagsFilter.append(tagId)

	doFilter()
	refreshOngs()
}

export function removeTagFromFilter(tagName) {
	const tagId = getTagId(tagName)
	const newTagsFilter = tagsFilter.filter(item => item !== tagId)

	tagsFilter = newTagsFilter

	doFilter()
	refreshOngs()
}
