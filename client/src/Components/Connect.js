import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/apiService";
import "../Styles/Auth.css";

export const Connect = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginStatus, setLoginStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Check for existing token on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/connecter");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginStatus("");

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginStatus("Veuillez remplir tous les champs !");
      setIsLoading(false);
      return;
    }

    try {
      const response = await authService.loginUser({
        LoginEmail: loginEmail.trim(),
        LoginPassword: loginPassword.trim()
      });
      
      console.log("Login response:", response); // Debug log

      if (response.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        setLoginEmail("");
        setLoginPassword("");
        navigate("/dashboard");
      } else {
        setLoginStatus(response.message || "Email ou mot de passe incorrect !");
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginStatus(
        error.response?.data?.message || 
        error.message || 
        "Erreur de connexion !"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container fluid className="vh-100 d-flex align-items-center justify-content-center">
      <Row className="connect-container">
        {/* Left Side - Quote */}
        <Col md={6} className="connect-left">
          <h2>Connecte-toi et prouve ton talent ! Apprends, teste tes compétences et grimpe dans le classement</h2>
        </Col>

        {/* Right Side - Form */}
        <Col md={6} className="connect-right">
          <h3 className="mb-3 text-center">Bienvenue</h3>
          <p className="text-muted text-center">Entrez votre email et mot de passe pour accéder à votre compte</p>

          {loginStatus && (
            <Alert 
              variant="danger" 
              onClose={() => setLoginStatus("")} 
              dismissible
              className="fade show"
            >
              {loginStatus}
            </Alert>
          )}

          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Entrez votre email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                autoFocus
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mot de Passe</Form.Label>
              <Form.Control
                type="password"
                placeholder="Entrez votre mot de passe"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                minLength={6}
              />
            </Form.Group>

            <Form.Group className="d-flex justify-content-between mb-3">
              <Form.Check 
                type="checkbox" 
                label="Se souvenir de moi" 
                id="rememberMe"
              />
              <Link to="/reset-password" className="text-decoration-none">
                Mot de passe oublié ?
              </Link>
            </Form.Group>

            <Button 
              variant="primary" 
              className="w-100 mb-3 py-2" 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Connexion en cours..." : "Se Connecter"}
            </Button>
            
            <div className="text-center position-relative my-3">
              <hr />
              <span className="bg-white px-2 position-absolute top-50 start-50 translate-middle">
                OU
              </span>
            </div>

            <Button 
              variant="outline-dark" 
              className="w-100 d-flex align-items-center justify-content-center"
              disabled={isLoading}
            >
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" 
                alt="Google" 
                width="20" 
                className="me-2"
              />
              Se Connecter avec Google
            </Button>

            <p className="text-center mt-3 mb-0">
              Vous n'avez pas de compte ?{" "}
              <Link to="/inscrire" className="text-decoration-none fw-bold">
                Inscrivez-vous
              </Link>
            </p>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};