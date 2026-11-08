import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App.jsx'

/*import { Initialize as InitMap } from "./components/map.js";
import { Initialize as InitOngsCard } from "./components/ongCard.js";
import { Initialize as InitModal } from "./components/ongModal.js";
import { Initialize as InitPageBar } from "./components/pageBar.js";
import { Initialize as InitTagMenu } from "./components/tagMenu.js";
import { Initialize as InitNameFilterBar } from "./components/nameFilterBar.js";

InitMap()
InitOngsCard()
InitModal()
InitPageBar()
InitTagMenu()
InitNameFilterBar()*/

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</StrictMode>,
)
