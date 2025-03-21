import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Axios from "axios";
import "../Styles/Auth.css";

export const Connect = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginStatus, setLoginStatus] = useState("");
  const navigateTo = useNavigate();

  // Gestion de la connexion
  const loginUser = async (e) => {
    e.preventDefault();

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginStatus("Veuillez remplir tous les champs !");
      return;
    }

    try {
      const response = await Axios.post("http://localhost:3002/login", {
        LoginEmail: loginEmail.trim(),
        LoginPassword: loginPassword.trim(),
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        setLoginEmail("");
        setLoginPassword("");
        navigateTo("/dashboard");
      } else {
        setLoginStatus(response.data.message || "Email ou mot de passe incorrect !");
      }
    } catch (error) {
      setLoginStatus(error.response?.data?.message || "Erreur de connexion !");
    }
  };

  return (
    <Container fluid className="vh-100 d-flex align-items-center justify-content-center">
      <Row className="connect-container">
        {/* Partie gauche - Citation */}
        <Col md={6} className="connect-left">
          <h2>Connecte-toi et prouve ton talent ! Apprends, teste tes compétences et grimpe dans le classement</h2>
        </Col>

        {/* Partie droite - Formulaire */}
        <Col md={6} className="connect-right">
          <h3 className="mb-3 text-center">Bienvenue</h3>
          <p className="text-muted text-center">Entrez votre email et mot de passe pour accéder à votre compte</p>

          {loginStatus && (
            <Alert variant="danger" onClose={() => setLoginStatus("")} dismissible>
              {loginStatus}
            </Alert>
          )}

          <Form onSubmit={loginUser}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Entrez votre email"
                value={loginEmail}
                onChange={(event) => setLoginEmail(event.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mot de Passe</Form.Label>
              <Form.Control
                type="password"
                placeholder="Entrez votre mot de passe"
                value={loginPassword}
                onChange={(event) => setLoginPassword(event.target.value)}
              />
            </Form.Group>

            <Form.Group className="d-flex justify-content-between">
              <Form.Check type="checkbox" label="Se souvenir de moi" />
              <Link to="/reset-password" className="text-decoration-none">Mot de passe oublié ?</Link>
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
