// --> Variables <-- //

// React
import { useState, useEffect } from "react"

// Utils
import { deepEqual } from "../utils/deepEqual.js"

// Data
import tagsData from "../data/tagsData.json"

// Controllers
import { getDashboardOngData, updateOng, deleteOng } from "../controllers/ongDashboardController.js"
import { getTagId } from "../controllers/tagController.js"
import { getSocialMediaId } from "../controllers/socialMediaController.js"
import { getCepData } from "../controllers/locationController.js"
import { updateOngData, deleteOngData } from "../controllers/ongController.js"

// Components
import { SocialMediaOptions, SocialMediaInputModal } from "./addSocialMedia.jsx"
import OngCardComponent from "./ongCard.jsx"

// CSS
import "../styles/social-media.css"
import "../styles/modals.css"
import "../styles/tagsONG.css"
import ongDashboardStyle from "../styles/ongDashboard.module.css"

// Images
import spongsLogoImage from "../../images/SPONGs_icon-nobg.png"
import closeIconImage from "../../images/elements_vectors/CloseIcon.png"

import addPhotoIconImage from "../../images/elements_vectors/AddPhotoIcon.png"
import locationIconImage from "../../images/elements_vectors/LocationIcon.png"
import invalidLocationIconImage from "../../images/elements_vectors/InvalidLocationIcon.png"

import addGreyIconImage from "../../images/elements_vectors/AddGreyIcon.png"
import cancelMediaIconImage from "../../images/elements_vectors/CancelMediaIcon.png"
import instagramIconImage from "../../images/elements_vectors/InstagramIcon.png"
import whatsappIconImage from "../../images/elements_vectors/WhatsappIcon.png"
import websiteIconImage from "../../images/elements_vectors/WebsiteIcon.png"

// Values
let inUpdateLoading = false
let inDeleteLoading = false



// --> Functions <-- //

// Functions 1: Dashboard component //
export default function OngDashboardComponent({ setCurrentModal }) {
	const ongDataReference = getDashboardOngData()

	if (!ongDataReference) {
		throw Error("ongDashboard: Failed to find ONG data!!!")
	}

	const [currentMediaModal, setMediaModal] = useState(null)
	const [currentEditingMedia, setEditingMedia] = useState(null)
	const [ongData, setOngData] = useState(ongDataReference)

	const [imageFile, setImageFile] = useState(undefined)

	async function addSocialMedia(socialMediaName, socialMediaValue) {
		const newSocialMediaList = ongData.socialMedia.filter(socialMediaData => socialMediaData.name !== socialMediaName)
		const socialMediaId = await getSocialMediaId(socialMediaName)

		newSocialMediaList.push({
			"socialMediaId": socialMediaId,
			"name": socialMediaName,
			"description": socialMediaValue
		})

		setOngData(previusOngData => ({
			...previusOngData,
			"socialMedia": newSocialMediaList
		}))
	}

	function getSocialMediaDescription(socialMediaName) {
		for (const socialMediaData of ongData.socialMedia) {
			if (socialMediaData.name == socialMediaName) {
				return socialMediaData.description
			}
		}

		return ""
	}

	return (
		<>
			<div className="focus_BG"></div>

			<div className={ongDashboardStyle.ongDashboard_modal}>
				<div className={ongDashboardStyle.modal_container}>
					<div className={ongDashboardStyle.left_container}>
						<OngStatusComponent ongData={ongData} />
						<OngPhotoContainer ongData={ongData} />
						<OngInformationContainer ongData={ongData} setOngData={setOngData} />
						<OngSocialMediaContainer ongData={ongData} setOngData={setOngData} setMediaModal={setMediaModal} setEditingMedia={setEditingMedia} />
						<OngTagsComponent ongData={ongData} setOngData={setOngData} />
						<DeleteButtonComponent ongData={ongData} setCurrentModal={setCurrentModal} />
					</div>

					<div className={ongDashboardStyle.divider_bar}></div>

					<div className={ongDashboardStyle.right_container}>
						<OngPreviewComponent ongData={ongData} />
						<UpdateButtonComponent ongDataReference={ongDataReference} ongData={ongData} imageFile={imageFile} setCurrentModal={setCurrentModal} />
					</div>

					<SPONGS_Brand />
					<CloseModalButton setCurrentModal={setCurrentModal} />
				</div>
			</div>

			{currentMediaModal === "options" && (
				<SocialMediaOptions setMediaModal={setMediaModal} setAddMedia={setEditingMedia} />
			)}

			{currentMediaModal === "add_media" && (
				<SocialMediaInputModal
					setMediaModal={setMediaModal}
					currentAddMedia={currentEditingMedia}
					addSocialMediaFunction={addSocialMedia}
					defaultText={getSocialMediaDescription(currentEditingMedia)}
					isDashboardEditing={true}
				/>
			)}
		</>
	)
}



