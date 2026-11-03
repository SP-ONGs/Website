// --> Variables <-- //

// React
import { useState } from "react";

// Components
import HomepageComponent from './components/homepage.jsx'
import LoginONGComponent from './components/loginONG.jsx'
import SignONGComponent from './components/signONG.jsx'



// --> Functions <-- //
function App() {
	const [currentModal, setCurrentModal] = useState() //useState("loginONG");

	return (
		<>
			<HomepageComponent currentModal={currentModal} setCurrentModal={setCurrentModal} />
			<LoginONGComponent currentModal={currentModal} setCurrentModal={setCurrentModal} />
			<SignONGComponent currentModal={currentModal} setCurrentModal={setCurrentModal} />
		</>
	)
}



export default App
