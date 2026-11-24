// -->  Variables <-- //

// API
import { cloudinaryResize } from "../api/imageUrl.js"

// Controller
import { getTagsFilter } from "../controllers/ongController.js"
import { setViewOngData } from "../controllers/viewOngController.js"
import { setDashboardOngData, setUserRole as ongDashboard_setUserRole } from "../controllers/ongDashboardController.js"

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
function OngCardComponent({ ongData, currentTab, setCurrentModal, isAdmin, isClicable = true }) {
	if (!ongData) {
		return (<TemplateCardComponent />)
	}

	let cardStyle = ongCardStyle.ongCard_container

	if (isClicable) {
		cardStyle += ` ${ongCardStyle.clicable_card}`
	}

	function onViewONG() {
		if (!isClicable) {
			return
		}

		const IS_USER = !isAdmin

		// User: View ongData
		if (IS_USER) {
			setViewOngData(ongData)
			setCurrentModal("viewONG")
			return
		}

		// Admin: Ong dashboard
		if (currentTab == "AdminHomepage") {
			ongDashboard_setUserRole("ADMIN")
			setDashboardOngData(ongData)
			setCurrentModal("ongDashboard")
			return
		}

		// Admin: Ong solicatitaion
		if (currentTab == "Solicitations") {
			setViewOngData(ongData)
			setCurrentModal("ongSolitation")
		}
	}

	const reviewsSummary = ongData.reviewsSummary
	const ongAverageRate = reviewsSummary.total == 0 && "--" || reviewsSummary.average

	return (
		<div className={cardStyle} onClick={onViewONG}>
			<CardImageComponent ongImageUrl={ongData.imageUrl} />
			<CardTitleComponent ongName={ongData.name} ongAverageRate={ongAverageRate} />
			<CardSocialMediaComponent />
			<CardTagsComponent tags={ongData.tags} />
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
				<TagComponent key={tagData.id} tag={tagData} />
			))}
		</div>
	)
}

function TagComponent({ tag }) {
	let tagContainerStyle = ["tag_container", ongCardStyle.tag_container_size].join(" ")
	let tagDividerStyle = ["tag_divider_bar", ongCardStyle.tag_divider_size].join(" ")

	const TAG_IS_SELECTED = getTagsFilter().find(id => id == tag.id)

	if (TAG_IS_SELECTED) {
		tagContainerStyle += " selected_tag_container"
		tagDividerStyle += " selected_tag_divider_bar"
	}

	const tagData = tagsData[tag.description]

	return (
		<div className={tagContainerStyle}>
			<img src={tagData.image} />
			<div className={tagDividerStyle}></div>
			<label>{tagData.description}</label>
		</div>
	)
}



export default OngCardComponent
