// --> Variables <-- //

// React
import { useEffect, useState, useRef } from "react"

// Controllers
import { addTagInFilter, removeTagFromFilter } from "../controllers/ongController.js"

// Data
import tagsData from "../data/tagsData.json"

// CSS
import "../styles/tagsONG.css"
import filterBarStyles from "../styles/filterBar.module.css"

// Images
import filterIconImage from "../../images/elements_vectors/FilterIcon.png"
import nextButtonArrowImage from "../../images/elements_vectors/NextButton_Arrow.png"
import previusButtonArrowImage from "../../images/elements_vectors/PreviusButton_Arrow.png"



// --> Functions <-- //

// Functions 1: Filter bar component //
function FilterBarComponent() {
	const scrollRef = useRef(null)
	const [canScrollLeft, setCanScrollLeft] = useState(false)
	const [canScrollRight, setCanScrollRight] = useState(true)

	function updateArrows() {
		const el = scrollRef.current
		if (!el) return

		setCanScrollLeft(el.scrollLeft > 0)
		setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1)
	}

	function onWheelScroll(e) {
		if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
			scrollRef.current.scrollLeft += e.deltaY
		}
	}

	useEffect(() => {
		const el = scrollRef.current
		if (!el) return

		updateArrows()
		el.addEventListener("scroll", updateArrows, { passive: true })

		// Updates when content changes size (window resize)
		const observer = new ResizeObserver(updateArrows)
		observer.observe(el)

		return () => {
			el.removeEventListener("scroll", updateArrows)
			observer.disconnect()
		}
	})

	function scrollByAmount(direction) {
		const el = scrollRef.current
		if (!el) return

		el.scrollBy({ left: direction * el.clientWidth * 0.7, behavior: "smooth" })
	}

	return (
		<div className={filterBarStyles.filter_bar_container}>
			<div ref={scrollRef} className={filterBarStyles.filter_bar_scroll} onWheel={onWheelScroll}>
				<div className={filterBarStyles.filter_title}>
					<img src={filterIconImage} />
					<h1>Filtrar</h1>
				</div>

				{Object.entries(tagsData).map(([tagName]) => (
					<TagComponent key={tagName} tagName={tagName} />
				))}
			</div>

			<PreviusButtonComponent canScroll={canScrollLeft} onClickFunction={() => scrollByAmount(-1)} />
			<NextButtonComponent canScroll={canScrollRight} onClickFunction={() => scrollByAmount(1)} />
		</div>
	)
}



// Functions 2: Next/Previus buttons //
function PreviusButtonComponent({ canScroll, onClickFunction }) {
	let previusButtonStyle = [filterBarStyles.scroll_button, filterBarStyles.previus_button].join(" ")
	let solidFadeStyle = filterBarStyles.start_solid_fade
	let fadeStyle = filterBarStyles.start_fade

	if (!canScroll) {
		const disabledStyle = " " + filterBarStyles.disabled_button

		previusButtonStyle += disabledStyle
		solidFadeStyle += disabledStyle
		fadeStyle += disabledStyle
	}

	return (
		<>
			<div className={solidFadeStyle}>
			</div>
			<div className={fadeStyle}>
			</div>
			<div className={previusButtonStyle} onClick={onClickFunction}>
				<img src={previusButtonArrowImage} />
			</div>
		</>
	)
}

function NextButtonComponent({ canScroll, onClickFunction }) {
	let nextButtonStyle = [filterBarStyles.scroll_button, filterBarStyles.next_button].join(" ")
	let solidFadeStyle = filterBarStyles.end_solid_fade
	let fadeStyle = filterBarStyles.end_fade

	if (!canScroll) {
		const disabledStyle = " " + filterBarStyles.disabled_button

		nextButtonStyle += disabledStyle
		solidFadeStyle += disabledStyle
		fadeStyle += disabledStyle
	}

	return (
		<>
			<div className={solidFadeStyle}>
			</div>
			<div className={fadeStyle}>
			</div>
			<div className={nextButtonStyle} onClick={onClickFunction}>
				<img src={nextButtonArrowImage} />
			</div>
		</>
	)
}


// Functions 3: Tag component //
function TagComponent({ tagName }) {
	const [tagIsActive, setTagActive] = useState(false)

	let tagContainerStyle = ["tag_container", "selectable_tag", filterBarStyles.tag_container_size].join(" ")
	let tagDividerStyle = "tag_divider_bar"

	if (tagIsActive) {
		tagContainerStyle += " selected_tag_container"
		tagDividerStyle += " selected_tag_divider_bar"
	}

	function toggleTagSelected() {
		if (!tagIsActive) {
			addTagInFilter(tagName)
			setTagActive(true)
			return
		}

		removeTagFromFilter(tagName)
		setTagActive(false)
	}

	const tagData = tagsData[tagName]

	return (
		<div className={tagContainerStyle} onClick={toggleTagSelected}>
			<img src={tagData.image} />
			<div className={tagDividerStyle}></div>
			<label>{tagData.description}</label>
		</div>
	)
}



export default FilterBarComponent
