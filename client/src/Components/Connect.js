import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from 'lucide-react';
import { authService } from "../services/apiService";
import { useAuth } from '../context/AuthContext';
import "../Styles/Auth.css";
import DarkMode from './DarkMode/DarkMode'
export const Connect = () => {
  const { login } = useAuth();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginStatus, setLoginStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

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
      await login({
        email: loginEmail.trim(),
        password: loginPassword.trim()
      });

      setLoginEmail("");
      setLoginPassword("");
      navigate("/dashboard");
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
        <Col md={6} className="connect-left">
          <h2>Connecte-toi et prouve ton talent ! Apprends, teste tes compétences et grimpe dans le classement</h2>
          <DarkMode />
        </Col>

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
              <div className="password-field position-relative">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Entrez votre mot de passe"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <button 
                  type="button" 
                  className="toggle-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
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
              className="w-100 mb-3 py-2 cnt-btn" 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Connexion en cours..." : "Se Connecter"}
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
