import "../Styles/Footer.css";
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import linkedinIcon from '../assets/linkedin.png'; // Update with actual path
import emailIcon from '../assets/email.png'; // Update with actual path
import phoneIcon from '../assets/phone.png'; // Update with actual path

export const Footer = () => {
    return (
        <footer className="footer">
            <Container>
                <Row className="align-items-center">
                    {/* Social Icons - Now in One Column */}
                    <Col md={6} className="social-icons d-flex justify-content-center">
                        <a href="#" className="icon" id="in">
                            <img src={linkedinIcon} alt="LinkedIn" width={24} height={24} />
                        </a>
                        <a href="#" className="icon" id="mail">
                            <img src={emailIcon} alt="Email" width={24} height={24} />
                        </a>
                        <a href="#" className="icon" id="phone">
                            <img src={phoneIcon} alt="Phone" width={24} height={24} />
                        </a>
                    </Col>

                    {/* Navigation Links */}
                    <Col md={6} className="footer-links d-flex justify-content-center">
                        <a href="/">Accueil</a>
                        <a href="/#a-propos-de-nous">À propos de nous</a>
                        <a href="/#FAQ">FAQ</a>
                        <a href="/contact">Contact</a>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};
