import { useRef } from "react";
import { FaTimes, FaBars } from "react-icons/fa";
import { Button } from "react-bootstrap";

export const Navbar = () =>{
    const navRef = useRef ();
    const showNavbar = () => {
        navRef.current.classList.toggle("responsive_nav");
    }
    return(
        <header>
                <h3>Logo</h3>
                <nav ref={navRef} className="homeNav">
                <a href="/#">Acceuil</a>
                <a href="/#">A propos de nous</a>
                <a href="/#">FAQ</a>
                <Button className="homeBtn">Connexion</Button>
                <Button className="homeBtn Out">Inscription</Button>
                <button className="nav-btn nav-close-btn" onClick={showNavbar}>
                        <FaTimes/>
                </button>
                </nav>
                <button className="nav-btn" onClick={showNavbar}>
                    <FaBars />
                </button>
            </header>
    );
}