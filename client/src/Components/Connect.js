import { Container, Row, Col } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Axios from "axios";
import "../Styles/Auth.css";

export const Connect = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginStatus, setLoginStatus] = useState("");
  const [statusHolder, setStatusHolder] = useState("message");
  const navigateTo = useNavigate();

  // Handle login
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
        localStorage.setItem("token", response.data.token); // Store token for authentication
        setLoginEmail("");
        setLoginPassword("");
        navigateTo("/dashboard"); // Redirect after successful login
      } else {
        setLoginStatus("Email ou mot de passe incorrect !");
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginStatus("Erreur de connexion !");
    }
  };

  useEffect(() => {
    if (loginStatus !== "") {
      setStatusHolder("showMessage"); // Show message
      setTimeout(() => {
        setStatusHolder("message"); // Hide it after 4s
      }, 4000);
    }
  }, [loginStatus]);

  return (
    <div className="main">
      <h1>Connecter</h1>
      <div className="bx">
        <div className="bx-cnt">
          <form onSubmit={loginUser}>
            <Container>
              {/* Error Message Row */}
              <Row className="justify-content-md-center text-center">
                <Col md={6}>
                  <span className={statusHolder}>{loginStatus}</span>
                </Col>
              </Row>

              {/* Email Input Row */}
              <Row className="justify-content-md-center my-3">
                <Col md={6}>
                  <label className="form-label">Email</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="E-mail.."
                    value={loginEmail}
                    onChange={(event) => setLoginEmail(event.target.value)}
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
                    value={loginPassword}
                    onChange={(event) => setLoginPassword(event.target.value)}
                  />
                </Col>
              </Row>

              {/* Login Button Row */}
              <Row className="justify-content-md-center my-4">
                <Col md={6} className="d-grid">
                  <Button variant="primary" className="w-100" type="submit">
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
          </form>
        </div>
      </div>
    </div>
  );
};
