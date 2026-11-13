// --> Variables <-- //

// React
import { useState, useEffect } from "react"
import { Routes, Route } from "react-router-dom"

// API
import { getCurrentAccount } from "./api/session.js"

// Components
import HomepageComponent from './components/homepage.jsx'
import LoginONGComponent from './components/loginONG.jsx'
import SignONGComponent from './components/signONG.jsx'
import OngDashboardComponent from './components/ongDashboard.jsx'
import LoginAdminComponent from './components/loginAdmin.jsx'
import AdminHomepageComponent from './components/adminHomepage.jsx'



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
	const [layout, setLayout] = useState("")
	const [currentModal, setCurrentModal] = useState("")

	const [inLoading, setLoading] = useState(true)

	useEffect(() => {
		let cancelled = false

		async function checkSession() {
			const IS_LOGGED = sessionStorage.getItem("isAdmin") === "true"

			if (!IS_LOGGED) {
				setCurrentModal("loginAdmin")
				setLoading(false)
				return
			}

			const user = await getCurrentAccount()
			if (cancelled) return

			const IS_LOGGED_ADMIN = user?.role === "ADMIN"

			if (IS_LOGGED_ADMIN) {
				setLayout("homepage")
			} else {
				sessionStorage.removeItem("isAdmin")
				setCurrentModal("loginAdmin")
			}

			setLoading(false)
		}

		checkSession()
		return () => { cancelled = true }
	})

	if (inLoading) return null

	return (
		<>
			<LoginAdminComponent setLayout={setLayout} currentModal={currentModal} setCurrentModal={setCurrentModal} />
			<AdminHomepageComponent layout={layout} currentModal={currentModal} setCurrentModal={setCurrentModal} />
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
