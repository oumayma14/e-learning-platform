import { Container, Row, Col } from "react-bootstrap";
import quiz from "../assets/quiz.png";
import { Button } from "react-bootstrap";
import "../Styles/HomeNav.css";
import ParticlesComponent from "./ParticlesComponent";
import { Link } from "react-router-dom";

/**Styles */

export const Home = () => {
    return (
        <div className="home" id="acceuil">
            <ParticlesComponent />
            <Container className="mt-5">
                <Row className="align-items-center" id="content">
                    <Col xs={12} md={6} xl={7}>
                        <div className="text-content">
                            <p className="text-start">
                                Découvrez QuizPoP ! Créez, participez, gagnez et remontez dans les classements. 
                                Développez vos compétences et participez à des défis dès aujourd'hui !
                            </p>
                            <Button className="hm_btn">Commencer</Button>
                        </div>
                    </Col>
                    <Col xs={12} md={6} xl={5}>
                        <img src={quiz} alt="Header Img" className="img-fluid"/>
                    </Col>
                </Row>

                {/* Fixed Contact Button Alignment */}
                <Row className="justify-content-center mt-3">
                    <Col xs="auto">
                        <Link to="/contact"><Button className="hm_btn cn">Contactez-nous</Button></Link>
                        
                    </Col>
                </Row>

                {/* Fixed SVG Warning */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                    <path fill="#fe6363" fillOpacity="1" d="M0,224L120,197.3C240,171,480,117,720,122.7C960,128,1200,192,1320,224L1440,256L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z"></path>
                </svg>
            </Container>
        </div>
    );
};
