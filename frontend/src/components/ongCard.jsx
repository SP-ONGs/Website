// -->  Variables <-- //

// CSS
import ongCardStyle from '../styles/ongCard.module.css';
import "../styles/tagsONG.css";

// Images
import blackRateIconImage from '../../images/elements_vectors/BlackRateIcon.png';

import instagramIconImage from "../../images/elements_vectors/InstagramIcon.png";
import whatsappIconImage from "../../images/elements_vectors/WhatsappIcon.png";
import websiteIconImage from "../../images/elements_vectors/WebsiteIcon.png";

import petTagIconImage from "../../images/elements_vectors/PetTagIcon.png";
import voluntarioTagIconImage from "../../images/elements_vectors/VoluntarioTagIcon.png";
import donationTagIconImage from "../../images/elements_vectors/DonationTagIcon.png";



// --> Functions <-- //

// Functions 1: ONG card component //
function ongCardComponent({ setCurrentModal }) {
	function onViewONG() {
		setCurrentModal("viewONG")
	}

	const tagContainerStyle = ["tag_container", ongCardStyle.tag_container_size].join(" ");
	const tagDividerStyle = ["tag_divider_bar", ongCardStyle.tag_divider_size].join(" ")

	return (
		<div className={ongCardStyle.ongCard_container} onClick={onViewONG}>
			<div className={ongCardStyle.ongCard_photo}>
				<div className={ongCardStyle.ongCard_photo_BG}></div>
				<img />
			</div>

			<div className={ongCardStyle.ongCard_title_container}>
				<h1>Nome da ONG</h1>
				<div className={ongCardStyle.ongCard_rate_container}>
					<img src={blackRateIconImage} />
					<h1>4,7</h1>
				</div>
			</div>

			<div className={ongCardStyle.ongCard_socialmedia_container}>
				<div className={ongCardStyle.socialmedia_card}>
					<img src={instagramIconImage} />
					<h1>Instagram</h1>
				</div>
				<div className={ongCardStyle.socialmedia_card}>
					<img src={whatsappIconImage} />
					<h1>Whatsapp</h1>
				</div>
				<div className={[ongCardStyle.socialmedia_card, ongCardStyle.socialmedia_big_icon].join(" ")}>
					<img src={websiteIconImage} />
					<h1>Website</h1>
				</div>
			</div>

			<div className={ongCardStyle.ongCard_tag_container}>
				<div className={tagContainerStyle}>
					<img src={petTagIconImage} alt="Pet" />
					<div className={tagDividerStyle}></div>
					<label>Animais</label>
				</div>

				<div className={tagContainerStyle}>
					<img src={voluntarioTagIconImage} alt="Voluntário" />
					<div className={tagDividerStyle}></div>
					<label>Voluntário</label>
				</div>

				<div className={tagContainerStyle}>
					<img src={donationTagIconImage} alt="Doação" />
					<div className={tagDividerStyle}></div>
					<label>Doação</label>
				</div>
			</div>
		</div>
	)
}



export default ongCardComponent;
