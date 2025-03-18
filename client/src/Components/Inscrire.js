import { Container, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import Axios from "axios";
import "../Styles/Auth.css";

export const Inscrire = () => {
    // useState to hold our inputs
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [image, setImage] = useState(null);

    // onClick will get what the user entered
    const createUser = (e) => {
        e.preventDefault(); // Prevent form from reloading the page

        const formData = new FormData();
        formData.append("username", username);
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("role", role);
        if (image) formData.append("image", image); // Attach the image file

        // axios to create API that connects to the server
        Axios.post("http://localhost:3002/register", formData, {
            headers: { "Content-Type": "multipart/form-data" }, // Important for file upload
        })
            .then(() => {
                console.log("User has been created");
            })
            .catch((error) => {
                console.error("Error uploading user:", error);
            });
    };

    return (
        <div className="main">
            <h1>Inscription</h1>
            <div className="bx">
                <div className="bx-cnt">
                    <form onSubmit={createUser}>
                        <Container>
                            <Row>
                                <label>Nom d'utilisateur</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    onChange={(event) => {
                                        setUsername(event.target.value);
                                    }}
                                    required
                                />
                            </Row>
                            <Row>
                                <label>Nom</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    onChange={(event) => {
                                        setName(event.target.value);
                                    }}
                                    required
                                />
                            </Row>
                            <Row>
                                <label>Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    onChange={(event) => {
                                        setEmail(event.target.value);
                                    }}
                                    required
                                />
                            </Row>
                            <Row>
                                <label>Mot de Passe</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    onChange={(event) => {
                                        setPassword(event.target.value);
                                    }}
                                    required
                                />
                            </Row>
                            <Row>
                                <label>Rôle</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    onChange={(event) => {
                                        setRole(event.target.value);
                                    }}
                                    required
                                />
                            </Row>
                            <Row>
                                <label>Photo de profil</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    accept="image/*"
                                    onChange={(event) => setImage(event.target.files[0])}
                                    required
                                />
                            </Row>
                            <Row>
                                <Button variant="primary" type="submit">
                                    Créez Votre Compte
                                </Button>
                            </Row>
                        </Container>
                    </form>
                </div>
            </div>
        </div>
    );
};