// Functions 2: Close button //
function CloseModalButton({ setCurrentModal }) {
	function onCloseDashboard() {
		setCurrentModal("")
	}

	return (
		<div className={ongDashboardStyle.close_button} onClick={onCloseDashboard}>
			<img src={closeIconImage} />
		</div>
	)
}



// Functions 3: Brand //
function SPONGS_Brand() {
	return (
		<div className={ongDashboardStyle.brand}>
			<img src={spongsLogoImage} />
			<h1>SP ONGS</h1>
		</div>
	)
}


// Functions 4: Solicitation status // 
function OngStatusComponent({ ongData }) {
	if (ongData.status == "APPROVED") {
		return (<ApprovedStatusComponent />)
	} else {
		return (<InReviewStatusComponent />)
	}
}

function InReviewStatusComponent() {
	const inReviewStyle = [ongDashboardStyle.status_container, ongDashboardStyle.in_review_status].join(" ")

	return (
		<div className={inReviewStyle}>
			<h1><b>STATUS:</b> <i>A sua ONG está em análise para ser adicionada em nosso site.</i></h1>
		</div>
	)
}

function ApprovedStatusComponent() {
	const approvedStatusStyle = [ongDashboardStyle.status_container, ongDashboardStyle.approved_status].join(" ")

	return (
		<div className={approvedStatusStyle}>
			<h1><b>STATUS:</b> <i>A sua ONG está cadastrada e acessivel dentro do nosso site.</i></h1>
		</div>
	)
}



// Functions 5: Ong information //
function OngPhotoContainer({ ongData }) {
	return (
		<div className={ongDashboardStyle.photo_container}>
			<h1 className={ongDashboardStyle.information_title}>FOTO DA ONG (16:9)</h1>
			<div className={ongDashboardStyle.photo_background}>
				<img src={addPhotoIconImage} className={ongDashboardStyle.photo_plus_icon} />
				<input type="file" accept="image/jpeg,image/png" id="ongDashboard_image_input" />
			</div>
		</div>
	)
}

