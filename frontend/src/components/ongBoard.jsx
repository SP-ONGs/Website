// --> Variables <-- //

// React
import { useEffect, useState, useSyncExternalStore } from "react"

// Controllers
import { getOngsSnapshot, addOngCard, refreshOngs, getCurrentIndex, setCurrentIndex } from "../controllers/ongController.js"

// Components
import OngCard from './ongCard.jsx'

// CSS
import ongBoardStyle from '../styles/ongBoard.module.css'

// Images
import indexBarArrowLeftImage from '../../images/elements_vectors/IndexBarArrow_Left.png'
import indexBarArrowRightImage from '../../images/elements_vectors/IndexBarArrow_Right.png'

// Values
const maxIndex = 50 // TODO: Sync with ONGs data
const indexButtonsAmount = 7



// --> Functions <-- //

// Functions 1: ONGs board component //
function ONGsBoardComponent({ currentTab, setCurrentModal, isAdmin }) {
	const cardsAmount = 6
	const { displayOngs: ongs } = useSyncExternalStore(addOngCard, getOngsSnapshot)

	async function loadHomepageOngs() {
		await refreshOngs()
	}

	useEffect(() => {
		loadHomepageOngs()
	}, [isAdmin])

	return (
		<>
			<div className={ongBoardStyle.ongBoard_container}>
				{Array.from({ length: cardsAmount }, (_, index) => (
					<OngCard key={index} id={"ongCard_" + index} ongData={ongs[index]} currentTab={currentTab} setCurrentModal={setCurrentModal} isAdmin={isAdmin} />
				))}
				<BoardIndexBarComponent />
			</div>
		</>
	)
}



// Functions 2: Board index bar component //
function BoardIndexBarComponent() {
	const startButtonsOrder = ["1", "2", "3", "4", "5", "...", String(maxIndex)]
	const [buttonsOrder, setButtonsOrder] = useState(startButtonsOrder)
	const [selectedButton, setSelectedButton] = useState(1)

	function setIndex(newIndex) {
		const buttonsOrder = getIndexOrder(newIndex)

		setButtonsOrder(buttonsOrder)
		setCurrentIndex(newIndex)

		const newIndexState = getIndexState(newIndex)

		if (newIndexState == "inStart") {
			setSelectedButton(newIndex)
		} else if (newIndexState == "inMiddle") {
			const middleButtonIndex = Math.ceil(indexButtonsAmount / 2)
			setSelectedButton(middleButtonIndex)
		} else {
			setSelectedButton(indexButtonsAmount - (maxIndex - newIndex))
		}
	}

	return (
		<div className={ongBoardStyle.index_bar_container}>
			<PreviusButtonComponent setIndex={setIndex} selectedButton={selectedButton} />

			<div className={ongBoardStyle.index_numbers_container}>
				{Array.from({ length: indexButtonsAmount }, (_, i) => (
					<IndexButtonComponent
						key={i}
						buttonIndex={i + 1}
						buttonsOrder={buttonsOrder}
						selectedButton={selectedButton}
						setIndex={setIndex}
					/>
				))}
			</div>

			<NextButtonComponent setIndex={setIndex} selectedButton={selectedButton} />
		</div >
	)
}

function getIndexState(index) {
	const middleButtonIndex = Math.ceil(indexButtonsAmount / 2)

	const IN_LIMIT = index >= maxIndex - middleButtonIndex + 1
	const IN_MIDDLE = index >= middleButtonIndex

	return IN_LIMIT && "inLimit" || IN_MIDDLE && "inMiddle" || "inStart"
}



// Functions 3: Index button //
function IndexButtonComponent({ buttonIndex, buttonsOrder, selectedButton, setIndex }) {
	const selectableIndexStyle = ongBoardStyle.selectable_index
	const selectedIndexStyle = [ongBoardStyle.selected_index, ongBoardStyle.selectable_index].join(" ")

	const buttonValue = buttonsOrder[buttonIndex - 1]

	const IS_SELECTED = buttonIndex == selectedButton
	const IS_DISABLED = String(buttonValue) === String("...")

	const indexButtonStyle = IS_DISABLED && " " || IS_SELECTED && selectedIndexStyle || selectableIndexStyle

	function calculeNewIndex() {
		if (buttonIndex == 1) {
			return 1
		}

		if (buttonIndex == indexButtonsAmount) {
			return maxIndex
		}

		const currentIndex = getCurrentIndex()
		const indexState = getIndexState(currentIndex)

		if (indexState == "inStart") {
			return buttonIndex
		} else if (indexState == "inMiddle") {
			const middleButtonIndex = Math.ceil(indexButtonsAmount / 2)
			return Math.min(currentIndex + buttonIndex - middleButtonIndex, maxIndex)
		} else {
			return maxIndex + buttonIndex - indexButtonsAmount
		}
	}

	function OnIndexButtonClick() {
		if (IS_DISABLED) {
			return
		}

		const newIndex = calculeNewIndex()
		setIndex(newIndex)
	}

	return (
		<h1 className={indexButtonStyle} onClick={OnIndexButtonClick}>{buttonValue}</h1>
	)
}

function getIndexOrder(newIndex) {
	const indexState = getIndexState(newIndex)

	if (indexState == "inStart") {
		const inStartOrder = [
			"1",
			"2",
			"3",
			"4",
			"5",
			"...",
			`${maxIndex}`
		]
		return inStartOrder
	} else if (indexState == "inMiddle") {
		const inMiddleOrder = [
			"1",
			"...",
			`${newIndex - 1}`,
			`${newIndex}`,
			`${newIndex + 1}`,
			"...",
			`${maxIndex}`
		]
		return inMiddleOrder
	} else {
		const inFinalOrder = [
			"1",
			"...",
			`${maxIndex - 4}`,
			`${maxIndex - 3}`,
			`${maxIndex - 2}`,
			`${maxIndex - 1}`,
			`${maxIndex}`
		]
		return inFinalOrder
	}
}



// Functions 4: Arrow buttons //
function NextButtonComponent({ setIndex, selectedButton }) {
	const arrowStyle = [ongBoardStyle.next_arrow, ongBoardStyle.selectable_arrow].join(" ")
	const disabledArrowStyle = ongBoardStyle.next_arrow

	const NEXT_IS_DISABLED = selectedButton == indexButtonsAmount
	const buttonStyle = NEXT_IS_DISABLED && disabledArrowStyle || arrowStyle

	function onNextButtonClick() {
		if (NEXT_IS_DISABLED) {
			return
		}

		const currentIndex = getCurrentIndex()
		setIndex(currentIndex + 1)
	}

	return (
		<img src={indexBarArrowRightImage} className={buttonStyle} onClick={onNextButtonClick} />
	)
}

function PreviusButtonComponent({ setIndex, selectedButton }) {
	const arrowStyle = [ongBoardStyle.next_arrow, ongBoardStyle.selectable_arrow].join(" ")
	const disabledArrowStyle = ongBoardStyle.next_arrow

	const PREVIUS_IS_DISABLED = selectedButton == 1
	const buttonStyle = PREVIUS_IS_DISABLED && disabledArrowStyle || arrowStyle

	function onPreviusButtonClick() {
		if (PREVIUS_IS_DISABLED) {
			return
		}

		const currentIndex = getCurrentIndex()
		setIndex(currentIndex - 1)
	}

	return (
		<img src={indexBarArrowLeftImage} className={buttonStyle} onClick={onPreviusButtonClick} />
	)
}



export default ONGsBoardComponent
