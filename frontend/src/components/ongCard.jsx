// -->  Variables <-- //

// API
import { cloudinaryResize } from "../api/imageUrl.js"

// CSS
import ongCardStyle from '../styles/ongCard.module.css'
import "../styles/tagsONG.css"

// Images
import blackRateIconImage from '../../images/elements_vectors/BlackRateIcon.png'

import instagramIconImage from "../../images/elements_vectors/InstagramIcon.png"
import whatsappIconImage from "../../images/elements_vectors/WhatsappIcon.png"
import websiteIconImage from "../../images/elements_vectors/WebsiteIcon.png"

import petTagIconImage from "../../images/elements_vectors/PetTagIcon.png"
import voluntarioTagIconImage from "../../images/elements_vectors/VoluntarioTagIcon.png"
import donationTagIconImage from "../../images/elements_vectors/DonationTagIcon.png"



// --> Functions <-- //

// Functions 1: ONG card component //
function ongCardComponent({ ong, setCurrentModal, isAdmin }) {
	if (!ong) {
		return (
			<div className={ongCardStyle.no_ong_template}></div>
		)
	}

	function onViewONG() {
		if (isAdmin) {
			return
		}

		setCurrentModal("viewONG")
	}

	const tagContainerStyle = ["tag_container", ongCardStyle.tag_container_size].join(" ")
	const tagDividerStyle = ["tag_divider_bar", ongCardStyle.tag_divider_size].join(" ")

	console.log("ong:", ong)

	return (
		<div className={ongCardStyle.ongCard_container} onClick={onViewONG}>
			<CardImageComponent ongImageUrl={ong.imageUrl} />
			<CardTitleComponent ongName={ong.name} ongAverageRate={4.7} />

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

			<div className={ongCardStyle.ongCard_tag_container}>
				<div className={tagContainerStyle}>
					<img src={petTagIconImage} alt="Pet" />
					<div className={tagDividerStyle}></div>
					<label>Animais</label>
				</div>

				<div className={tagContainerStyle}>
					<img src={voluntarioTagIconImage} alt="Voluntário" />
					<div className={tagDividerStyle}></div>
					<label>Voluntário</label>
				</div>

				<div className={tagContainerStyle}>
					<img src={donationTagIconImage} alt="Doação" />
					<div className={tagDividerStyle}></div>
					<label>Doação</label>
				</div>
			</div>
		</div>
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



// Function 3: Card title //
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



export default ongCardComponent
