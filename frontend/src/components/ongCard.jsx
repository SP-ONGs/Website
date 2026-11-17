// -->  Variables <-- //

// API
import { cloudinaryResize } from "../api/imageUrl.js"

// Controller
import { getTagsFilter } from "../controllers/ongController.js"
import { setViewOngData } from "../controllers/viewOngController.js"

// Data
import tagsData from "../data/tagsData.json"

// CSS
import ongCardStyle from '../styles/ongCard.module.css'
import "../styles/tagsONG.css"

// Images
import blackRateIconImage from '../../images/elements_vectors/BlackRateIcon.png'

import instagramIconImage from "../../images/elements_vectors/InstagramIcon.png"
import whatsappIconImage from "../../images/elements_vectors/WhatsappIcon.png"
import websiteIconImage from "../../images/elements_vectors/WebsiteIcon.png"



// --> Functions <-- //

// Functions 1: ONG card component //
function OngCardComponent({ ong, currentTab, setCurrentModal, isAdmin }) {
	if (!ong) {
		return (<TemplateCardComponent />)
	}

	function onViewONG() {
		const IS_USER = !isAdmin

		// User: View ong
		if (IS_USER) {
			setViewOngData(ong)
			setCurrentModal("viewONG")
			return
		}

		// Admin: Ong dashboard
		if (currentTab == "AdminHomepage") {
			setCurrentModal("ongDashboard")
		}

		// Admin: Ong solicatitaion
		if (currentTab == "Solicitations") {
			setViewOngData(ong)
			setCurrentModal("ongSolitation")
		}
	}

	return (
		<div className={ongCardStyle.ongCard_container} onClick={onViewONG}>
			<CardImageComponent ongImageUrl={ong.imageUrl} />
			<CardTitleComponent ongName={ong.name} ongAverageRate={4.7} />
			<CardSocialMediaComponent />
			<CardTagsComponent tags={ong.tags} />
		</div>
	)
}

function TemplateCardComponent() {
	return (
		<div className={ongCardStyle.no_ong_template}></div>
	)
}


// Functions 2: Card image //
function CardImageComponent({ ongImageUrl }) {
	function onImageLoadError(e) {
		e.currentTarget.onerror = null
		e.currentTarget.src = ""
	}

	const finalImageUrl = cloudinaryResize(ongImageUrl, 400)

	return (
		<div className={ongCardStyle.ongCard_photo}>
			<div className={ongCardStyle.ongCard_photo_BG}></div>
			<img src={finalImageUrl} onError={onImageLoadError} />
		</div>
	)
}



// Functions 3: Card title //
function CardTitleComponent({ ongName, ongAverageRate }) {
	return (
		<div className={ongCardStyle.ongCard_title_container}>
			<h1>{ongName}</h1>
			<div className={ongCardStyle.ongCard_rate_container}>
				<img src={blackRateIconImage} />
				<h1>{ongAverageRate}</h1>
			</div>
		</div>
	)
}



// Functions 4: Card social media //
function CardSocialMediaComponent() {
	return (
		<div className={ongCardStyle.ongCard_socialmedia_container}>
			<div className={ongCardStyle.socialmedia_card}>
				<img src={instagramIconImage} />
				<h1>Instagram</h1>
			</div>
			<div className={ongCardStyle.socialmedia_card}>
				<img src={whatsappIconImage} />
				<h1>Whatsapp</h1>
			</div>
			<div className={[ongCardStyle.socialmedia_card, ongCardStyle.socialmedia_big_icon].join(" ")}>
				<img src={websiteIconImage} />
				<h1>Website</h1>
			</div>
		</div>
	)
}



// Functions 5: Card tags //
function CardTagsComponent({ tags }) {
	return (
		<div className={ongCardStyle.ongCard_tag_container}>
			{tags.map((tagData) => (
				<TagComponent key={tagData.id} tagName={tagData.description} />
			))}
		</div>
	)
}

function TagComponent({ tagName }) {
	let tagContainerStyle = ["tag_container", ongCardStyle.tag_container_size].join(" ")
	let tagDividerStyle = ["tag_divider_bar", ongCardStyle.tag_divider_size].join(" ")

	const TAG_IS_SELECTED = getTagsFilter().find(id => id == tagId)

	if (TAG_IS_SELECTED) {
		tagContainerStyle += " selected_tag_container"
		tagDividerStyle += " selected_tag_divider_bar"
	}

	const tagData = tagsData[tagName]

	return (
		<div className={tagContainerStyle}>
			<img src={tagData.image} />
			<div className={tagDividerStyle}></div>
			<label>{tagData.description}</label>
		</div>
	)
}



export default OngCardComponent
