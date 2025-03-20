import { useRef } from "react";
import { FaTimes, FaBars } from "react-icons/fa";
import { Button } from "react-bootstrap";
import "../Styles/HomeNav.css";
import { Link } from "react-router-dom";

export const Navbar = () =>{
    const navRef = useRef ();
    const showNavbar = () => {
        navRef.current.classList.toggle("responsive_nav");
    }
    return(
        <header>
                <h3>QuizPoP</h3>
                <nav ref={navRef} className="homeNav">
                <a href="/#acceuil">Acceuil</a>
                <a href="/#a-propos-de-nous">A propos de nous</a>
                <a href="/#FAQ">FAQ</a>
                <Link to="/connecter">
                <Button className="homeBtn" style={{width: '110px'}}>Connexion</Button>
                </Link>
                <Link to="/inscrire">
                <Button className="homeBtn Out">Inscription</Button>
                </Link>
                <button className="nav-btn nav-close-btn" onClick={showNavbar}>
                        <FaTimes/>
                </button>
                </nav>
                <button className="nav-btn" onClick={showNavbar}>
                    <FaBars style={{zIndex:1, top:0}} />
                </button>
            </header>
    );
}