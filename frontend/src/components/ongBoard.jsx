// --> Variables <-- //

// React
import { useEffect, useSyncExternalStore } from "react"

// Controllers
import { getOngsSnapshot, updateOngCards, refreshOngs, usePendingOngs } from "../controllers/ongController.js"

// Components
import OngCard from './ongCard.jsx'

// CSS
import ongBoardStyle from '../styles/ongBoard.module.css'

// Images
import indexBarArrowLeftImage from '../../images/elements_vectors/IndexBarArrow_Left.png'
import indexBarArrowRightImage from '../../images/elements_vectors/IndexBarArrow_Right.png'



// --> Functions <-- //

// Functions 1: ONGs board component //
function ONGsBoardComponent({ setCurrentModal, isAdmin }) {
	const cardsAmount = 6
	const { displayOngs: ongs } = useSyncExternalStore(updateOngCards, getOngsSnapshot)

	useEffect(() => {
		usePendingOngs(isAdmin || false)
		refreshOngs()
		console.log(ongs)
	})

	return (
		<>
			<div className={ongBoardStyle.ongBoard_container}>
				{Array.from({ length: cardsAmount }, (_, index) => (
					<OngCard key={index} id={"ongCard_" + index} ong={ongs[index]} setCurrentModal={setCurrentModal} isAdmin={isAdmin} />
				))}
				<BoardIndexBarComponent />
			</div>
		</>
	)
}

function UpdateOngBoard(setOngs, cardsAmount, currentIndex) {

}



// Functions 2: Board index bar component //
function BoardIndexBarComponent() {
	const nextArrowStyle = [ongBoardStyle.next_arrow, ongBoardStyle.selectable_arrow].join(" ")
	const disabledNextArrowStyle = ongBoardStyle.next_arrow

	const seletableIndexStyle = ongBoardStyle.selectable_index
	const selectedIndexStyle = [ongBoardStyle.selected_index, ongBoardStyle.selectable_index].join(" ")

	return (
		<div className={ongBoardStyle.index_bar_container}>
			<img src={indexBarArrowLeftImage} className={disabledNextArrowStyle} />

			<div className={ongBoardStyle.index_numbers_container}>
				<h1 className={selectedIndexStyle}>1</h1>
				<h1 className={seletableIndexStyle}>2</h1>
				<h1 className={seletableIndexStyle}>3</h1>
				<h1 className={seletableIndexStyle}>4</h1>
				<h1 className={seletableIndexStyle}>5</h1>
				<h1>...</h1>
				<h1 className={seletableIndexStyle}>50</h1>
			</div>

			<img src={indexBarArrowRightImage} className={nextArrowStyle} />
		</div>
	)
}



export default ONGsBoardComponent
