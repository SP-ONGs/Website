// --> Variables <-- //

// React
import { useState } from "react";

// API
import { registerOng } from "../api/ongs.js"

// Data
import tagsData from "../data/tagsData.json"

// Controllers
import { getCepData } from "../controllers/locationController.js"
import { getSocialMediaId } from "../controllers/socialMediaController.js"
import { getTagId } from "../controllers/tagController.js"

// Components
import { SocialMediaOptions, SocialMediaInputModal } from "./addSocialMedia.jsx"

// CSS
import signStyle from "../styles/signONG.module.css";
import "../styles/social-media.css";
import "../styles/modals.css";
import "../styles/tagsONG.css";

// Images
import addPhotoIconImage from "../../images/elements_vectors/AddPhotoIcon.png";
import locationIconImage from "../../images/elements_vectors/LocationIcon.png";
import invalidLocationIconImage from "../../images/elements_vectors/InvalidLocationIcon.png";

import addGreyIconImage from "../../images/elements_vectors/AddGreyIcon.png";
import cancelMediaIconImage from "../../images/elements_vectors/CancelMediaIcon.png";
import instagramIconImage from "../../images/elements_vectors/InstagramIcon.png";
import whatsappIconImage from "../../images/elements_vectors/WhatsappIcon.png";
import websiteIconImage from "../../images/elements_vectors/WebsiteIcon.png";

import hideIconImage from "../../images/elements_vectors/HideIcon.png";
import nonHideIconImage from "../../images/elements_vectors/NonHideIcon.png";

import logoImage from "../../images/SPONGs_icon-nobg.png";
import closeIconImage from "../../images/elements_vectors/CloseIcon.png";



// --> Functions <-- //

// Functions 1: Sign ONG component //
function SignONGComponent({ currentModal, setCurrentModal }) {
	const [currentMediaModal, setMediaModal] = useState(null);
	const [currentAddMedia, setAddMedia] = useState(null);

	const [ongCEP, setOngCEP] = useState(undefined);
	const [socialMediaList, setSocialMediaList] = useState({});
	const [tagList, setTagList] = useState({});

	const [imageFile, setImageFile] = useState(undefined);

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
						<SignButtonComponent ongCEP={ongCEP} socialMediaList={socialMediaList} tagList={tagList} imageFile={imageFile} />
					</div>
				</div>

				{currentMediaModal === "options" && (
					<SocialMediaOptions setMediaModal={setMediaModal} setAddMedia={setAddMedia} />
				)}

				{currentMediaModal === "add_media" && (
					<SocialMediaInputModal setMediaModal={setMediaModal} currentAddMedia={currentAddMedia} setSocialMediaList={setSocialMediaList} />
				)}
			</>
		)
	);
}

// Functions 2: Sign button component //
function setError(element, isError) {
	if (isError) {
		element.classList.add(signStyle.error_outline);
		return;
	}

	element.classList.remove(signStyle.error_outline);
}

function ResetErrors() {
	const nameInput = document.getElementById("signONG_name");
	const cepInput = document.getElementById("signONG_cep");
	const imageInput = document.getElementById("signOng_image_input")

	const midiaContainer = document.getElementsByClassName(signStyle.midia_container)[0];

	const confirmPasswordInput = document.getElementById("signONG_confirm_password");

	setError(nameInput.parentElement, false)
	setError(cepInput.parentElement, false)
	setError(imageInput.parentElement, false)
	setError(midiaContainer, false)
	setError(confirmPasswordInput.parentElement, false)
}

