// --> Variables <-- //

// React
import { useState } from "react"

// Components
import NavbarComponent from './navbar.jsx'
import TabsMenuComponent from './tabsMenu.jsx'
import FilterBarComponent from './filterBar.jsx'
import OngBoardComponent from './ongBoard.jsx'
import OngDashboardComponent from './ongDashboard.jsx'
import ViewOngComponent from "./viewONG.jsx"



// --> Functions <-- //

// Functions 1: Admin homepage component //
function AdminHomepageComponent({ layout, currentModal, setCurrentModal }) {
	const IN_HOMEPAGE = layout === "homepage"

	if (!IN_HOMEPAGE) {
		return (<></>)
	}

	const [currentTab, setTab] = useState("AdminHomepage")

	return (
		<>
			<NavbarComponent />
			<TabsMenuComponent currentTab={currentTab} setTab={setTab} isAdmin={true} />
			<FilterBarComponent />
			<OngBoardComponent currentTab={currentTab} setCurrentModal={setCurrentModal} isAdmin={true} />
			{currentModal === "ongDashboard" && (<OngDashboardComponent setCurrentModal={setCurrentModal} />)}
			{currentModal === "ongSolitation" && (<ViewOngComponent setCurrentModal={setCurrentModal} isAdminSolicitation={true} />)}
		</>
	)
}



export default AdminHomepageComponent
