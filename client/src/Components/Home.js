import { Container, Row, Col, Button } from 'react-bootstrap';
import quiz from '../assets/quiz.png';
import ParticlesComponent from './ParticlesComponent';
import { Link } from 'react-router-dom';
import '../Styles/HomeNav.css';

/**Styles */

export const Home = () => {
    return (
        <div className="home" id="acceuil" >
            <ParticlesComponent id="tsparticles" />
            <Container className="mt-5">
                <Row className="align-items-center" id="content">
                    <Col xs={12} md={6} xl={7}>
                        <div className="text-content">
                            <p className="text-start">
                                Découvrez QuizPoP ! Créez, participez, gagnez et remontez dans les classements. 
                                Développez vos compétences et participez à des défis dès aujourd'hui !
                            </p>
                        </div>
                    </Col>
                    <Col xs={12} md={6} xl={5}>
                        <img src={quiz} alt="Header Img" className="img-fluid" />
                    </Col>
                </Row>

                {/* Fixed Contact Button Alignment */}
                <Row className="justify-content-center mt-3">
                    <Col xs="auto">
                        <Link to="/contact">
                            <Button style={{ backgroundColor: '#fe6363', borderColor: '#fe6363', color: '#ffffff' }} className="hm_btn cn">
                                Contactez-nous
                            </Button>
                        </Link>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};
