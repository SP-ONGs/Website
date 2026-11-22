// --> Variables <-- //

// Component
import NavbarComponent from './navbar.jsx'
import TabsMenuComponent from './tabsMenu.jsx'
import FilterBarComponent from './filterBar.jsx'
import OngBoardComponent from './ongBoard.jsx'
import ViewOngComponent from './viewONG.jsx'
import WelcomeModalComponent from './welcomeModal.jsx'



// --> Functions <-- //

// Functions 1: Homepage component //
function HomepageComponent({ currentModal, setCurrentModal }) {
	return (
		<>
			<NavbarComponent />
			<TabsMenuComponent setCurrentModal={setCurrentModal} />
			<FilterBarComponent />
			<OngBoardComponent setCurrentModal={setCurrentModal} />
			{currentModal === "viewONG" && (<ViewOngComponent setCurrentModal={setCurrentModal} />)}
			{currentModal === "welcome" && (<WelcomeModalComponent setCurrentModal={setCurrentModal} />)}
		</>
	)
}



export default HomepageComponent
