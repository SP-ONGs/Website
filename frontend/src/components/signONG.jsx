// --> Variables <-- //

// React
import { useState } from "react"

// API
import { registerOng } from "../api/ongs.js"
import { login, logout } from "../api/session"
import { getMyOng } from "../api/ongOwner.js"

// Data
import tagsData from "../data/tagsData.json"

// Controllers
import { getCepData } from "../controllers/locationController.js"
import { getSocialMediaId } from "../controllers/socialMediaController.js"
import { getTagId } from "../controllers/tagController.js"
import { setDashboardOngData, setUserRole as ongDashboard_setUserRole } from "../controllers/ongDashboardController.js"

// Components
import { SocialMediaOptions, SocialMediaInputModal } from "./addSocialMedia.jsx"

// CSS
import signStyle from "../styles/signONG.module.css"
import "../styles/social-media.css"
import "../styles/modals.css"
import "../styles/tagsONG.css"

// Images
import addPhotoIconImage from "../../images/elements_vectors/AddPhotoIcon.png"
import locationIconImage from "../../images/elements_vectors/LocationIcon.png"
import invalidLocationIconImage from "../../images/elements_vectors/InvalidLocationIcon.png"

import addGreyIconImage from "../../images/elements_vectors/AddGreyIcon.png"
import cancelMediaIconImage from "../../images/elements_vectors/CancelMediaIcon.png"
import instagramIconImage from "../../images/elements_vectors/InstagramIcon.png"
import whatsappIconImage from "../../images/elements_vectors/WhatsappIcon.png"
import websiteIconImage from "../../images/elements_vectors/WebsiteIcon.png"

import hideIconImage from "../../images/elements_vectors/HideIcon.png"
import nonHideIconImage from "../../images/elements_vectors/NonHideIcon.png"

import logoImage from "../../images/SPONGs_icon-nobg.png"
import closeIconImage from "../../images/elements_vectors/CloseIcon.png"

// Values
let inSignLoading = false



// --> Functions <-- //

// Functions 1: Sign ONG component //
function SignONGComponent({ currentModal, setCurrentModal }) {
	const [currentMediaModal, setMediaModal] = useState(null)
	const [currentAddMedia, setAddMedia] = useState(null)

	const [ongCEP, setOngCEP] = useState(undefined)
	const [socialMediaList, setSocialMediaList] = useState({})
	const [tagList, setTagList] = useState({})

	function addSocialMedia(mediaName, mediaValue) {
		setSocialMediaList(previous => ({
			...previous,
			[mediaName]: mediaValue
		}))
	}

	const [imageFile, setImageFile] = useState(undefined)

	return (
		currentModal === "signONG" && (
			<>
				<div className="focus_BG"></div>

				<div className={signStyle.signONG_modal}>
					<div className={signStyle.left_box}>
						<AddNameContainer setOngCEP={setOngCEP} setImageFile={setImageFile} />
						<AddSocialMediaContainer setMediaModal={setMediaModal} socialMediaList={socialMediaList} setSocialMediaList={setSocialMediaList} />
						<AddTagContainer tagList={tagList} setTagList={setTagList} />
					</div>

					<div className={signStyle.divide_bar}></div>

					<div className={signStyle.right_box}>
						<CloseModalButton setCurrentModal={setCurrentModal} />

						<SPONGS_Brand />

						<h2 className={signStyle.sign_text}>Adicione as informações para cadastrar a sua ONG</h2>
						<SignInputsContainer />
						<SignButtonComponent setCurrentModal={setCurrentModal} ongCEP={ongCEP} socialMediaList={socialMediaList} tagList={tagList} imageFile={imageFile} />
					</div>
				</div>

				{currentMediaModal === "options" && (
					<SocialMediaOptions setMediaModal={setMediaModal} setAddMedia={setAddMedia} />
				)}

				{currentMediaModal === "add_media" && (
					<SocialMediaInputModal setMediaModal={setMediaModal} currentAddMedia={currentAddMedia} addSocialMediaFunction={addSocialMedia} />
				)}
			</>
		)
	)
}

// Functions 2: Sign button component //
function setError(element, isError) {
	if (isError) {
		element.classList.add(signStyle.error_outline)
		return
	}

	element.classList.remove(signStyle.error_outline)
}

