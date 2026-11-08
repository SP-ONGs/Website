// --> Variables <-- //

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

	return (
		<>
			<div className={ongBoardStyle.ongBoard_container}>
				{Array.from({ length: cardsAmount }, (_, index) => (
					<OngCard key={index} setCurrentModal={setCurrentModal} isAdmin={isAdmin} />
				))}
				<BoardIndexBarComponent />
			</div>
		</>
	)
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
