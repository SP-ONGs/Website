// --> Variables <-- //

// React
import { useState } from "react"

// CSS
import loginStyle from "../styles/loginONG.module.css"
import "../styles/modals.css"

// Images
import logoImage from "../../images/SPONGs_icon-nobg.png"
import closeIconImage from "../../images/elements_vectors/CloseIcon.png"

import hideIconImage from "../../images/elements_vectors/HideIcon.png"
import nonHideIconImage from "../../images/elements_vectors/NonHideIcon.png"



// --> Functions <-- //

// Functions 1: Title components //
function CloseModalButton({ setCurrentModal }) {
	return (
		<div className={loginStyle.close_loginONG_button} onClick={() => { setCurrentModal("") }} >
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



// Functions 2: Input components //
function InputContainerComponent() {
	const [hidePassword, setHidePassword] = useState(true)

	function onHideClick(event) {
		const element = event.currentTarget

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
				<input id="email" type="email" />
			</div>

			<div className={loginStyle.input_group}>
				<label htmlFor="password">SENHA</label>
				<img id="hide-password" src={hideIconImage} className={loginStyle.input_group_hideButton} onClick={onHideClick} />
				<input id="password" type={hidePassword ? "password" : "text"} />
			</div>
		</div>
	)
}

function LoginButton() {
	return (
		<button className={loginStyle.login_button}>
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



// Functions 3: Login ONG component //
function LoginONGComponent({ currentModal, setCurrentModal }) {
	return (
		currentModal === "loginONG" && (
			<>
				<div className="focus_BG"></div>

				<div className={loginStyle.login_modal}>
					<CloseModalButton setCurrentModal={setCurrentModal} />
					<SPONGS_Brand />

					<h2>Conecte a conta da sua ONG</h2>

					<InputContainerComponent />
					<LoginButton />
					<OrSignComponent setCurrentModal={setCurrentModal} />
				</div>
			</>
		)
	)
}



export default LoginONGComponent