function setEmailExistsError(inError) {
	const emailInput = document.getElementById("signONG_email")
	const emailLabel = emailInput.parentElement.querySelector("label")

	setError(emailInput.parentElement, inError)

	if (inError) {
		emailLabel.textContent = "EMAIL JÁ CADASTRADO, UTILIZE OUTRO EMAIL!"
		emailLabel.parentElement.classList.add(signStyle.input_error_warn)
	} else {
		emailLabel.textContent = "EMAIL"
		emailLabel.parentElement.classList.remove(signStyle.input_error_warn)
	}
}

function ResetErrors() {
	const nameInput = document.getElementById("signONG_name")
	const cepInput = document.getElementById("signONG_cep")
	const imageInput = document.getElementById("signOng_image_input")

	const midiaContainer = document.getElementsByClassName(signStyle.midia_container)[0]

	const confirmPasswordInput = document.getElementById("signONG_confirm_password")
	const cnpjInput = document.getElementById("signONG_cnpj")

	setError(cnpjInput.parentElement, false)
	setError(nameInput.parentElement, false)
	setError(cepInput.parentElement, false)
	setError(imageInput.parentElement, false)
	setError(midiaContainer, false)
	setError(confirmPasswordInput.parentElement, false)

	setEmailExistsError(false)
}

async function signLoadingAnimation() {
	const signButton = document.getElementById("signONG_sign_button")
	let reticencesText = ""

	for (let i = 0; i < 4; i++) {
		if (!inSignLoading) {
			break
		}

		signButton.textContent = "Carregando" + reticencesText + ""
		reticencesText += "."

		await new Promise(resolve => setTimeout(resolve, 250))
	}

	await new Promise(resolve => setTimeout(resolve, 200))

	if (inSignLoading) {
		signLoadingAnimation()
	}
}

