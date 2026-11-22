// --> Variables <-- //

// React
import { useEffect, useState } from "react";

// API
import { getReviewSummary, getReviews, createReview } from "../api/reviews";

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
export default function ViewOngComponent({ setCurrentModal, ongId = 3 }) {
	return (
		<>
			<div className="focus_BG"></div>
			<div className={viewOngStyle.view_ONG_modal}>
				<div className={viewOngStyle.left_container}>
					<NameContainerComponent setCurrentModal={setCurrentModal} />
					<SocialMediaComponent />
					<RateContainerComponent ongId={ongId} />
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
function RateContainerComponent({ ongId }) {
	const emptySummary = { average: 0, total: 0, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } }

	const [summary, setSummary] = useState(emptySummary)
	const [reviews, setReviews] = useState([])
	const [selectedRating, setSelectedRating] = useState(0)
	const [hoverRating, setHoverRating] = useState(0)
	const [authorName, setAuthorName] = useState("")
	const [comment, setComment] = useState("")
	const [sending, setSending] = useState(false)
	const [errorMessage, setErrorMessage] = useState("")

	async function loadReviews() {
		try {
			const [summaryData, reviewsData] = await Promise.all([
				getReviewSummary(ongId),
				getReviews(ongId)
			])

			setSummary(summaryData)
			setReviews(reviewsData)
		} catch (error) {
			console.error("Could not load reviews:", error)
		}
	}

	useEffect(() => {
		loadReviews()
	}, [ongId])

	async function onSend() {
		if (selectedRating === 0 || sending) return

		setSending(true)
		setErrorMessage("")

		try {
			await createReview(ongId, { authorName, rating: selectedRating, comment })

			setSelectedRating(0)
			setAuthorName("")
			setComment("")

			await loadReviews()
		} catch (error) {
			console.error("Could not send review:", error)
			setErrorMessage("Não foi possível enviar. Tente novamente.")
		} finally {
			setSending(false)
		}
	}

	// Full, half or empty star for the average at the top
	function averageStar(position) {
		if (summary.average >= position) return FullStarIconImage
		if (summary.average >= position - 0.5) return HalfStarIconImage
		return EmptyStarIconImage
	}

	function PercentContainer({ rateAmount }) {
		const amount = summary.distribution[rateAmount] ?? 0
		const percent = summary.total > 0 ? (amount / summary.total) * 100 : 0

		return (
			<div className={viewOngStyle.rate_percent}>
				<h1>{rateAmount}</h1>
				<div className={viewOngStyle.percent_bar}>
					<div className={viewOngStyle.percent_yellow_bar} style={{ width: `${percent}%` }}></div>
				</div>
			</div>
		)
	}

	const shownRating = hoverRating || selectedRating

	return (
		<div className={viewOngStyle.ONG_rate_container}>
			<div className={viewOngStyle.rate_bg_fade}></div>

			<div className={viewOngStyle.rate_overview_container}>
				<div className={viewOngStyle.rate_data_container}>
					<h1>{summary.average.toFixed(1).replace(".", ",")}</h1>
					<div className={viewOngStyle.stars_container}>
						{[1, 2, 3, 4, 5].map((position) => (
							<img key={position} src={averageStar(position)} />
						))}
					</div>
					<h2>({summary.total})</h2>
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

			<h1 className={viewOngStyle.rate_title}>
				{summary.total} {summary.total === 1 ? "Avaliação" : "Avaliações"}
			</h1>

			<div className={viewOngStyle.write_stars_container} onMouseLeave={() => setHoverRating(0)}>
				{[1, 2, 3, 4, 5].map((position) => (
					<img
						key={position}
						src={position <= shownRating ? FullStarIconImage : EmptyStarIconImage}
						className={viewOngStyle.clickable_star}
						onMouseEnter={() => setHoverRating(position)}
						onClick={() => setSelectedRating(position)}
					/>
				))}
			</div>

			<div className={viewOngStyle.comment_area}>
				{selectedRating > 0 && (
					<div className={viewOngStyle.comment_form}>
						<input
							className={viewOngStyle.comment_name_input}
							placeholder="Seu nome"
							maxLength={80}
							value={authorName}
							onChange={(event) => setAuthorName(event.target.value)}
						/>
						<input
							className={viewOngStyle.comment_input}
							placeholder="Escreva um comentário (opcional)"
							maxLength={1000}
							value={comment}
							onChange={(event) => setComment(event.target.value)}
						/>
						<button className={viewOngStyle.comment_send_button} onClick={onSend} disabled={sending}>
							{sending ? "..." : "Enviar"}
						</button>
					</div>
				)}

				{errorMessage && <p className={viewOngStyle.comment_error}>{errorMessage}</p>}

				<div className={viewOngStyle.comment_list}>
					{reviews.map((review) => (
						<div key={review.id} className={viewOngStyle.comment_item}>
							<div className={viewOngStyle.comment_header}>
								<b>{review.authorName}</b>
								<span className={viewOngStyle.comment_stars}>
									{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
								</span>
								<small>{new Date(review.createdAt).toLocaleDateString("pt-BR")}</small>
							</div>
							{review.comment && <p>{review.comment}</p>}
						</div>
					))}
				</div>
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