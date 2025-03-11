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
            </Container>
        </div>
    );
}
