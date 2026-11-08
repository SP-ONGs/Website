// --> Variables <-- //

// Component
import NavbarComponent from './navbar.jsx'
import TabsMenuComponent from './tabsMenu.jsx'
import FilterBarComponent from './filterBar.jsx'
import OngBoardComponent from './ongBoard.jsx'
import OngDashboardComponent from './ongDashboard.jsx'



// --> Functions <-- //

// Functions 1: Admin homepage component //
function AdminHomepageComponent({ layout, currentModal, setCurrentModal }) {
	return (
		layout === "homepage" && (
			<>
				<NavbarComponent />
				<TabsMenuComponent setCurrentModal={setCurrentModal} isAdmin={true} />
				<FilterBarComponent />
				<OngBoardComponent setCurrentModal={setCurrentModal} isAdmin={true} />
				{currentModal === "ongDashboard" && (<OngDashboardComponent setCurrentModal={setCurrentModal} />)}
			</>
		)
	)
}



export default AdminHomepageComponent
