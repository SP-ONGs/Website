// --> Variables <-- //

// React
import { useState } from 'react'

// CSS
import filterBarStyles from '../styles/filterBar.module.css'
import "../styles/tagsONG.css"

// Images
import filterIconImage from '../../images/elements_vectors/FilterIcon.png'

import petTagIconImage from "../../images/elements_vectors/PetTagIcon.png"
import voluntarioTagIconImage from "../../images/elements_vectors/VoluntarioTagIcon.png"
import donationTagIconImage from "../../images/elements_vectors/DonationTagIcon.png"



// --> Functions <-- //

// Functions 1: Filter bar component //
function FilterBarComponent() {
	const [tagList, setTagList] = useState({})
	const tagContainerStyle = ["tag_container", "selectable_tag", filterBarStyles.tag_container_size].join(" ")

	function setTagValue(tagName, value) {
		setTagList(previous => ({
			...previous,
			[tagName]: value
		}))
	}

	function toggleTagSelected(tagName) {
		const tagElement = document.getElementById("filterbar_tag_" + tagName)
		const tagDividerLement = tagElement.querySelector(":scope > div")

		const SELECT_TAG = !tagList[tagName]

		if (SELECT_TAG) {
			tagElement.classList.add("selected_tag_container")
			tagDividerLement.classList.add("selected_tag_divider_bar")

			setTagValue(tagName, true)
		} else {
			tagElement.classList.remove("selected_tag_container")
			tagDividerLement.classList.remove("selected_tag_divider_bar")

			setTagValue(tagName, false)
		}
	}

	return (
		<div className={filterBarStyles.filter_bar_container}>
			<div className={filterBarStyles.filter_title}>
				<img src={filterIconImage} />
				<h1>Filtrar</h1>
			</div>

			<button className={tagContainerStyle} id="filterbar_tag_pet" onClick={() => toggleTagSelected("pet")}>
				<img src={petTagIconImage} alt="Pet" />
				<div className="tag_divider_bar"></div>
				<label>Animais</label>
			</button>

			<button className={tagContainerStyle} id="filterbar_tag_voluntario" onClick={() => toggleTagSelected("voluntario")}>
				<img src={voluntarioTagIconImage} alt="Voluntário" />
				<div className="tag_divider_bar"></div>
				<label>Voluntário</label>
			</button>

			<button className={tagContainerStyle} id="filterbar_tag_doacao" onClick={() => toggleTagSelected("doacao")}>
				<img src={donationTagIconImage} alt="Doação" />
				<div className="tag_divider_bar"></div>
				<label>Doação</label>
			</button>
		</div>
	)
}



export default FilterBarComponent
