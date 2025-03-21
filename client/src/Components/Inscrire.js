import { Container, Row, Form, Alert } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import Axios from "axios";
import "../Styles/Inscrire.css";

export const Inscrire = () => {
    const navigate = useNavigate();
    
    // Use a single state object for form fields
    const [formData, setFormData] = useState({
        username: "",
        name: "",
        email: "",
        password: "",
        role: "",
        image: null,
    });

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle file upload
    const handleFileChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    // Handle form submission
    const createUser = (e) => {
        e.preventDefault(); 
        setError(null);
        setSuccess(null);

        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value) data.append(key, value);
        });

        Axios.post("http://localhost:3002/register", data, {
            headers: { "Content-Type": "multipart/form-data" },
        })
            .then(() => {
                setSuccess("Compte créé avec succès !");
                setTimeout(() => navigate("/login"), 2000); // Redirect to login after success
            })
            .catch((error) => {
                setError("Erreur lors de l'inscription. Veuillez réessayer.");
                console.error("Error uploading user:", error);
            });
    };

    return (
        <div className="connect-container">
            <div className="connect-left">
                <h2>Ton parcours commence ici. Es-tu prêt à relever le défi ?</h2>
                <p></p>
            </div>

            <div className="connect-right">
                <h3>Inscription</h3>
                {error && <Alert variant="danger" className="showMessage">{error}</Alert>}
                {success && <Alert variant="success" className="showMessage">{success}</Alert>}
                
                <Form onSubmit={createUser}>
                    <Container>
                        <Row>
                            <Form.Group>
                                <Form.Label>Nom d'utilisateur</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Row>

                        <Row>
                            <Form.Group>
                                <Form.Label>Nom</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Row>

                        <Row>
                            <Form.Group>
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Row>

                        <Row>
                            <Form.Group>
                                <Form.Label>Mot de Passe</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Row>

                        <Row>
                            <Form.Group>
                                <Form.Label>Rôle</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Row>

                        <Row>
                            <Form.Group>
                                <Form.Label>Photo de profil</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    required
                                />
                            </Form.Group>
                        </Row>

                        <Row className="mt-3">
                            <Button variant="primary" type="submit">
                                Créez Votre Compte
                            </Button>
                        </Row>

                        <Row className="mt-3">
                            <p>Déjà un compte ? <Link to="/connecter">Connectez-vous</Link></p>
                        </Row>
                    </Container>
                </Form>
            </div>
        </div>
    );
};
