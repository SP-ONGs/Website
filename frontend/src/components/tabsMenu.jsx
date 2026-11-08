// --> Variables <-- //

// CSS
import tabsMenuStyle from '../styles/tabsMenu.module.css'

// Images
import homepageIconImage from '../../images/elements_vectors/HomepageIcon.png'
import mapIconImage from '../../images/elements_vectors/MapIcon.png'
import infoIconImage from '../../images/elements_vectors/InfoIcon.png'
import addOngIconImage from '../../images/elements_vectors/AddONGIcon.png'



// --> Functions <-- //

// Functions 1: Tabs menu //
function TabsMenuComponent({ setCurrentModal }) {
	const selectedOptionStyle = [tabsMenuStyle.menu_option_container, tabsMenuStyle.selected_option].join(" ")

	function onAboutUsClick() {
		setCurrentModal("welcome")
	}

	function onAddONGClick() {
		setCurrentModal("loginONG")
	}

	return (
		<div className={tabsMenuStyle.menu_container}>
			<div className={selectedOptionStyle}>
				<img src={homepageIconImage} />
				<h1>Homepage</h1>
			</div>

			<div className={tabsMenuStyle.menu_option_container}>
				<img src={mapIconImage} />
				<h1>Ver mapa</h1>
			</div>

			<div className={tabsMenuStyle.menu_option_container} onClick={onAboutUsClick}>
				<img src={infoIconImage} />
				<h1>Sobre nós</h1>
			</div>

			<div className={tabsMenuStyle.menu_option_container} onClick={onAddONGClick}>
				<img src={addOngIconImage} />
				<h1>Adicionar ONG</h1>
			</div>
		</div>
	)
}



export default TabsMenuComponent
