// --> Variables <-- //

// API
import { updateOng as adminAPI_updateONG } from "../api/adminOng.js"
import { updateMyOng as ongOwnerAPI_updateONG } from "../api/ongOwner.js"

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

export function updateOng(newOngData, imageFile) {
	if (userRole == "ADMIN") {
		adminAPI_updateONG(newOngData.id, newOngData, imageFile)
	} else if (userRole == "ONG_OWNER") {
		ongOwnerAPI_updateONG(newOngData, imageFile)
	}
}