function OngInformationContainer({ ongData, setOngData }) {
	const [cepIsInvalid, setCepIsInvalid] = useState(false)
	const [currentCepData, setCepData] = useState(null)
	const [currentHouseNumber, setHouseNumber] = useState(ongData.houseNumber || "")

	let lastUpdatedCEP
	let cepIsLoading = false

	function setCepInvalid(isInvalid) {
		const locationContainerElement = document.getElementsByClassName(ongDashboardStyle.location_container)[0]

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

		const locationTextElement = document.getElementById("ongDashboard_location_text")
		const locationText = streetText + cityText

		locationTextElement.textContent = locationText
	}

	async function updateCEP() {
		resetErrors()

		const cepInputElement = document.getElementById("ongDashboard_cep")
		const locationTextElement = document.getElementById("ongDashboard_location_text")

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
		setCepData(null)

		setOngData(previusOngData => ({
			...previusOngData,
			"cep": cep
		}))

		if (!CEP_ENOUGH_DIGITS) {
			locationTextElement.textContent = "(Informe o CEP)"
			return
		}

		/* Load CEP */
		const startTime = Date.now()
		lastUpdatedCEP = startTime

		async function cepLoadingAnimation() {
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
	}

	function updateHouseNumber() {
		const houseNumberInput = document.getElementById("ongDashboard_houseNumber")
		const houseNumberValue = houseNumberInput.value.replace(/\D/g, "").substring(0, 8)

		houseNumberInput.value = houseNumberValue

		setHouseNumber(houseNumberValue)
		setOngData(previusOngData => ({
			...previusOngData,
			"houseNumber": houseNumberValue
		}))

		resetErrors()

		if (currentCepData) {
			updateCepText(currentCepData, houseNumberValue)
		}
	}

	const [useImagePreview, setImagePreview] = useState(false)

	function updateImage() {
		const imageInputElement = document.getElementById("signOng_image_input")
		const file = imageInputElement.files?.[0]

		resetErrors()

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

	function onNameChange() {
		const nameInput = document.getElementById("ongDashboard_name")

		setOngData(previusOngData => ({
			...previusOngData,
			"name": nameInput.value
		}))
	}

	useEffect(() => {
		updateCEP()
	}, [ongData.cep])

	return (
		<div className={ongDashboardStyle.information_container}>
			<h1 className={ongDashboardStyle.information_title}>NOME DA ONG</h1>
			<div className={ongDashboardStyle.name_input}>
				<input
					id="ongDashboard_name"
					type="text"
					defaultValue={ongData.name}
					onChange={onNameChange}
				/>
			</div>

			<div className={ongDashboardStyle.cep_container}>
				<div className={ongDashboardStyle.cep_input}>
					<h1>CEP</h1>
					<input
						id="ongDashboard_cep"
						type="text"
						defaultValue={ongData.cep}
						onChange={updateCEP}
					/>
				</div>
				<div className={ongDashboardStyle.house_number_input}>
					<h1>NUMERO</h1>
					<input
						id="ongDashboard_houseNumber"
						type="text"
						defaultValue={ongData.houseNumber}
						onChange={updateHouseNumber}
					/>
				</div>
			</div>

			<div className={ongDashboardStyle.location_container}>
				<div className={ongDashboardStyle.location_title}>
					<img src={cepIsInvalid ? invalidLocationIconImage : locationIconImage} />
					<h1>LOCALIZAÇÃO</h1>
				</div>
				<h2 id="ongDashboard_location_text"></h2>
			</div>
		</div>
	)
}



// Functions 6: Social media //
function OngSocialMediaContainer({ ongData, setOngData, setMediaModal, setEditingMedia }) {
	const ongSocialMedias = {}

	for (const socialMediaData of ongData.socialMedia) {
		ongSocialMedias[socialMediaData.name] = socialMediaData.description
	}

	const socialMediaLimit = 3
	const CAN_ADD_SOCIAL_MEDIA = ongData.socialMedia.length < socialMediaLimit

	const removeIconStyle = ongDashboardStyle.social_media_remove_icon

	function editSocialMedia(mediaName) {
		setEditingMedia(mediaName)
		setMediaModal("add_media")
	}

	function removeSocialMedia(mediaName) {
		const newSocialMediaList = ongData.socialMedia.filter(socialMediaData => socialMediaData.name.toLowerCase() !== mediaName)

		setOngData(previusOngData => ({
			...previusOngData,
			"socialMedia": newSocialMediaList
		}))
	}

	function AddSocialMediaButton() {
		function openSocialMediaOptions() {
			setMediaModal("options")
		}

		return (
			<div className={ongDashboardStyle.add_social_media_button} id="signONG_add_midia" onClick={openSocialMediaOptions}>
				<img src={addGreyIconImage} alt="Adicionar rede social" />
				<h1>Adicionar</h1>
			</div>
		)
	}

	function InstagramPreview() {
		const instagramStyle = [ongDashboardStyle.social_media, "instagram"].join(" ")

		return (
			<div className={instagramStyle} id="signONG_instagram">
				<img src={instagramIconImage} className={ongDashboardStyle.social_media_icon} />
				<h1>Instagram</h1>
				<h2>@{ongSocialMedias["instagram"]}</h2>
				<img src={cancelMediaIconImage} className={removeIconStyle} onClick={() => removeSocialMedia("instagram")} />
				<button onClick={() => editSocialMedia("instagram")}></button>
			</div>
		)
	}

	function WhatsappPreview() {
		const whatsappStyle = [ongDashboardStyle.social_media, "whatsapp"].join(" ")

		return (
			<div className={whatsappStyle} id="signONG_whatsapp">
				<div className={ongDashboardStyle.social_media_bg_fade}></div>
				<img src={whatsappIconImage} className={ongDashboardStyle.social_media_icon} />
				<h1>Whatsapp</h1>
				<h2>{ongSocialMedias["whatsapp"]}</h2>
				<img src={cancelMediaIconImage} className={removeIconStyle} onClick={() => removeSocialMedia("whatsapp")} />
				<button onClick={() => editSocialMedia("whatsapp")}></button>
			</div>
		)
	}

	function WebsitePreview() {
		const websiteStyle = [ongDashboardStyle.social_media, "website"].join(" ")

		return (
			<div className={websiteStyle} id="signONG_website">
				<div className={ongDashboardStyle.social_media_bg_fade}></div>
				<img src={websiteIconImage} className={ongDashboardStyle.social_media_icon} />
				<h1>Website</h1>
				<h2>{ongSocialMedias["website"]}</h2>
				<img src={cancelMediaIconImage} className={removeIconStyle} onClick={() => removeSocialMedia("website")} />
				<button onClick={() => editSocialMedia("website")}></button>
			</div>
		)
	}

	return (
		<div className={ongDashboardStyle.social_media_container}>
			<div className={ongDashboardStyle.social_media_title_container}>
				<h1>REDES SOCIAIS</h1>
				<h2>(1 obrigatório)</h2>
			</div>

			<div className={ongDashboardStyle.social_media_background}>
				{CAN_ADD_SOCIAL_MEDIA && (<AddSocialMediaButton />)}

				{ongSocialMedias["instagram"] !== undefined && (<InstagramPreview />)}
				{ongSocialMedias["whatsapp"] !== undefined && (<WhatsappPreview />)}
				{ongSocialMedias["website"] !== undefined && (<WebsitePreview />)}
			</div>
		</div>
	)
}



// Functions 6: Tags //
function OngTagsComponent({ ongData, setOngData }) {
	const tagList = {}

	for (const tagData of ongData.tags) {
		tagList[tagData.description] = true
	}

	return (
		<div className={ongDashboardStyle.tag_container}>
			<h1 className={ongDashboardStyle.tag_container_title}>TAGS DA ONG</h1>
			<div className={ongDashboardStyle.tag_container_background}>
				{Object.entries(tagsData).map(([name, { description, image }]) => (
					<TagContainer
						key={name}
						tagName={name}
						description={description}
						image={image}
						isSelected={!!tagList[name]}
						ongData={ongData}
						setOngData={setOngData}
					/>
				))}
			</div>
		</div>
	)
}

function TagContainer({ tagName, description, image, isSelected, ongData, setOngData }) {
	const [tagSelected, setTagSelected] = useState(isSelected)

	let tagContainerStyle = ["tag_container", "selectable_tag", ongDashboardStyle.tag_container_size].join(" ")
	let tagDividerStyle = "tag_divider_bar"

	if (tagSelected) {
		tagContainerStyle += " selected_tag_container"
		tagDividerStyle += " selected_tag_divider_bar"
	}

	async function addTag() {
		const newTagList = ongData.tags

		if (newTagList.length >= 3) {
			return
		}

		const tagId = await getTagId(tagName)
		const CAN_UPDATE_TAG = !ongData.tags.some(tagData => tagData.description == tagName)

		if (CAN_UPDATE_TAG) {
			newTagList.push({
				"id": tagId,
				"description": tagName
			})
			setOngData(previusOngData => ({
				...previusOngData,
				"tags": newTagList
			}))
		}
	}

	function removeTag() {
		const newTagList = ongData.tags.filter(tagData => tagData.description != tagName)

		setOngData(previusOngData => ({
			...previusOngData,
			"tags": newTagList
		}))
	}

	function onToggleTag() {
		const ADD_TAG = !tagSelected

		setTagSelected(!tagSelected)

		if (ADD_TAG) {
			addTag()
		} else {
			removeTag()
		}
	}

	return (
		<button className={tagContainerStyle} id={"ongDashboard_tag_" + tagName} onClick={() => onToggleTag(tagName)}>
			<img src={image} />
			<div className={tagDividerStyle}></div>
			<label>{description}</label>
		</button>
	)
}



// Functions 7: Delete ONG //
function DeleteButtonComponent({ ongData, setCurrentModal }) {
	function onDeleteClick() {
		onDeleteOng(ongData, setCurrentModal)
	}

	return (
		<button
			id="ongDashboard_delete_button"
			className={ongDashboardStyle.delete_button}
			onClick={onDeleteClick}
		>Excluir ONG</button>
	)
}

async function onDeleteOng(ongData, setCurrentModal) {
	if (inDeleteLoading) {
		return
	}

	inDeleteLoading = true

	const deleteButton = document.getElementById("ongDashboard_delete_button")

	deleteButton.textContent = "Deletando"
	deleteLoadingAnimation()

	deleteButton.classList.add(ongDashboardStyle.delete_button_disabled)

	try {
		await deleteOng(ongData.id)

		deleteOngData(ongData.id)
		setCurrentModal("")
	} catch (e) { }

	inDeleteLoading = false
}

async function deleteLoadingAnimation() {
	const deleteButton = document.getElementById("ongDashboard_delete_button")
	let reticencesText = ""

	for (let i = 0; i < 4; i++) {
		if (!inDeleteLoading) {
			break
		}

		deleteButton.textContent = "Deletando" + reticencesText + ""
		reticencesText += "."

		await new Promise(resolve => setTimeout(resolve, 250))
	}

	await new Promise(resolve => setTimeout(resolve, 200))

	if (inUpdateLoading) {
		updateLoadingAnimation()
	}
}



// Functions 8: Ong preview //
function OngPreviewComponent({ ongData }) {
	return (
		<>
			<div className={ongDashboardStyle.preview_title_container}>
				<h1>VISUALIZADOR</h1>
				<h2>A sua ONG ficará assim no nosso site</h2>
			</div>

			<div className={ongDashboardStyle.preview_card_container}>
				<OngCardComponent ongData={ongData} isClicable={false} />
			</div>
		</>
	)
}



// Functions 9: Update button //
function UpdateButtonComponent({ ongDataReference, ongData, imageFile, setCurrentModal }) {
	const buttonStyle = ongDashboardStyle.confirm_button

	function onUpdateClick() {
		const IS_UPDATABLE = !inUpdateLoading && !deepEqual(ongData, ongDataReference)
		if (IS_UPDATABLE) {
			onUpdateONG(ongData, ongDataReference, imageFile, setCurrentModal)
		}
	}

	useEffect(() => {
		updateButtonEnabled(ongData, ongDataReference)
	}, [ongData])

	return (
		<button
			className={buttonStyle}
			id="ongDashboard_update_button"
			onClick={onUpdateClick}
		>Atualizar</button>
	)
}

function updateButtonEnabled(ongData, ongDataReference) {
	const updateButton = document.getElementById("ongDashboard_update_button")
	const IS_UPDATABLE = !inUpdateLoading && !deepEqual(ongData, ongDataReference)

	if (!IS_UPDATABLE) {
		updateButton.classList.add(ongDashboardStyle.confirm_button_disabled)
		return
	}

	updateButton.classList.remove(ongDashboardStyle.confirm_button_disabled)
}

async function updateLoadingAnimation() {
	const updateButton = document.getElementById("ongDashboard_update_button")
	let reticencesText = ""

	for (let i = 0; i < 4; i++) {
		if (!inUpdateLoading) {
			break
		}

		updateButton.textContent = "Carregando" + reticencesText + ""
		reticencesText += "."

		await new Promise(resolve => setTimeout(resolve, 250))
	}

	await new Promise(resolve => setTimeout(resolve, 200))

	if (inUpdateLoading) {
		updateLoadingAnimation()
	}
}

async function onUpdateONG(ongData, ongDataReference, imageFile, setCurrentModal) {
	if (inUpdateLoading) {
		return
	}

	const nameInput = document.getElementById("ongDashboard_name")
	const cepInput = document.getElementById("ongDashboard_cep")
	const houseNumberInput = document.getElementById("ongDashboard_houseNumber")
	const imageInput = document.getElementById("ongDashboard_image_input")

	const midiaContainer = document.getElementsByClassName(ongDashboardStyle.social_media_background)[0]

	// Update error outlines
	const ongName = nameInput.value
	const ongCep = cepInput.value
	const houseNumber = houseNumberInput.value

	const NAME_IS_VALID = ongName !== ""
	const CEP_IS_VALID = ongCep !== undefined
	const HOUSE_NUMBER_IS_VALID = houseNumber !== ""

	resetErrors()

	setError(nameInput.parentElement, !NAME_IS_VALID)
	setError(cepInput.parentElement, !CEP_IS_VALID)
	setError(houseNumberInput.parentElement, !HOUSE_NUMBER_IS_VALID)

	const HAS_SOCIAL_MEDIA = ongData.socialMedia.length > 0
	setError(midiaContainer, !HAS_SOCIAL_MEDIA)

	// Check if can sign ONG
	const CAN_UPDATE_ONG = NAME_IS_VALID && CEP_IS_VALID && HAS_SOCIAL_MEDIA

	if (!CAN_UPDATE_ONG) {
		return
	}

	// Convert relations IDs (tags and social media)
	const ongSocialMedia = []
	const ongTagsIds = []

	for (const socialMediaData of ongData.socialMedia) {
		ongSocialMedia.push({
			"socialMediaId": socialMediaData.socialMediaId,
			"description": socialMediaData.description
		})
	}

	for (const tagData of ongData.tags) {
		ongTagsIds.push(tagData.id)
	}

	// Send sign request to backend
	const payload = {
		"name": ongName,
		"cep": ongCep,
		"houseNumber": houseNumber,
		"cnpj": ongData.cnpj,
		"socialMedia": ongSocialMedia,
		"tagIds": ongTagsIds
	}

	const updateButton = document.getElementById("ongDashboard_update_button")

	updateButton.textContent = "Carregando"
	inUpdateLoading = true

	updateButtonEnabled(ongData, ongDataReference)
	updateLoadingAnimation()

	try {
		await updateOng(ongData.id, payload, imageFile)

		updateOngData(ongData)
		setCurrentModal("")
	} catch (e) { }

	updateButton.textContent = "Atualizar"
	inUpdateLoading = false

	updateButtonEnabled(ongData, ongDataReference)
}

function setError(element, isError) {
	if (isError) {
		element.classList.add(ongDashboardStyle.error_outline)
		return
	}

	element.classList.remove(ongDashboardStyle.error_outline)
}

function resetErrors() {
	const nameInput = document.getElementById("ongDashboard_name")
	const cepInput = document.getElementById("ongDashboard_cep")
	const houseNumberInput = document.getElementById("ongDashboard_houseNumber")
	const imageInput = document.getElementById("ongDashboard_image_input")

	const midiaContainer = document.getElementsByClassName(ongDashboardStyle.social_media_background)[0]

	setError(nameInput.parentElement, false)
	setError(cepInput.parentElement, false)
	setError(houseNumberInput.parentElement, false)
	setError(imageInput.parentElement, false)
	setError(midiaContainer, false)
}