async function OnSign(ongCEP, socialMediaList, tagList, imageFile) {
	const nameInput = document.getElementById("signONG_name");
	const cepInput = document.getElementById("signONG_cep");
	const imageInput = document.getElementById("signOng_image_input")

	const midiaContainer = document.getElementsByClassName(signStyle.midia_container)[0];

	const emailInput = document.getElementById("signONG_email");
	const passwordInput = document.getElementById("signONG_password");
	const confirmPasswordInput = document.getElementById("signONG_confirm_password");

	// Check if has email and password
	const HAVE_EMAIL = emailInput.value !== "";
	const HAVE_PASSWORD = passwordInput.value !== "" && confirmPasswordInput.value !== "";

	if (!HAVE_EMAIL || !HAVE_PASSWORD) {
		return
	}

	// Update error outlines
	const ongName = nameInput.value;
	const NAME_IS_VALID = ongName !== "";
	const CEP_IS_VALID = ongCEP !== undefined;

	setError(nameInput.parentElement, !NAME_IS_VALID);
	setError(cepInput.parentElement, !CEP_IS_VALID);

	const socialKeys = Object.entries(socialMediaList).filter(([_, value]) => value !== undefined)
	const HAS_SOCIAL_MEDIA = socialKeys.length > 0;
	setError(midiaContainer, !HAS_SOCIAL_MEDIA);

	const IS_SAME_PASSWORD = passwordInput.value === confirmPasswordInput.value;
	setError(confirmPasswordInput.parentElement, !IS_SAME_PASSWORD);

	const IMAGE_IS_VALID = imageFile !== undefined
	setError(imageInput.parentElement, !IMAGE_IS_VALID)

	// Check if can sign ONG
	const CAN_SIGN_ONG = NAME_IS_VALID && CEP_IS_VALID && HAS_SOCIAL_MEDIA && IS_SAME_PASSWORD;

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
			return
		}

		ongSocialMedia.push({
			"socialMediaId": socialMediaId,
			"description": description
		})
	}

	for (const tagName in tagList) {
		if (!tagList[tagName]) {
			return
		}

		const tagId = await getTagId(tagName)

		if (!tagId) {
			console.log(`Failed to find ${tagName} id!!!`)
			return
		}

		ongTagsIds.push(tagId)
	}


	// Send sign request to backend
	const payload = {
		"email": emailInput.value,
		"password": passwordInput.value,
		"name": ongName,
		"cep": ongCEP,
		"houseNumber": "100",
		"cnpj": null,
		"socialMedia": ongSocialMedia,
		"tagIds": ongTagsIds
	}

	//console.log(payload)
	console.log(imageFile.name);
	console.log(imageFile.type);
	console.log(imageFile.size);

	registerOng(payload, imageFile)
}

function UpdateSignButtonEnabled() {
	const emailInput = document.getElementById("signONG_email");
	const passwordInput = document.getElementById("signONG_password");
	const confirmPasswordInput = document.getElementById("signONG_confirm_password");

	const signButton = document.getElementById("signONG_sign_button");

	// Check if has email and password
	const HAVE_EMAIL = emailInput.value !== "";
	const HAVE_PASSWORD = passwordInput.value !== "" && confirmPasswordInput.value !== "";

	const CAN_SIGNIN = HAVE_EMAIL & HAVE_PASSWORD

	if (!CAN_SIGNIN) {
		signButton.classList.add(signStyle.signin_button_disabled);
		return;
	}

	signButton.classList.remove(signStyle.signin_button_disabled);
}

function SignButtonComponent({ ongCEP, socialMediaList, tagList, imageFile }) {
	return (
		<button
			className={[signStyle.signin_button, signStyle.signin_button_disabled].join(" ")}
			onClick={() => OnSign(ongCEP, socialMediaList, tagList, imageFile)}
			id="signONG_sign_button"
		>Cadastrar</button>
	)
}



