import { Container, Row, Col } from "react-bootstrap";
import quiz from "../assets/quiz.png";
import { Button } from "react-bootstrap";
import "../Styles/HomeNav.css";

/**Styles */

export const Home = () => {
    return (
        <div className="home">
            <Container className="mt-5">
                <Row className="align-items-center">
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
                <Row>
                    <Button className="hm_btn cn">Contactez-nous</Button>
                </Row>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                <path fill="#FE6363" fillOpacity="1" d="M0,192L30,202.7C60,213,120,235,180,250.7C240,267,300,277,360,245.3C420,213,480,139,540,112C600,85,660,107,720,128C780,149,840,171,900,170.7C960,171,1020,149,1080,154.7C1140,160,1200,192,1260,197.3C1320,203,1380,181,1410,170.7L1440,160L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z">
                </path></svg>
            </Container>
        </div>
    );
}
