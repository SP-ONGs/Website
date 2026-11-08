// --> Variables <-- //

// CSS
import signMediaStyle from "../styles/add_social_media.module.css"
import "../styles/social-media.css"
import "../styles/modals.css"

// Images
import addPhotoIconImage from "../../images/elements_vectors/AddPhotoIcon.png"

import instagramIconImage from "../../images/elements_vectors/InstagramIcon.png"
import whatsappIconImage from "../../images/elements_vectors/WhatsappIcon.png"
import websiteIconImage from "../../images/elements_vectors/WebsiteIcon.png"

import logoImage from "../../images/SPONGs_icon-nobg.png"
import closeIconImage from "../../images/elements_vectors/CloseIcon.png"



// --> Functions <-- //

// Functions 1: Add social media options //
export function SocialMediaOptions({ setMediaModal, setAddMedia }) {
	function onCloseOptions() {
		setMediaModal(null)
	}

	function onInstagramOption() {
		setAddMedia("instagram")
		setMediaModal("add_media")
	}

	function onWhatsappOption() {
		setAddMedia("whatsapp")
		setMediaModal("add_media")
	}

	function onWebsiteOption() {
		setAddMedia("website")
		setMediaModal("add_media")
	}

	return (
		<>
			<div className="focus_BG"></div>

			<div className={signMediaStyle.options_modal}>
				<div className={signMediaStyle.close_button} onClick={onCloseOptions}>
					<img src={closeIconImage} alt="Close button" />
				</div>

				<div className={signMediaStyle.options_brand}>
					<img src={logoImage} alt="SP ONGS logo" />
					<span>SP ONGS</span>
				</div>

				<h1>Selecione a Rede Social</h1>

				<div className={signMediaStyle.options_container}>
					<div className={[signMediaStyle.media_option, "instagram"].join(" ")} onClick={onInstagramOption} >
						<img src={instagramIconImage} className={signMediaStyle.media_icon} />
						<h2>Instagram</h2>
						<img src={addPhotoIconImage} className={signMediaStyle.add_icon} />
					</div>

					<div className={[signMediaStyle.media_option, "whatsapp"].join(" ")} onClick={onWhatsappOption} >
						<div className={signMediaStyle.option_fade}></div>
						<img src={whatsappIconImage} className={signMediaStyle.media_icon} />
						<h2>Whatsapp</h2>
						<img src={addPhotoIconImage} className={signMediaStyle.add_icon} />
					</div>

					<div className={[signMediaStyle.media_option, "website"].join(" ")} onClick={onWebsiteOption} >
						<div className={signMediaStyle.option_fade}></div>
						<img src={websiteIconImage} className={signMediaStyle.media_icon} />
						<h2>Website</h2>
						<img src={addPhotoIconImage} className={signMediaStyle.add_icon} />
					</div>
				</div>
			</div>
		</>
	)
}

function UpdateAddMediaButtonEnabled() {
	const addMediaButton = document.getElementById("signONG_addMidiaButton")
	const addMediaInput = document.getElementById("signONG_addMidiaInput")

	const CAN_ADD = addMediaInput.value !== ""

	if (!CAN_ADD) {
		addMediaButton.classList.add(signMediaStyle.add_media_button_disabled)
		return
	}

	addMediaButton.classList.remove(signMediaStyle.add_media_button_disabled)
}

export function SocialMediaInputModal({ setMediaModal, currentAddMedia, setSocialMediaList }) {
	const iconsList = {
		["instagram"]: instagramIconImage,
		["whatsapp"]: whatsappIconImage,
		["website"]: websiteIconImage,
	}
	const mediaTextList = {
		["instagram"]: "NOME DE USUÁRIO",
		["whatsapp"]: "NÚMERO DE TELEFONE",
		["website"]: "URL DO WEBSITE",
	}

	const mediaIcon = iconsList[currentAddMedia] || ""
	const titleText = mediaTextList[currentAddMedia] || ""

	function onCloseSignMedia() {
		setMediaModal(null)
	}

	function onAddMedia() {
		const addMediaInput = document.getElementById("signONG_addMidiaInput")
		const mediaValue = addMediaInput.value

		const IS_EMPTY = mediaValue === ""

		if (IS_EMPTY) {
			return
		}

		setSocialMediaList(previous => ({
			...previous,
			[currentAddMedia]: mediaValue
		}))
		setMediaModal(null)
	}

	return (
		<>
			<div className="focus_BG"></div>

			<div className={signMediaStyle.sign_media_modal}>
				<div className={signMediaStyle.big_close_button} onClick={onCloseSignMedia}>
					<img src={closeIconImage} alt="Close button" />
				</div>

				<div className={signMediaStyle.add_media_brand}>
					<img src={logoImage} alt="SP ONGS logo" />
					<span>SP ONGS</span>
				</div>

				<div className={signMediaStyle.sign_media_container}>
					<div className={[signMediaStyle.media_icon_view, currentAddMedia].join(" ")}>
						<img src={mediaIcon} />
					</div>

					<div className={signMediaStyle.media_input_container}>
						<h1>{titleText}</h1>
						<div className={signMediaStyle.media_input}>
							<input id="signONG_addMidiaInput" type="text" onChange={UpdateAddMediaButtonEnabled} />
						</div>
					</div>
				</div>

				<div id="signONG_addMidiaButton" onClick={onAddMedia}
					className={[signMediaStyle.add_media_button, signMediaStyle.add_media_button_disabled].join(" ")}>
					<label>Adicionar</label>
				</div>
			</div >
		</>
	)
}
