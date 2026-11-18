const loadedLocations = {}

export async function getEndressByCep(cep) {
	const loadedViaCep = loadedLocations[cep]

	if (loadedViaCep) {
		return loadedViaCep
	}

	const viaCep = await fetch(
		`https://viacep.com.br/ws/${cep}/json/`
	).then(res => res.json());

	loadedLocations[cep] = viaCep

	return viaCep
}

export async function getCoordinatesByCep(cep) {
	const viaCep = await getEndressByCep(cep)
	const mapEndress = `${viaCep.logradouro}, ${viaCep.localidade}, ${viaCep.uf}, Brasil`;

	const resultado = await fetch(
		`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(mapEndress)}`
	).then(res => res.json());

	if (resultado.length === 0) {
		throw new Error("Endereço não encontrado");
	}

	return {
		lat: parseFloat(resultado[0].lat),
		lon: parseFloat(resultado[0].lon)
	};
}
