import { useState, useEffect, useRef } from "react";
import { FaTimes, FaBars } from "react-icons/fa";
import { Button } from "react-bootstrap";
import "../Styles/HomeNav.css";
import { Link } from "react-router-dom";
import logo from "../assets/grey-logo.png";
import logoLight from '../assets/quizpop-high-resolution-logo-removebg-preview.png';

import DarkMode from './DarkMode/DarkMode'
export const Navbar = () =>{
    const navRef = useRef ();
        const [theme, setTheme] = useState(document.body.getAttribute("data-theme") || "light");

    useEffect(() => {
    const observer = new MutationObserver(() => {
        const currentTheme = document.body.getAttribute("data-theme");
        setTheme(currentTheme);
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ["data-theme"] });

    return () => observer.disconnect();
    }, []);

    const showNavbar = () => {
        navRef.current.classList.toggle("responsive_nav");
    }
    return(
        <header>
                     <img
                        src={theme === "dark" ? logoLight : logo}
                        alt="QuizPop Logo"
                        height="40"
                        width="auto"
                        className="d-inline-block align-top"
                        />
                <nav ref={navRef} className="homeNav">
                <a href="/#acceuil">Acceuil</a>
                <a href="/#a-propos-de-nous">A propos de nous</a>
                <a href="/#FAQ">FAQ</a>
                <DarkMode />
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