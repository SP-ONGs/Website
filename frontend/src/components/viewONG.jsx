// --> Variables <-- //

// CSS
import "../styles/modals.css";
import "../styles/social-media.css";
import viewOngStyle from '../styles/viewONG.module.css'

// Images
import backToHomeIconImage from '../../images/elements_vectors/BackToHomeIcon.png';
import locationIconImage from "../../images/elements_vectors/OngView_LocationIcon.png";

import spongsLogoImage from "../../images/SPONGs_icon-nobg.png";

import instagramIconImage from "../../images/elements_vectors/InstagramIcon.png";
import whatsappIconImage from "../../images/elements_vectors/WhatsappIcon.png";
import websiteIconImage from "../../images/elements_vectors/WebsiteIcon.png";

import FullStarIconImage from "../../images/elements_vectors/FullStarIcon.png";
import HalfStarIconImage from "../../images/elements_vectors/HalfStarIcon.png";
import EmptyStarIconImage from "../../images/elements_vectors/EmptyStarIcon.png";



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
	const mediaButtonStyle = ["add_midia_container", viewOngStyle.media_button_size].join(" ")

	function InstagramPreview() {
		return (
			<div className={mediaButtonStyle + " instagram"}>
				<img src={instagramIconImage} className="add_midia_icon" />
				<h1>Instagram</h1>
				<h2>@instagram data</h2>
			</div>
		)
	}

	function WhatsappPreview() {
		return (
			<div className={mediaButtonStyle + " whatsapp"}>
				<div className="midia_bg_fade"></div>
				<img src={whatsappIconImage} className="add_midia_icon" />
				<h1>Whatsapp</h1>
				<h2>whatsapp data</h2>
			</div>
		)
	}

	function WebsitePreview() {
		return (
			<div className={mediaButtonStyle + " website"}>
				<div className="midia_bg_fade"></div>
				<img src={websiteIconImage} className="add_midia_icon" />
				<h1>Website</h1>
				<h2>website data</h2>
			</div>
		)
	}

	return (
		<div className={viewOngStyle.ONG_social_media_container}>
			<div className={viewOngStyle.media_title_container}>
				<h1>Acesse a ONG</h1>
				<h2>(Clique abaixo)</h2>
			</div>
			<div className={viewOngStyle.media_conatiner}>
				<InstagramPreview />
				<WhatsappPreview />
				<WebsitePreview />
			</div>
		</div>
	)
}



// Functions 4: ONG rate component //
function RateContainerComponent() {
	function PercentContainer({ rateAmount }) {
		return (
			<div className={viewOngStyle.rate_percent}>
				<h1>{rateAmount}</h1>
				<div className={viewOngStyle.percent_bar}>
					<div className={viewOngStyle.percent_yellow_bar}></div>
				</div>
			</div>
		)
	}

	return (
		<div className={viewOngStyle.ONG_rate_container}>
			<div className={viewOngStyle.rate_bg_fade}></div>

			<div className={viewOngStyle.rate_overview_container}>
				<div className={viewOngStyle.rate_data_container}>
					<h1>4,7</h1>
					<div className={viewOngStyle.stars_container}>
						<img src={FullStarIconImage} />
						<img src={FullStarIconImage} />
						<img src={FullStarIconImage} />
						<img src={HalfStarIconImage} />
						<img src={EmptyStarIconImage} />
					</div>
					<h2>(201)</h2>
				</div>

				<div className={viewOngStyle.rate_percent_container}>
					<PercentContainer rateAmount={5} />
					<PercentContainer rateAmount={4} />
					<PercentContainer rateAmount={3} />
					<PercentContainer rateAmount={2} />
					<PercentContainer rateAmount={1} />
				</div>
			</div>

			<div className={viewOngStyle.rate_divider_bar}></div>

			<h1 className={viewOngStyle.rate_title}>201 Avaliações</h1>

			<div className={viewOngStyle.write_stars_container}>
				<img src={EmptyStarIconImage} />
				<img src={EmptyStarIconImage} />
				<img src={EmptyStarIconImage} />
				<img src={EmptyStarIconImage} />
				<img src={EmptyStarIconImage} />
			</div>
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

				<div className={viewOngStyle.map_divider_bar}></div>
			</div>

			<div className={viewOngStyle.map_panel}></div>
		</div>
	)
}
