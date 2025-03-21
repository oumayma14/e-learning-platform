import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Axios from "axios";
import "../Styles/Auth.css";

export const Connect = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginStatus, setLoginStatus] = useState("");
  const [statusHolder, setStatusHolder] = useState("message");
  const navigateTo = useNavigate();

  // Gestion de la connexion
  const loginUser = async (e) => {
    e.preventDefault();
    
    if (!loginEmail || !loginPassword) {
      setLoginStatus("Veuillez remplir tous les champs !");
      return;
    }

    try {
      const response = await Axios.post("http://localhost:3002/login", {
        LoginEmail: loginEmail,
        LoginPassword: loginPassword,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token); // Stocker le token pour l'authentification
        setLoginEmail("");
        setLoginPassword("");
        navigateTo("/dashboard"); // Redirection après connexion réussie
      } else {
        setLoginStatus("Email ou mot de passe incorrect !");
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
      setLoginStatus("Erreur de connexion !");
    }
  };

  useEffect(() => {
    if (loginStatus !== "") {
      setStatusHolder("showMessage"); // Afficher le message
      setTimeout(() => {
        setStatusHolder("message"); // Masquer après 4s
      }, 4000);
    }
  }, [loginStatus]);

  return (
    <Container fluid className="vh-100 d-flex align-items-center justify-content-center">
      <Row className="connect-container">
        {/* Partie gauche - Citation et fond */}
        <Col md={6} className="connect-left">
          <h2>Connecte-toi et prouve ton talent ! Apprends, teste tes compétences et grimpe dans le classement</h2>
        </Col>

        {/* Partie droite - Formulaire de connexion */}
        <Col md={6} className="connect-right">
          <h3 className="mb-3 text-center">Bienvenue</h3>
          <p className="text-muted text-center">Entrez votre email et mot de passe pour accéder à votre compte</p>

          <Form onSubmit={loginUser}>
            <span className={statusHolder}>{loginStatus}</span>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Entrez votre email" value={loginEmail} onChange={(event) => setLoginEmail(event.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mot de Passe</Form.Label>
              <Form.Control type="password" placeholder="Entrez votre mot de passe" value={loginPassword} onChange={(event) => setLoginPassword(event.target.value)} />
            </Form.Group>

            <Form.Group className="d-flex justify-content-between">
              <Form.Check type="checkbox" label="Se souvenir de moi" />
              <a href="#" className="text-decoration-none">Mot de passe oublié ?</a>
            </Form.Group>

            <Button variant="dark" className="w-100 mt-3" type="submit">Se Connecter</Button>
            <Button variant="light" className="w-100 mt-2 border">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" width="20" className="me-2"/>
              Se Connecter avec Google
            </Button>

            <p className="text-center mt-3">
              Vous n'avez pas de compte ? <Link to="/inscrire" className="text-decoration-none">Inscrivez-vous</Link>
            </p>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};
