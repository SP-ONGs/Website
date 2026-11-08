// --> Variables <-- //

// React
import { useState } from "react"

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
	function CloseModal() {
		setCurrentModal("")
	}

	return (
		currentModal === "loginAdmin" && (
			<>
				<div className="focus_BG"></div>

				<div className={loginStyle.login_modal}>
					<img className={loginStyle.close_button} src={closeIconImage} onClick={CloseModal} />
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
function SPONGS_Brand() {
	return (
		<div className={loginStyle.brand_container}>
			<img src={logoImage} />
			<h1>SP ONGS</h1>
		</div>
	)
}



// Functions 3: Input components //
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
				<input id="email" type="email" />
			</div>

			<div className={loginStyle.input_group}>
				<label htmlFor="password">SENHA</label>
				<img id="hide-password" src={hideIconImage} className={loginStyle.input_group_hideButton} onClick={onHideClick} />
				<input id="password" type={hidePassword ? "password" : "text"} />
			</div>
		</div>
	);
}

function LoginButton({ setLayout, setCurrentModal }) {
	function SignIn() {
		setCurrentModal("")
		setLayout("homepage")
	}

	return (
		<button className={loginStyle.login_button} onClick={SignIn}>
			Conectar
		</button>
	)
}



export default LoginAdminComponent
