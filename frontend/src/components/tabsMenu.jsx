// --> Variables <-- //

// Controllers
import { setOngType, refreshOngs } from "../controllers/ongController.js"

// CSS
import tabsMenuStyle from '../styles/tabsMenu.module.css'

// Styles
const optionStyle = tabsMenuStyle.menu_option_container
const selectedOptionStyle = [tabsMenuStyle.menu_option_container, tabsMenuStyle.selected_option].join(" ")

// Images
import homepageIconImage from '../../images/elements_vectors/HomepageIcon.png'
import mapIconImage from '../../images/elements_vectors/MapIcon.png'
import infoIconImage from '../../images/elements_vectors/InfoIcon.png'
import addOngIconImage from '../../images/elements_vectors/AddONGIcon.png'
import reportIconImage from '../../images/elements_vectors/ReportIcon.png'



// --> Functions <-- //

// Functions 1: Tabs menu //
function TabsMenuComponent({ currentTab, setTab, setCurrentModal, isAdmin }) {
	return (
		<div className={tabsMenuStyle.menu_container}>
			{!isAdmin && (<TabButtonsComponent setCurrentModal={setCurrentModal} />)}
			{isAdmin && (<AdminTabButtonsComponent currentTab={currentTab} setTab={setTab} />)}
		</div>
	)
}

function TabButtonsComponent({ setCurrentModal }) {
	/*return (
		<>
			<HomepageButton />
			<ViewMapButton />
			<AboutUsButton setCurrentModal={setCurrentModal} />
			<AddOngButton setCurrentModal={setCurrentModal} />
		</>
	)*/

	return (
		<>
			<HomepageButton />
			<AboutUsButton setCurrentModal={setCurrentModal} />
			<AddOngButton setCurrentModal={setCurrentModal} />
		</>
	)
}

function AdminTabButtonsComponent({ currentTab, setTab }) {
	/*return (
		<>
			<AdminHomepageButton currentTab={currentTab} setTab={setTab} />
			<ViewSolicitationsButton currentTab={currentTab} setTab={setTab} />
			<ViewReportsButton currentTab={currentTab} setTab={setTab} />
		</>
	)*/

	return (
		<>
			<AdminHomepageButton currentTab={currentTab} setTab={setTab} />
			<ViewSolicitationsButton currentTab={currentTab} setTab={setTab} />
		</>
	)
}




// Functions 2: Tabs Buttons //
function HomepageButton() {
	function onHomepageClick() {
		//setOngType("Public")
		//refreshOngs()
	}

	return (
		<div className={selectedOptionStyle} onClick={onHomepageClick}>
			<img src={homepageIconImage} />
			<h1>Homepage</h1>
		</div>
	)
}

function ViewMapButton() {
	return (
		<div className={optionStyle}>
			<img src={mapIconImage} />
			<h1>Ver mapa</h1>
		</div>
	)
}

function AboutUsButton({ setCurrentModal }) {
	function onAboutUsClick() {
		setCurrentModal("welcome")
	}

	return (
		<div className={optionStyle} onClick={onAboutUsClick}>
			<img src={infoIconImage} />
			<h1>Sobre nós</h1>
		</div>
	)
}

function AddOngButton({ setCurrentModal }) {
	function onAddONGClick() {
		setCurrentModal("loginONG")
	}

	return (
		<div className={optionStyle} onClick={onAddONGClick}>
			<img src={addOngIconImage} />
			<h1>Adicionar ONG</h1>
		</div>
	)
}



// Functions 3: Admin tabs buttons //
function AdminHomepageButton({ currentTab, setTab }) {
	const IS_SELECTED = currentTab == "AdminHomepage"
	const buttonStyle = IS_SELECTED && selectedOptionStyle || optionStyle

	function onHomepageClick() {
		setTab("AdminHomepage")

		setOngType("Public")
		refreshOngs()
	}

	return (
		<div className={buttonStyle} onClick={onHomepageClick}>
			<img src={homepageIconImage} />
			<h1>Homepage</h1>
		</div>
	)
}

function ViewSolicitationsButton({ currentTab, setTab }) {
	const IS_SELECTED = currentTab == "Solicitations"
	const buttonStyle = IS_SELECTED && selectedOptionStyle || optionStyle

	function onViewSolicitationsClick() {
		setTab("Solicitations")

		setOngType("Pending")
		refreshOngs()
	}

	return (
		<div className={buttonStyle} onClick={onViewSolicitationsClick}>
			<img src={addOngIconImage} />
			<h1>Solicitações de ONG</h1>
		</div>
	)
}

function ViewReportsButton({ currentTab, setTab }) {
	const IS_SELECTED = currentTab == "Reports"
	const buttonStyle = IS_SELECTED && selectedOptionStyle || optionStyle

	function onViewReportsClick() {
		setTab("Reports")
	}

	return (
		<div className={buttonStyle} onClick={onViewReportsClick}>
			<img src={reportIconImage} />
			<h1 className={tabsMenuStyle.red_text}>Ver denúncias</h1>
		</div>
	)
}



export default TabsMenuComponent
