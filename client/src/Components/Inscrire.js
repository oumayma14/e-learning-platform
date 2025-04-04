import { Container, Row, Form, Alert } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import Axios from "axios";
import "../Styles/Inscrire.css";

export const Inscrire = () => {
    const navigate = useNavigate();
    
    // Form state
    const [formData, setFormData] = useState({
        username: "",
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
        image: null,
    });

    // UI state
    const [validated, setValidated] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(null);
    const [passwordStrength, setPasswordStrength] = useState(0);

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Check password strength when password changes
        if (name === "password") {
            checkPasswordStrength(value);
        }
    };

    // Handle file upload and create preview
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Check password strength
    const checkPasswordStrength = (password) => {
        let strength = 0;
        if (password.length > 5) strength++;
        if (password.match(/[A-Z]/)) strength++;
        if (password.match(/[0-9]/)) strength++;
        if (password.match(/[^A-Za-z0-9]/)) strength++;
        setPasswordStrength(strength);
    };

    // Handle form submission
    const createUser = async (e) => {
        e.preventDefault();
        setValidated(true);
        
        // Client-side validation
        const form = e.currentTarget;
        if (form.checkValidity() === false || 
            formData.password !== formData.confirmPassword) {
            e.stopPropagation();
            if (formData.password !== formData.confirmPassword) {
                setError("Les mots de passe ne correspondent pas");
            }
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const data = new FormData();
            // Append only fields that have values
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== null && value !== "" && key !== "confirmPassword") {
                    data.append(key, value);
                }
            });

            const response = await Axios.post("http://localhost:3002/register", data, {
                headers: { 
                    "Content-Type": "multipart/form-data",
                },
                timeout: 10000 // 10 second timeout
            });

            setSuccess(response.data.message || "Compte créé avec succès !");
            // Redirect to home page after 2 seconds
            setTimeout(() => navigate("/"), 2000);
        } catch (error) {
            console.error("Registration error:", error);
            
            // Enhanced error handling
            if (error.response) {
                // Server responded with error status
                const serverMessage = error.response.data?.message;
                const validationErrors = error.response.data?.errors;
                
                if (validationErrors) {
                    setError(Object.values(validationErrors).join("\n"));
                } else {
                    setError(serverMessage || "Erreur lors de l'inscription");
                }
            } else if (error.request) {
                // No response received
                setError("Le serveur ne répond pas - veuillez réessayer plus tard");
            } else {
                // Request setup error
                setError("Erreur de configuration de la requête");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="connect-container">
            <div className="connect-left">
                <h2>Ton parcours commence ici. Es-tu prêt à relever le défi ?</h2>
                <p>Rejoignez notre communauté d'apprenants et accédez à des ressources exclusives.</p>
            </div>

            <div className="connect-right">
                <h3>Inscription</h3>
                {error && (
                    <Alert variant="danger" className="showMessage" onClose={() => setError(null)} dismissible>
                        {error}
                    </Alert>
                )}
                {success && (
                    <Alert variant="success" className="showMessage" onClose={() => setSuccess(null)} dismissible>
                        {success}
                    </Alert>
                )}
                
                <Form noValidate validated={validated} onSubmit={createUser}>
                    <Container>
                        <Row>
                            <Form.Group controlId="username">
                                <Form.Label>Nom d'utilisateur</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    minLength={3}
                                    maxLength={20}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Veuillez fournir un nom d'utilisateur valide (3-20 caractères)
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>

                        <Row>
                            <Form.Group controlId="name">
                                <Form.Label>Nom complet</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    maxLength={50}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Veuillez fournir votre nom complet
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>

                        <Row>
                            <Form.Group controlId="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    maxLength={50}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Veuillez fournir un email valide
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>

                        <Row>
                            <Form.Group controlId="password">
                                <Form.Label>Mot de passe</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    minLength={6}
                                    maxLength={50}
                                />
                                {formData.password && (
                                    <div className={`password-strength strength-${passwordStrength}`}>
                                        Force du mot de passe: {['Faible', 'Moyen', 'Fort', 'Très fort'][passwordStrength - 1] || ''}
                                    </div>
                                )}
                                <Form.Control.Feedback type="invalid">
                                    Le mot de passe doit contenir au moins 6 caractères
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>

                        <Row>
                            <Form.Group controlId="confirmPassword">
                                <Form.Label>Confirmez le mot de passe</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    isInvalid={formData.password && formData.password !== formData.confirmPassword}
                                    minLength={6}
                                    maxLength={50}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Les mots de passe ne correspondent pas
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>

                        <Row>
                            <Form.Group controlId="role">
                                <Form.Label>Rôle</Form.Label>
                                <Form.Select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Sélectionnez un rôle</option>
                                    <option value="student">Étudiant</option>
                                    <option value="teacher">Enseignant</option>
                                    <option value="admin">Administrateur</option>
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    Veuillez sélectionner un rôle
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>

                        <Row>
                            <Form.Group controlId="image">
                                <Form.Label>Photo de profil</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    required
                                />
                                <Form.Text muted>
                                    Formats acceptés: JPG, PNG (max 2MB)
                                </Form.Text>
                                {preview && (
                                    <div className="mt-2">
                                        <img 
                                            src={preview} 
                                            alt="Aperçu" 
                                            className="img-preview"
                                        />
                                    </div>
                                )}
                                <Form.Control.Feedback type="invalid">
                                    Veuillez sélectionner une image de profil
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>

                        <Row className="mt-3">
                            <Button 
                                variant="primary" 
                                type="submit"
                                disabled={loading}
                                className="submit-btn"
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Création en cours...
                                    </>
                                ) : (
                                    "Créez Votre Compte"
                                )}
                            </Button>
                        </Row>

                        <Row className="mt-3">
                            <p className="text-center">
                                Déjà un compte ? <Link to="/connecter" className="login-link">Connectez-vous</Link>
                            </p>
                        </Row>
                    </Container>
                </Form>
            </div>
        </div>
    );
};