async function OnSign(setCurrentModal, ongCEP, socialMediaList, tagList, imageFile) {
	if (inSignLoading) {
		return
	}

	const nameInput = document.getElementById("signONG_name")
	const cepInput = document.getElementById("signONG_cep")
	const houseNumberInput = document.getElementById("signONG_houseNumber")
	const imageInput = document.getElementById("signOng_image_input")

	const midiaContainer = document.getElementsByClassName(signStyle.midia_container)[0]

	const emailInput = document.getElementById("signONG_email")
	const passwordInput = document.getElementById("signONG_password")
	const confirmPasswordInput = document.getElementById("signONG_confirm_password")

	// Check if has email and password
	const HAVE_EMAIL = emailInput.value !== ""
	const HAVE_PASSWORD = passwordInput.value !== "" && confirmPasswordInput.value !== ""

	if (!HAVE_EMAIL || !HAVE_PASSWORD) {
		return
	}

	// Update error outlines
	const ongName = nameInput.value
	const houseNumber = houseNumberInput.value

	const NAME_IS_VALID = ongName !== ""
	const CEP_IS_VALID = ongCEP !== undefined
	const HOUSE_NUMBER_IS_VALID = houseNumber !== ""

	setError(nameInput.parentElement, !NAME_IS_VALID)
	setError(cepInput.parentElement, !CEP_IS_VALID)
	setError(houseNumberInput.parentElement, !HOUSE_NUMBER_IS_VALID)

	const socialKeys = Object.entries(socialMediaList).filter(([_, value]) => value !== undefined)
	const HAS_SOCIAL_MEDIA = socialKeys.length > 0
	setError(midiaContainer, !HAS_SOCIAL_MEDIA)

	const IS_SAME_PASSWORD = passwordInput.value === confirmPasswordInput.value
	setError(confirmPasswordInput.parentElement, !IS_SAME_PASSWORD)

	const IMAGE_IS_VALID = imageFile !== undefined
	setError(imageInput.parentElement, !IMAGE_IS_VALID)

	// CNPJ is optional, but when filled it must have 14 digits
	const cnpjInput = document.getElementById("signONG_cnpj")
	const ongCnpj = cnpjInput.value.replace(/\D/g, "")
	const CNPJ_IS_VALID = ongCnpj === "" || ongCnpj.length === 14
	setError(cnpjInput.parentElement, !CNPJ_IS_VALID)

	// Check if can sign ONG
	const CAN_SIGN_ONG = NAME_IS_VALID && CEP_IS_VALID && HAS_SOCIAL_MEDIA && IS_SAME_PASSWORD && IMAGE_IS_VALID && CNPJ_IS_VALID

	if (!CAN_SIGN_ONG) {
		return
	}

	// Convert relations IDs (tags and social media)
	const ongSocialMedia = []
	const ongTagsIds = []

	for (const socialMediaName in socialMediaList) {
		const socialMediaId = await getSocialMediaId(socialMediaName)
		const description = socialMediaList[socialMediaName]

		if (!socialMediaId) {
			console.log(`Failed to find ${socialMediaName} id!!!`)
			continue
		}

		ongSocialMedia.push({
			"socialMediaId": socialMediaId,
			"description": description
		})
	}

	for (const tagName in tagList) {
		if (!tagList[tagName]) {
			continue
		}

		const tagId = await getTagId(tagName)

		if (!tagId) {
			console.log(`Failed to find ${tagName} id!!!`)
			continue
		}

		ongTagsIds.push(tagId)
	}

	// Send sign request to backend
	const payload = {
		"email": emailInput.value,
		"password": passwordInput.value,
		"name": ongName,
		"cep": ongCEP,
		"houseNumber": houseNumber,
		"cnpj": ongCnpj === "" ? null : ongCnpj,
		"socialMedia": ongSocialMedia,
		"tagIds": ongTagsIds
	}

	const signButton = document.getElementById("signONG_sign_button")

	signButton.textContent = "Carregando"
	inSignLoading = true

	UpdateSignButtonEnabled()
	signLoadingAnimation()

	try {
		// Register ONG
		await registerOng(payload, imageFile)

		// Login in new ONG
		const loginReponse = await login(emailInput.value, passwordInput.value)
		const SUCCESS_LOGIN_ONG = loginReponse?.role === "ONG_OWNER"

		if (!SUCCESS_LOGIN_ONG) {
			try { await logout() } catch { }
			throw new Error("Not an ONG account")
		}

		const ongData = await getMyOng()

		// Open ONG dashboard
		ongDashboard_setUserRole("ONG_OWNER")
		setDashboardOngData(ongData)

		setCurrentModal("ongDashboard")
	} catch (error) {
		if (error.code == "EMAIL_ALREADY_EXISTS") {
			setEmailExistsError(true)
		}
	}

	signButton.textContent = "Cadastrar"
	inSignLoading = false

	UpdateSignButtonEnabled()
}

function UpdateSignButtonEnabled() {
	const emailInput = document.getElementById("signONG_email")
	const passwordInput = document.getElementById("signONG_password")
	const confirmPasswordInput = document.getElementById("signONG_confirm_password")

	const signButton = document.getElementById("signONG_sign_button")

	// Check if has email and password
	const HAVE_EMAIL = emailInput.value !== ""
	const HAVE_PASSWORD = passwordInput.value !== "" && confirmPasswordInput.value !== ""

	const CAN_SIGNIN = HAVE_EMAIL & HAVE_PASSWORD

	if (CAN_SIGNIN && !inSignLoading) {
		signButton.classList.remove(signStyle.signin_button_disabled)
		return
	}

	signButton.classList.add(signStyle.signin_button_disabled)
}

function SignButtonComponent({ setCurrentModal, ongCEP, socialMediaList, tagList, imageFile }) {
	return (
		<button
			className={[signStyle.signin_button, signStyle.signin_button_disabled].join(" ")}
			onClick={() => OnSign(setCurrentModal, ongCEP, socialMediaList, tagList, imageFile)}
			id="signONG_sign_button"
		>Cadastrar</button>
	)
}