// Functions 3: Left-side (ONG information) //
function AddNameContainer({ setOngCEP, setImageFile }) {
	const [cepIsInvalid, setCepIsInvalid] = useState(false);

	let lastUpdatedCEP;
	let cepIsLoading = false;

	function setCepInvalid(isInvalid) {
		const locationContainerElement = document.getElementsByClassName(signStyle.location_container)[0];

		if (isInvalid) {
			setCepIsInvalid(true);
			locationContainerElement.classList.add("invalid_location");
		} else {
			setCepIsInvalid(false);
			locationContainerElement.classList.remove("invalid_location");
		}
	}

	async function updateCEP() {
		const cepInputElement = document.getElementById("signONG_cep");
		const locationTextElement = document.getElementById("signONG_location_text");

		/* Update text */
		const cep = cepInputElement.value.replace(/\D/g, "").substring(0, 8)
		cepInputElement.value = cep;

		const IS_SAME_CEP = lastUpdatedCEP == cep
		const CEP_ENOUGH_DIGITS = cep.length >= 8;

		if (IS_SAME_CEP) {
			return;
		}
		lastUpdatedCEP = cep;

		setCepInvalid(false);
		setOngCEP(undefined);

		if (!CEP_ENOUGH_DIGITS) {
			locationTextElement.textContent = "(Informe o CEP)";
			return;
		}

		/* Load CEP */
		const startTime = Date.now();
		lastUpdatedCEP = startTime

		async function cepLoadingAnimation() {
			const locationTextElement = document.getElementById("signONG_location_text");
			let reticencesText = ""

			for (let i = 0; i < 4; i++) {
				if (!cepIsLoading) {
					break;
				}

				locationTextElement.textContent = "(Carregando" + reticencesText + ")"
				reticencesText += "."

				await new Promise(resolve => setTimeout(resolve, 250));
			}

			await new Promise(resolve => setTimeout(resolve, 200));

			if (cepIsLoading) {
				cepLoadingAnimation()
			}
		}

		if (!cepIsLoading) {
			cepIsLoading = true;
			cepLoadingAnimation();
		}

		//locationTextElement.textContent = "---";
		const cepData = await getCepData(cep);

		/* Finish CEP loading */
		const UPDATE_CEP = lastUpdatedCEP === startTime

		if (!UPDATE_CEP) {
			return;
		}

		cepIsLoading = false;

		const CEP_IS_VALID = cepData.localidade !== undefined;

		if (!CEP_IS_VALID) {
			locationTextElement.textContent = "(CEP inválido)";
			setCepInvalid(true);
			return;
		}

		locationTextElement.textContent = `${cepData.logradouro}, ${cepData.localidade}` //, ${cepData.uf}`;
		setOngCEP(cep);
	}

	const [useImagePreview, setImagePreview] = useState(false);

	function updateImage() {
		const imageInputElement = document.getElementById("signOng_image_input")
		const file = imageInputElement.files?.[0];

		ResetErrors()

		if (!file) {
			setImageFile(false);
			setImagePreview();
			return
		};

		if (file.size > 5 * 1024 * 1024) {
			console.log("Image too big!!!")
			return;
		}

		const previewUrl = URL.createObjectURL(file);
		const previewImage = document.getElementById("signONG_preview_image");

		setImageFile(file);
		setImagePreview(true);

		previewImage.src = previewUrl;
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
				<div className={signStyle.cep_input}>
					<label>CEP</label>
					<input id="signONG_cep" type="text" onSelect={ResetErrors} onChange={updateCEP} />
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
		ResetErrors();
		setMediaModal("options");
	}

	function removeMedia(mediaName) {
		setSocialMediaList(previous => ({
			...previous,
			[mediaName]: undefined
		}));
	}

	function InstagramPreview() {
		return (
			<div className="add_midia_container instagram" id="signONG_instagram">
				<img src={instagramIconImage} className="add_midia_icon" alt="Instagram" />
				<h2>Instagram</h2>
				<label>@{socialMediaList["instagram"]}</label>
				<img src={cancelMediaIconImage} className="remove_midia" alr="Remove" onClick={() => removeMedia("instagram")} />
			</div>
		)
	}

	function WhatsappPreview() {
		return (
			<div className="add_midia_container whatsapp" id="signONG_whatsapp">
				<div className="midia_bg_fade"></div>
				<img src={whatsappIconImage} className="add_midia_icon" alt="Whatsapp" />
				<h2>Whatsapp</h2>
				<label>{socialMediaList["whatsapp"]}</label>
				<img src={cancelMediaIconImage} className="remove_midia" alr="Remove" onClick={() => removeMedia("whatsapp")} />
			</div>
		)
	}

	function WebsitePreview() {
		return (
			<div className="add_midia_container website" id="signONG_website">
				<div className="midia_bg_fade"></div>
				<img src={websiteIconImage} className="add_midia_icon" alt="Website" />
				<h2>Website</h2>
				<label>{socialMediaList["website"]}</label>
				<img src={cancelMediaIconImage} className="remove_midia" alr="Remove" onClick={() => removeMedia("website")} />
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
	let tagContainerStyle = ["tag_container", "selectable_tag", signStyle.tag_container_size].join(" ");
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
		}));
	}

	function toggleTag(tagName) {
		const newValue = !tagList[tagName]

		setTagValue(tagName, newValue);
	}

	return (
		<div className={signStyle.left_bottom_container}>
			<h2 className={signStyle.social_midia_title}>TAGS DA ONG</h2>

			<div className={signStyle.select_tags_container}>
				{tagsData.map(({ name, description, image }) => (
					<TagContainer
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
	const [hidePassword, setHidePassword] = useState(true);
	const [hideConfirm, setHideConfirm] = useState(true);

	function onHideClick(tag) {
		const hidePasswordElement = document.getElementById("signONG_hide_password")
		const hideConfirmPasswordElement = document.getElementById("signONG_hide_confirm_password")

		const element = tag == "password" ? hidePasswordElement : hideConfirmPasswordElement;
		const setStateFunction = tag == "password" ? setHidePassword : setHideConfirm;

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



export default SignONGComponent;
