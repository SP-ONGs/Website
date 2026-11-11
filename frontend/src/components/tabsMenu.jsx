// --> Variables <-- //

// CSS
import tabsMenuStyle from '../styles/tabsMenu.module.css'

// Styles
const selectedOptionStyle = [tabsMenuStyle.menu_option_container, tabsMenuStyle.selected_option].join(" ")

// Images
import homepageIconImage from '../../images/elements_vectors/HomepageIcon.png'
import mapIconImage from '../../images/elements_vectors/MapIcon.png'
import infoIconImage from '../../images/elements_vectors/InfoIcon.png'
import addOngIconImage from '../../images/elements_vectors/AddONGIcon.png'
import reportIconImage from '../../images/elements_vectors/ReportIcon.png'



// --> Functions <-- //

// Functions 1: Tabs menu //
function TabsMenuComponent({ setCurrentModal, isAdmin }) {
	return (
		<div className={tabsMenuStyle.menu_container}>
			<HomepageButton isAdmin={isAdmin} />

			{!isAdmin && (<ViewMapButton />)}
			{!isAdmin && (<AboutUsButton setCurrentModal={setCurrentModal} />)}
			{!isAdmin && (<AddOngButton setCurrentModal={setCurrentModal} />)}

			{isAdmin && (<ViewSolicitationsButton />)}
			{isAdmin && (<ViewReportsButton />)}
		</div>
	)
}




// Functions 2: Tabs Buttons //
function HomepageButton({ isAdmin }) {
	return (
		<div className={selectedOptionStyle}>
			<img src={homepageIconImage} />
			<h1>Homepage</h1>
		</div>
	)
}

function ViewMapButton() {
	return (
		<div className={tabsMenuStyle.menu_option_container}>
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
		<div className={tabsMenuStyle.menu_option_container} onClick={onAboutUsClick}>
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
		<div className={tabsMenuStyle.menu_option_container} onClick={onAddONGClick}>
			<img src={addOngIconImage} />
			<h1>Adicionar ONG</h1>
		</div>
	)
}



// Functions 3: Admin tabs buttons //
function ViewSolicitationsButton() {
	return (
		<div className={tabsMenuStyle.menu_option_container}>
			<img src={addOngIconImage} />
			<h1>Solicitações de ONG</h1>
		</div>
	)
}

function ViewReportsButton() {
	return (
		<div className={tabsMenuStyle.menu_option_container}>
			<img src={reportIconImage} />
			<h1 className={tabsMenuStyle.red_text}>Ver denúncias</h1>
		</div>
	)
}



export default TabsMenuComponent