// Functions 3: Left-side (ONG information) //
function AddNameContainer({ setOngCEP, setImageFile }) {
	const [cepIsInvalid, setCepIsInvalid] = useState(false)
	const [currentCepData, setCepData] = useState(null)
	const [currentHouseNumber, setHouseNumber] = useState(null)

	let lastUpdatedCEP
	let cepIsLoading = false

	function setCepInvalid(isInvalid) {
		const locationContainerElement = document.getElementsByClassName(signStyle.location_container)[0]

		if (isInvalid) {
			setCepIsInvalid(true)
			locationContainerElement.classList.add("invalid_location")
		} else {
			setCepIsInvalid(false)
			locationContainerElement.classList.remove("invalid_location")
		}
	}

	function updateCepText(cepData, houseNumber) {
		let streetText = `${cepData.logradouro}`
		const cityText = `, ${cepData.localidade}` //, ${cepData.uf}`

		if (houseNumber) {
			streetText += ` ${houseNumber}`
		}

		const locationTextElement = document.getElementById("signONG_location_text")
		const locationText = streetText + cityText

		locationTextElement.textContent = locationText
	}

	async function updateCEP() {
		const cepInputElement = document.getElementById("signONG_cep")
		const locationTextElement = document.getElementById("signONG_location_text")

		/* Update text */
		const cep = cepInputElement.value.replace(/\D/g, "").substring(0, 8)
		cepInputElement.value = cep

		const IS_SAME_CEP = lastUpdatedCEP == cep
		const CEP_ENOUGH_DIGITS = cep.length >= 8

		if (IS_SAME_CEP) {
			return
		}
		lastUpdatedCEP = cep

		setCepInvalid(false)
		setOngCEP(undefined)
		setCepData(null)

		if (!CEP_ENOUGH_DIGITS) {
			locationTextElement.textContent = "(Informe o CEP)"
			return
		}

		/* Load CEP */
		const startTime = Date.now()
		lastUpdatedCEP = startTime

		async function cepLoadingAnimation() {
			const locationTextElement = document.getElementById("signONG_location_text")
			let reticencesText = ""

			for (let i = 0; i < 4; i++) {
				if (!cepIsLoading) {
					break
				}

				locationTextElement.textContent = "(Carregando" + reticencesText + ")"
				reticencesText += "."

				await new Promise(resolve => setTimeout(resolve, 250))
			}

			await new Promise(resolve => setTimeout(resolve, 200))

			if (cepIsLoading) {
				cepLoadingAnimation()
			}
		}

		if (!cepIsLoading) {
			cepIsLoading = true
			cepLoadingAnimation()
		}

		//locationTextElement.textContent = "---"
		const cepData = await getCepData(cep)

		/* Finish CEP loading */
		const UPDATE_CEP = lastUpdatedCEP === startTime

		if (!UPDATE_CEP) {
			return
		}

		cepIsLoading = false

		const CEP_IS_VALID = cepData.localidade !== undefined

		if (!CEP_IS_VALID) {
			locationTextElement.textContent = "(CEP inválido)"
			setCepInvalid(true)
			return
		}

		setCepData(cepData)
		updateCepText(cepData, currentHouseNumber)

		setOngCEP(cep)
	}

	function updateHouseNumber() {
		const houseNumberInput = document.getElementById("signONG_houseNumber")
		const houseNumberValue = houseNumberInput.value.replace(/\D/g, "").substring(0, 8)

		houseNumberInput.value = houseNumberValue
		setHouseNumber(houseNumberValue)

		if (currentCepData) {
			updateCepText(currentCepData, houseNumberValue)
		}
	}

	const [useImagePreview, setImagePreview] = useState(false)

	function updateImage() {
		const imageInputElement = document.getElementById("signOng_image_input")
		const file = imageInputElement.files?.[0]

		ResetErrors()

		if (!file) {
			setImageFile(false)
			setImagePreview()
			return
		}

		if (file.size > 5 * 1024 * 1024) {
			console.log("Image too big!!!")
			return
		}

		const previewUrl = URL.createObjectURL(file)
		const previewImage = document.getElementById("signONG_preview_image")

		setImageFile(file)
		setImagePreview(true)

		previewImage.src = previewUrl
	}

	return (
		<div className={signStyle.left_upper_container}>
			<div className={signStyle.photo_bg}>
				<img className={signStyle.photo_preview} id="signONG_preview_image" />
				{!useImagePreview && (<img src={addPhotoIconImage} className={signStyle.photo_add_icon} />)}
				{!useImagePreview && (<label>FOTO DA ONG</label>)}
				<input type="file" accept="image/jpeg,image/png" id="signOng_image_input" onChange={updateImage} />
			</div>

			<div className={signStyle.name_container}>
				<h2>NOME DA ONG</h2>
				<div className={signStyle.name_input}>
					<input id="signONG_name" type="text" onSelect={ResetErrors} />
				</div>

				<div className={signStyle.cep_container}>
					<div className={signStyle.cep_input}>
						<h1>CEP</h1>
						<input id="signONG_cep" type="text" onSelect={ResetErrors} onChange={updateCEP} />
					</div>
					<div className={signStyle.house_number_input}>
						<h1>NUMBER</h1>
						<input id="signONG_houseNumber" type="text" onSelect={ResetErrors} onChange={updateHouseNumber} />
					</div>
				</div>

				<div className={signStyle.location_container} id="signONG_location_container">
					<img src={cepIsInvalid ? invalidLocationIconImage : locationIconImage} alt="Localização" />
					<h1 id="signONG_location_text">(Informe o CEP)</h1>
				</div>
			</div>
		</div>
	)
}

