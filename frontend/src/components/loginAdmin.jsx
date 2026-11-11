// --> Variables <-- //

// React
import { useState } from "react"
import { useNavigate } from "react-router-dom"

// API
import { login, logout } from "../api/session"

// CSS
import "../styles/modals.css"
import "../styles/social-media.css"
import loginStyle from '../styles/loginAdmin.module.css'

// Images
import logoImage from "../../images/SPONGs_icon-nobg.png"
import closeIconImage from "../../images/elements_vectors/CloseIcon.png"

import hideIconImage from "../../images/elements_vectors/HideIcon.png"
import nonHideIconImage from "../../images/elements_vectors/NonHideIcon.png"



// --> Functions <-- //

// Functions 1: Admin login component //
function LoginAdminComponent({ setLayout, currentModal, setCurrentModal }) {

	return (
		currentModal === "loginAdmin" && (
			<>
				<div className="focus_BG"></div>

				<div className={loginStyle.login_modal}>
					<CloseButton setCurrentModal={setCurrentModal} />
					<SPONGS_Brand />

					<h2>Conecte a sua conta de administrador</h2>

					<InputContainerComponent />
					<LoginButton setLayout={setLayout} setCurrentModal={setCurrentModal} />
				</div>
			</>
		)
	)
}



// Functions 2: Title components //
function CloseButton({ setCurrentModal }) {
	const navigate = useNavigate()

	function CloseModal() {
		navigate("/")
		setCurrentModal("")
	}

	return (
		<img className={loginStyle.close_button} src={closeIconImage} onClick={CloseModal} />
	)
}

function SPONGS_Brand() {
	return (
		<div className={loginStyle.brand_container}>
			<img src={logoImage} />
			<h1>SP ONGS</h1>
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

function ResetErrors() {
	const emailInput = document.getElementById("loginAdmin_email")
	const passwordInput = document.getElementById("loginAdmin_password")

	setError(emailInput.parentElement, false)
	setError(passwordInput.parentElement, false)
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

	return (
		<div className={loginStyle.input_container}>
			<div className={loginStyle.input_group}>
				<label htmlFor="email">EMAIL</label>
				<input id="loginAdmin_email" type="email" onChange={ResetErrors} />
			</div>

			<div className={loginStyle.input_group}>
				<label htmlFor="password">SENHA</label>
				<img id="hide-password" src={hideIconImage} className={loginStyle.input_group_hideButton} onClick={onHideClick} />
				<input id="loginAdmin_password" type={hidePassword ? "password" : "text"} onChange={ResetErrors} />
			</div>
		</div>
	);
}

function LoginButton({ setLayout, setCurrentModal }) {
	async function SignIn() {
		ResetErrors()

		const emailInputElement = document.getElementById("loginAdmin_email")
		const passwordInputElement = document.getElementById("loginAdmin_password")

		const email = emailInputElement.value
		const password = passwordInputElement.value

		const EMAIL_IS_VALID = email.trim() !== ""
		const PASSWORD_IS_VALID = password !== ""

		setError(emailInputElement.parentElement, !EMAIL_IS_VALID)
		setError(passwordInputElement.parentElement, !PASSWORD_IS_VALID)

		if (!EMAIL_IS_VALID || !PASSWORD_IS_VALID) {
			return
		}

		try {
			const loginReponse = await login(email, password)
			const SUCCESS_LOGIN_ADMIN = loginReponse?.role === "ADMIN"

			if (!SUCCESS_LOGIN_ADMIN) {
				try { await logout() } catch { }
				throw new Error("Not an admin account")
			}

			setCurrentModal("")
			setLayout("homepage")
		} catch (e) {
			setError(emailInputElement.parentElement, true)
			setError(passwordInputElement.parentElement, true)
		}
	}

	return (
		<button className={loginStyle.login_button} onClick={SignIn}>
			Conectar
		</button>
	)
}



export default LoginAdminComponent
