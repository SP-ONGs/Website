export function deepEqual(a, b) {
	if (a === b) return true

	// null, primitives, or different types
	if (a == null || b == null || typeof a !== "object" || typeof b !== "object") {
		return false
	}

	if (Array.isArray(a) !== Array.isArray(b)) return false

	const keysA = Object.keys(a)
	const keysB = Object.keys(b)

	if (keysA.length !== keysB.length) return false

	return keysA.every((key) =>
		Object.prototype.hasOwnProperty.call(b, key) && deepEqual(a[key], b[key])
	)
}
