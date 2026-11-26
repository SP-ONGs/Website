// --> Variables <-- //

// API
import { updateOng as adminAPI_updateONG, removeOng as adminAPI_deleteONG } from "../api/adminOng.js"
import { updateMyOng as ongOwnerAPI_updateONG, requestMyOngRemoval as ongOwnerAPI_deleteONG } from "../api/ongOwner.js"

// Values
let currentOngData
let userRole



// --> Functions <-- //

// Functions 1: Get/Set current ONG //
export function getDashboardOngData() {
	return currentOngData
}

export function setDashboardOngData(ongData) {
	currentOngData = ongData
}



// Functions 2: Update ONG //
export function setUserRole(role) {
	userRole = role
}

export async function updateOng(ongId, updateOngPayload, imageFile) {
	if (userRole == "ADMIN") {
		await adminAPI_updateONG(ongId, updateOngPayload, imageFile)
	} else if (userRole == "ONG_OWNER") {
		await ongOwnerAPI_updateONG(updateOngPayload, imageFile)
	}
}

export async function deleteOng(ongId) {
	if (userRole == "ADMIN") {
		await adminAPI_deleteONG(ongId)
	} else if (userRole == "ONG_OWNER") {
		await ongOwnerAPI_deleteONG()
	}
}
