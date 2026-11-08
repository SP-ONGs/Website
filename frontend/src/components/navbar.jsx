// --> Variables <-- //

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
	return (
		<div className={navbarStyles.search_bar}>
			<img src={searchIconImage} />
			<input type="text" placeholder="Pesquisar nome da ONG" />
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
