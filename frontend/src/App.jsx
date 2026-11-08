// --> Variables <-- //

// React
import { useState } from "react"
import { Routes, Route } from "react-router-dom"

// Components
import HomepageComponent from './components/homepage.jsx'
import LoginONGComponent from './components/loginONG.jsx'
import SignONGComponent from './components/signONG.jsx'
import OngDashboardComponent from './components/ongDashboard.jsx'
import LoginAdminComponent from './components/loginAdmin.jsx'



// --> Functions <-- //
function PublicSite() {
	const [currentModal, setCurrentModal] = useState("welcome")

	return (
		<>
			<HomepageComponent currentModal={currentModal} setCurrentModal={setCurrentModal} />
			<LoginONGComponent currentModal={currentModal} setCurrentModal={setCurrentModal} />
			<SignONGComponent currentModal={currentModal} setCurrentModal={setCurrentModal} />
			<OngDashboardComponent currentModal={currentModal} setCurrentModal={setCurrentModal} />
		</>
	)
}

function AdminSite() {
	const [currentModal, setCurrentModal] = useState("loginAdmin")

	return (
		<>
			<LoginAdminComponent currentModal={currentModal} setCurrentModal={setCurrentModal} />
		</>
	)
}

function App() {
	return (
		<Routes>
			<Route path="/admin/*" element={<AdminSite />} />
			<Route path="*" element={<PublicSite />} />
		</Routes>
	)
}



export default App
