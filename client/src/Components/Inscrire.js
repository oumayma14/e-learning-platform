import { Container, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import React, {useState} from "react";
import Axios from 'axios';

export const Inscrire=()=>{
    //useState to hold our inputs
    const [username, setUsername]= useState('')
    const [name, setName]= useState('')
    const [email, setEmail]= useState('')
    const [password, setPassword]= useState('')
    const [role, setRole]= useState("")

    // onclick will get what the user entered
    const createUser =() =>{
        //axios to create api that connects to the server
        Axios.post('http://localhost:3002/register', {
            //variables to send to the server 
            Username: username,
            Name: name,
            Email: email,
            Password: password,
            Role: role
        }).then(() =>{
            console.log("User has been created")
        })
    }

    return(
    <div className="main" >
        <h1>Inscription</h1>
        <div className="bx">
            <div className="bx-cnt">
                <form>
                <Container>
                    <Row>
                    <label>Nom d'utilisateur</label>
                    <input type="text" className="form-control" onChange={(event) =>{
                        setUsername(event.target.value)
                    }} />
                    </Row>
                    <Row>
                    <label>Nom</label>
                    <input type="text" className="form-control"  onChange={(event) =>{
                        setName(event.target.value)
                    }} />
                    </Row>
                    <Row >
                    <label>Email</label>
                    <input type="text" className="form-control" onChange={(event) =>{
                        setEmail(event.target.value)
                    }}/>
                    </Row>
                    <Row>
                    <label>Mot de Passe</label>
                    <input type="password" className="form-control"  onChange={(event) =>{
                        setPassword(event.target.value)
                    }}/>
                    </Row>
                    <Row>
                    <label>Rôle</label>
                    <input type="text" className="form-control"  onChange={(event) =>{
                        setRole(event.target.value)
                    }}/>
                    </Row>
                    <Row>
                        <Link to="/">
                            <Button variant="primary" type="submit" onClick={createUser}>Créez Votre Compte</Button>
                        </Link>
                    </Row>
            </Container>
            </form>
            </div>
        </div>
        </div>
    )
}