import "../Styles/Footer.css";
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import linkedinIcon from '../assets/linkedin.png';
import emailIcon from '../assets/email.png';
import phoneIcon from '../assets/phone.png';

export const Footer = () => {
    return (
        <footer className="footer">
            <Container>
                <Row className="align-items-center">
                    {/* Social Icons */}
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
                        <a href="/formateur">Formateur</a>
                        <a href="/admin/login">Admin</a>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};
