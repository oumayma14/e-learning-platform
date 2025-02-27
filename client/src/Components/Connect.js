import { Container, Row, Col } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { Link, useNavigate } from "react-router-dom";
import React, {useState} from "react";
import Axios from "axios";

export const Connect = () => {
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const navigateTo = useNavigate()

   // onclick will get what the user entered
   const loginUser =(e) =>{
    e.preventDefault();
    //axios to create api that connects to the server
    Axios.post('http://localhost:3002/login', {
        //variables to send to the server 
        LoginEmail: loginEmail,
        LoginPassword: loginPassword,
    }).then((response) =>{
      if(response.data.message){
        navigateTo('/')
        console.log(response.data.message)
      }
      else{
        navigateTo('/dashboard')
      }
    })
}

  return (
    <div className="main">
      <h1>Connecter</h1>
      <div className="bx">
        <div className="bx-cnt">
          <Container>
            {/* Email Input Row */}
            <Row className="justify-content-md-center my-3">
              <Col md={6}>
                <label className="form-label">Email</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="E-mail.."
                  onChange={(event) =>{
                    setLoginEmail(event.target.value)
                }}
                />
              </Col>
            </Row>

            {/* Password Input Row */}
            <Row className="justify-content-md-center my-3">
              <Col md={6}>
                <label className="form-label">Mot de Passe</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Mot de passe"
                  onChange={(event) =>{
                    setLoginPassword(event.target.value)
                }}
                />
              </Col>
            </Row>
            {/* Login Button Row */}
            <Row className="justify-content-md-center my-4">
              <Col md={6} className="d-grid">
                <Button variant="primary" className="w-100" onClick={loginUser}>
                  Se connecter
                </Button>
              </Col>
            </Row>

            {/* Signup Link Row */}
            <Row className="justify-content-md-center text-center">
              <Col md={6}>
                <Link to="/inscrire" className="link">
                  Vous n’avez pas un compte? Inscrivez-vous
                </Link>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </div>
  );
};