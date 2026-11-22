// --> Variables <-- //

// React
import { useState } from "react"

// API
import { login, logout } from "../api/session"
import { getMyOng } from "../api/ongOwner.js"

// Controllers
import { setDashboardOngData } from "../controllers/ongDashboardController.js"

// CSS
import loginStyle from "../styles/loginONG.module.css"
import "../styles/modals.css"

// Images
import logoImage from "../../images/SPONGs_icon-nobg.png"
import closeIconImage from "../../images/elements_vectors/CloseIcon.png"

import hideIconImage from "../../images/elements_vectors/HideIcon.png"
import nonHideIconImage from "../../images/elements_vectors/NonHideIcon.png"

// Value
let inLoadingONG = false



// --> Functions <-- //

// Functions 1: Login ONG component //
export default function LoginONGComponent({ currentModal, setCurrentModal }) {
	return (
		currentModal === "loginONG" && (
			<>
				<div className="focus_BG"></div>

				<div className={loginStyle.login_modal}>
					<CloseModalButton setCurrentModal={setCurrentModal} />
					<SPONGS_Brand />

					<h2>Conecte a conta da sua ONG</h2>

					<InputContainerComponent />
					<LoginButton setCurrentModal={setCurrentModal} />
					<OrSignComponent setCurrentModal={setCurrentModal} />
				</div>
			</>
		)
	)
}



// Functions 2: Title components //
function CloseModalButton({ setCurrentModal }) {
	return (
		<div className={loginStyle.close_button} onClick={() => { setCurrentModal("") }} >
			<img src={closeIconImage} alt="Close button" />
			<button ></button>
		</div>
	)
}

function SPONGS_Brand() {
	return (
		<div className={loginStyle.brand}>
			<img src={logoImage} alt="SP ONGS logo" />
			<span>SP ONGS</span>
		</div>
	)
}



// Functions 3: Input components //
function setError(element, isError) {
	if (isError) {
		element.classList.add(loginStyle.error_outline)
		return
	}

	element.classList.remove(loginStyle.error_outline)
}

function resetErrors() {
	const emailInput = document.getElementById("loginONG_email")
	const passwordInput = document.getElementById("loginONG_password")

	setError(emailInput.parentElement, false)
	setError(passwordInput.parentElement, false)
}

function updateLoginButton() {
	const emailInput = document.getElementById("loginONG_email")
	const passwordInput = document.getElementById("loginONG_password")

	const loginbutton = document.getElementById("loginONG_button")

	// Check if has email and password
	const HAVE_EMAIL = emailInput.value !== ""
	const HAVE_PASSWORD = passwordInput.value !== ""

	const CAN_LOGIN = HAVE_EMAIL & HAVE_PASSWORD

	if (CAN_LOGIN && !inLoadingONG) {
		loginbutton.classList.remove(loginStyle.login_button_disabled)
		return
	}

	loginbutton.classList.add(loginStyle.login_button_disabled)
}

function InputContainerComponent() {
	const [hidePassword, setHidePassword] = useState(true);

	function onHideClick(event) {
		const element = event.currentTarget;

		const unHideClass = loginStyle.input_group_unHideButton
		const IS_HIDE = !element.classList.contains(unHideClass)

		if (IS_HIDE) {
			element.classList.add(unHideClass)
			element.src = nonHideIconImage
			setHidePassword(false)
		} else {
			element.classList.remove(unHideClass)
			element.src = hideIconImage
			setHidePassword(true)
		}
	}

	function onInputChange() {
		resetErrors()
		updateLoginButton()
	}

	return (
		<div className={loginStyle.input_container}>
			<div className={loginStyle.input_group}>
				<label htmlFor="email">EMAIL</label>
				<input id="loginONG_email" type="email" onChange={onInputChange} />
			</div>

			<div className={loginStyle.input_group}>
				<label htmlFor="password">SENHA</label>
				<img id="hide-password" src={hideIconImage} className={loginStyle.input_group_hideButton} onClick={onHideClick} />
				<input id="loginONG_password" type={hidePassword ? "password" : "text"} onChange={onInputChange} />
			</div>
		</div>
	);
}

function LoginButton({ setCurrentModal }) {
	async function loginLoadingAnimation() {
		const loginButton = document.getElementById("loginONG_button")
		let reticencesText = ""

		for (let i = 0; i < 4; i++) {
			if (!inLoadingONG) {
				break
			}

			loginButton.textContent = "Carregando" + reticencesText + ""
			reticencesText += "."

			await new Promise(resolve => setTimeout(resolve, 250))
		}

		await new Promise(resolve => setTimeout(resolve, 200))

		if (inLoadingONG) {
			loginLoadingAnimation()
		}
	}

	async function SignIn() {
		if (inLoadingONG) {
			return
		}

		resetErrors()

		const emailInputElement = document.getElementById("loginONG_email")
		const passwordInputElement = document.getElementById("loginONG_password")
		const loginbutton = document.getElementById("loginONG_button")

		const email = emailInputElement.value
		const password = passwordInputElement.value

		const EMAIL_IS_VALID = email.trim() !== ""
		const PASSWORD_IS_VALID = password !== ""

		setError(emailInputElement.parentElement, !EMAIL_IS_VALID)
		setError(passwordInputElement.parentElement, !PASSWORD_IS_VALID)

		if (!EMAIL_IS_VALID || !PASSWORD_IS_VALID) {
			return
		}

		loginbutton.textContent = "Carregando"
		inLoadingONG = true

		updateLoginButton()
		loginLoadingAnimation()

		try {
			const loginReponse = await login(email, password)
			const SUCCESS_LOGIN_ONG = loginReponse?.role === "ONG_OWNER"

			if (!SUCCESS_LOGIN_ONG) {
				try { await logout() } catch { }
				throw new Error("Not an ONG account")
			}

			const ongData = await getMyOng()

			setDashboardOngData(ongData)
			setCurrentModal("ongDashboard")
		} catch (e) {
			setError(emailInputElement.parentElement, true)
			setError(passwordInputElement.parentElement, true)
		}

		loginbutton.textContent = "Conectar"
		inLoadingONG = false

		updateLoginButton()
	}

	const loginButtonStyle = [loginStyle.login_button, loginStyle.login_button_disabled].join(" ")

	return (
		<button id="loginONG_button" className={loginButtonStyle} onClick={SignIn}>
			Conectar
		</button>
	)
}

function OrSignComponent({ setCurrentModal }) {
	return (
		<>
			<span className={loginStyle.or}>
				ou
			</span>

			<a href="#" className={loginStyle.signin_link} onClick={() => { setCurrentModal("signONG") }}>Adicionar nova ONG</a>
		</>
	)
}
