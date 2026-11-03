// --> Variables <-- //

// CSS
import viewOngStyle from '../styles/viewONG.module.css'
import "../styles/modals.css";

// Images
import backToHomeIconImage from '../../images/elements_vectors/BackToHomeIcon.png';
import locationIconImage from "../../images/elements_vectors/OngView_LocationIcon.png";

import spongsLogoImage from "../../images/SPONGs_icon-nobg.png";



// --> Functions <-- //

// Functions 1: View ONG component //
export default function ViewOngComponent({ setCurrentModal }) {
	return (
		<>
			<div className="focus_BG"></div>
			<div className={viewOngStyle.view_ONG_modal}>
				<div className={viewOngStyle.left_container}>
					<NameContainerComponent setCurrentModal={setCurrentModal} />
					<SocialMediaComponent />
					<RateContainerComponent />
				</div>

				<div className={viewOngStyle.right_container}>
					<BrandComponent />
					<OngMapComponent />
				</div>
			</div >
		</>
	)
}



// Functions 2: ONG name component //
function NameContainerComponent({ setCurrentModal }) {
	function onBack() {
		setCurrentModal("")
	}

	return (
		<div className={viewOngStyle.ONG_name_container}>
			<img />
			<h1>Cachorros carentes</h1>
			<div className={viewOngStyle.back_button} onClick={onBack}>
				<img src={backToHomeIconImage} />
				<h1>Voltar</h1>
			</div>
		</div>
	)
}



// Functions 3: ONG social media component //
function SocialMediaComponent() {
	return (
		<div className={viewOngStyle.ONG_social_media_container}>
		</div>
	)
}



// Functions 4: ONG rate component //
function RateContainerComponent() {
	return (
		<div className={viewOngStyle.ONG_rate_container}>
		</div>
	)
}



// Functions 5: Brand component //
function BrandComponent() {
	return (
		<div className={viewOngStyle.brand_container}>
			<img src={spongsLogoImage} />
			<h2>SP ONGS</h2>
			<h1>CONECTANDO SÃO PAULO</h1>
		</div>
	)
}



// Functions 6: ONG map component //
function OngMapComponent() {
	return (
		<div className={viewOngStyle.ONG_map_container}>
			<div className={viewOngStyle.map_title_container}>
				<img src={locationIconImage} />
				<h1>Veja a localização da ONG!</h1>
				<h2>Rua Doutor Joviano Pacheco de Aguirre, 255</h2>
			</div>
		</div>
	)
}
