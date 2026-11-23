import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'

import L from "leaflet"
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png"
import markerIcon from "leaflet/dist/images/marker-icon.png"
import markerShadow from "leaflet/dist/images/marker-shadow.png"

import App from './App.jsx'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "538591586640-pb70rs781svab6n9d4snnqvig0v56rao.apps.googleusercontent.com"

function fixLeafletIcon() {
	delete L.Icon.Default.prototype._getIconUrl
	L.Icon.Default.mergeOptions({
		iconRetinaUrl: markerIcon2x,
		iconUrl: markerIcon,
		shadowUrl: markerShadow,
	})
}

fixLeafletIcon()

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</GoogleOAuthProvider>
	</StrictMode>,
)
