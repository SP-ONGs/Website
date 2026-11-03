// --> Variables <-- //

// Component
import NavbarComponent from './navbar.jsx';
import TabsMenuComponent from './tabsMenu.jsx';
import FilterBarComponent from './filterBar.jsx';
import OngBoardComponent from './ongBoard.jsx';
import ViewOngComponent from './viewONG.jsx';



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
		</>
	);
}



export default HomepageComponent;