function AddSocialMediaContainer({ setMediaModal, socialMediaList, setSocialMediaList }) {
	function onAddMedia() {
		ResetErrors()
		setMediaModal("options")
	}

	function removeMedia(mediaName) {
		setSocialMediaList(previous => ({
			...previous,
			[mediaName]: undefined
		}))
	}

	function InstagramPreview() {
		const instagramStyle = [signStyle.social_media, "instagram"].join(" ")

		return (
			<div className={instagramStyle} id="signONG_instagram">
				<img src={instagramIconImage} className={signStyle.social_media_icon} />
				<h1>Instagram</h1>
				<h2>@{socialMediaList["instagram"]}</h2>
				<img src={cancelMediaIconImage} className={signStyle.social_media_remove_icon} onClick={() => removeMedia("instagram")} />
			</div>
		)
	}

	function WhatsappPreview() {
		const whatsappStyle = [signStyle.social_media, "whatsapp"].join(" ")

		return (
			<div className={whatsappStyle} id="signONG_whatsapp">
				<div className={signStyle.social_media_bg_fade}></div>
				<img src={whatsappIconImage} className={signStyle.social_media_icon} />
				<h1>Whatsapp</h1>
				<h2>{socialMediaList["whatsapp"]}</h2>
				<img src={cancelMediaIconImage} className={signStyle.social_media_remove_icon} onClick={() => removeMedia("whatsapp")} />
			</div>
		)
	}

	function WebsitePreview() {
		const websiteStyle = [signStyle.social_media, "website"].join(" ")

		return (
			<div className={websiteStyle} id="signONG_website">
				<div className={signStyle.social_media_bg_fade}></div>
				<img src={websiteIconImage} className={signStyle.social_media_icon} />
				<h1>Website</h1>
				<h2>{socialMediaList["website"]}</h2>
				<img src={cancelMediaIconImage} className={signStyle.social_media_remove_icon} onClick={() => removeMedia("website")} />
			</div>
		)
	}

	return (
		<div className={signStyle.left_middle_container}>
			<div className={signStyle.midia_title_container}>
				<h2 className={signStyle.social_midia_title}>REDES SOCIAIS</h2>
				<h1 className={signStyle.social_midia_title_opcional}>(1 obrigatório)</h1>
			</div>

			<div className={signStyle.midia_container}>
				<div className={signStyle.add_social_midia} id="signONG_add_midia">
					<img src={addGreyIconImage} alt="Adicionar midia social" />
					<label>Adicionar</label>
					<button onClick={onAddMedia}></button>
				</div>

				{socialMediaList["instagram"] !== undefined && (<InstagramPreview />)}
				{socialMediaList["whatsapp"] !== undefined && (<WhatsappPreview />)}
				{socialMediaList["website"] !== undefined && (<WebsitePreview />)}
			</div>
		</div>
	)
}

