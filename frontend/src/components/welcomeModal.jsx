// --> Variables <-- //

// CSS
import welcomeStyle from "../styles/welcomeModal.module.css"
import "../styles/modals.css"

// Images
import spongsLogoImage from "../../images/SPONGs_icon-nobg.png"

import fatecImage from "../../images/FATEC_Icon.png"
import cpsImage from "../../images/CPS_Icon.png"
import fatecZonaLesteImage from "../../images/FATEC_ZonaLeste_Icon.png"

import welcomeBackgroundImage from "../../images/spongs_welcome.png"
import closeIconImage from "../../images/elements_vectors/WelcomeCloseButton.png"


// --> Functions <-- //

// Functions 1: Welcome modal component //
export default function WelcomeModalComponent({ setCurrentModal }) {
	function CloseModal() {
		setCurrentModal("")
	}

	return (
		<>
			<div className="focus_BG"></div>
			<div className={welcomeStyle.welcome_modal}>
				<div className={welcomeStyle.left_container}>
					<div className={welcomeStyle.brand_container}>
						<img src={spongsLogoImage} />
						<h1>SP ONGS</h1>
					</div>

					<div className={welcomeStyle.description_container}>
						<h1>Seja Bem-Vindo ao SP ONGs!!!</h1>
						<h2>Somos um site feito na FATEC Zona Leste, com o intuito de ser uma plataforma <b>100% gratuita.</b> Aonde conectamos as ONGs de São Paulo com os seus cidadões.</h2>
					</div>

					<div className={welcomeStyle.sponsors_container}>
						<img src={fatecImage} />
						<img src={cpsImage} />
						<img src={fatecZonaLesteImage} />
					</div>
				</div>

				<img className={welcomeStyle.welcome_bg} src={welcomeBackgroundImage} />

				<img className={welcomeStyle.close_button} src={closeIconImage} onClick={CloseModal} />
			</div>
		</>
	)
}
