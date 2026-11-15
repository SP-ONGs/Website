// --> Variables <-- //

// Controllers
import { updateNameFilter } from '../controllers/ongController.js'

// CSS
import navbarStyles from '../styles/navbar.module.css'

// Images
import logoImage from "../../images/SPONGs_icon-nobg.png"
import searchIconImage from "../../images/elements_vectors/SearchIcon.png"



// --> Functions <-- //

// Functions 1: Brand component //
function BrandComponent() {
	return (
		<div className={navbarStyles.brand_container}>
			<img src={logoImage} />
			<h1>SP ONGS</h1>
		</div>
	)
}



// Functions 2: Search bar component //
function SearchBar() {
	function updateSearchText() {
		const searchInputElement = document.getElementById("navbar_search")
		const filterText = searchInputElement.value

		updateNameFilter(filterText)
	}

	return (
		<div className={navbarStyles.search_bar}>
			<img src={searchIconImage} />
			<input id="navbar_search" type="text" placeholder="Pesquisar nome da ONG" onChange={updateSearchText} />
		</div>
	)
}



// Functions 3: Navbar component //
function NavbarComponent() {
	return (
		<div className={navbarStyles.navbar_background}>
			<BrandComponent />
			<SearchBar />
			<div className={navbarStyles.navbar_bottom_line}></div>
		</div>
	)
}



export default NavbarComponent