function TagContainer({ tagName, description, image, isSelected, onToggle }) {
	let tagContainerStyle = ["tag_container", "selectable_tag", signStyle.tag_container_size].join(" ")
	let tagDividerStyle = "tag_divider_bar"

	if (isSelected) {
		tagContainerStyle += " selected_tag_container"
		tagDividerStyle += " selected_tag_divider_bar"
	}

	return (
		<button className={tagContainerStyle} id={"signONG_tag_" + tagName} onClick={() => onToggle(tagName)}>
			<img src={image} />
			<div className={tagDividerStyle}></div>
			<label>{description}</label>
		</button>
	)
}

function AddTagContainer({ tagList, setTagList }) {
	function setTagValue(tagName, value) {
		setTagList(previous => ({
			...previous,
			[tagName]: value
		}))
	}

	function toggleTag(tagName) {
		const newValue = !tagList[tagName]

		setTagValue(tagName, newValue)
	}

	return (
		<div className={signStyle.left_bottom_container}>
			<h2 className={signStyle.social_midia_title}>TAGS DA ONG</h2>

			<div className={signStyle.select_tags_container}>
				{Object.entries(tagsData).map(([name, { description, image }]) => (
					<TagContainer
						key={name}
						tagName={name}
						description={description}
						image={image}
						isSelected={!!tagList[name]}
						onToggle={toggleTag}
					/>
				))}
			</div>
		</div>
	)
}



// Functions 4: Right side (Email & password) //
function CloseModalButton({ setCurrentModal }) {
	return (
		<div className={signStyle.close_button} onClick={() => { setCurrentModal("loginONG") }}>
			<img src={closeIconImage} alt="Close button" />
		</div>
	)
}

function SPONGS_Brand() {
	return (
		<div className={signStyle.brand}>
			<img src={logoImage} alt="SP ONGS logo" />
			<span>SP ONGS</span>
		</div>
	)
}

function SignInputsContainer() {
	function updateCnpj() {
		const cnpjInput = document.getElementById("signONG_cnpj")
		cnpjInput.value = cnpjInput.value.replace(/\D/g, "").substring(0, 14)
	}

	const [hidePassword, setHidePassword] = useState(true)
	const [hideConfirm, setHideConfirm] = useState(true)

	function onHideClick(tag) {
		const hidePasswordElement = document.getElementById("signONG_hide_password")
		const hideConfirmPasswordElement = document.getElementById("signONG_hide_confirm_password")

		const element = tag == "password" ? hidePasswordElement : hideConfirmPasswordElement
		const setStateFunction = tag == "password" ? setHidePassword : setHideConfirm

		const unHideClass = signStyle.input_group_unHideButton
		const IS_HIDE = !element.classList.contains(unHideClass)

		if (IS_HIDE) {
			element.classList.add(unHideClass)
			element.src = nonHideIconImage
			setStateFunction(false)
		} else {
			element.classList.remove(unHideClass)
			element.src = hideIconImage
			setStateFunction(true)
		}
	}

	return (
		<div className={signStyle.signONG_input_container}>
			<div className={signStyle.input_group}>
				<label htmlFor="cnpj">CNPJ (OPCIONAL)</label>
				<input id="signONG_cnpj" type="text" inputMode="numeric" maxLength={18} onChange={updateCnpj} onSelect={ResetErrors} />
			</div>

			<div className={signStyle.input_group}>
				<label htmlFor="email">EMAIL</label>
				<input id="signONG_email" type="email" onChange={UpdateSignButtonEnabled} onSelect={ResetErrors} />
			</div>

			<div className={signStyle.input_group}>
				<label htmlFor="password">SENHA</label>
				<img id="signONG_hide_password" src={hideIconImage} className={signStyle.input_group_hideButton} onClick={() => onHideClick("password")} />
				<input id="signONG_password" type={hidePassword ? "password" : "text"} onChange={UpdateSignButtonEnabled} onSelect={ResetErrors} />
			</div>

			<div className={signStyle.input_group}>
				<label htmlFor="password">CONFIMAR SENHA</label>
				<img id="signONG_hide_confirm_password" src={hideIconImage} className={signStyle.input_group_hideButton} onClick={() => onHideClick("confirm")} />
				<input id="signONG_confirm_password" type={hideConfirm ? "password" : "text"} onChange={UpdateSignButtonEnabled} onSelect={ResetErrors} />
			</div>
		</div>
	)
}



export default SignONGComponent
