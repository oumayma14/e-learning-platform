import 'bootstrap-icons/font/bootstrap-icons.css';
import { Container, Image, Row, Col, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import Avatar from 'react-avatar-edit';
export const Apprenant=()=>{
    /**Upload Avatar */
    const [confirmedImage, setConfirmedImage] = useState(null);
    const [src, setSrc] = useState(null);
    const [preview, setPreview] = useState(null);
    const onClose=() =>{setPreview(null);}
    const onCrop= view =>{setPreview(view);}
    const confirmImage = () => {
        if (preview) {
          setConfirmedImage(preview);} 
      };
    /*Styles */
    const sideBarStyle = {
        backgroundColor:"#42A5F5",
        fontSize:"1.5rem",
        color:"white",
         minHeight: "100vh"
    };
    const BgStyle = {
        backgroundColor:"white",
        color:"black",
        flex: 1
    };
    const inputs = {
        width: "100%",
        height:"40px ",
        border:"none",
        borderRadius: "8px",
        background:"rgb(235, 231, 231)",
        padding: "0 15px",
    };
    const groupInputs = {
        gap: "4px",
        paddingTop:"5px",
    }
    /*Inputs editing fucntions */
    const [editableFields, setEditableFields] = useState({
        nomUtilisateur: false,
        nom: false,
        email: false,
        mdp: false,
    }); 
    const [formData, setFormData] = useState({
        nomUtilisateur: "Nom d'utilisateur",
        nom: "Nom et prénom",
        email: "Email",
        mdp: "mot de passe",
    });
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const toggleEdit = (field) => {
        setEditableFields({...editableFields, [field]: !editableFields[field]});
    }
    return(
        <div className="container-fluid d-flex" style={{ padding: 0 }}>
            <div className="row">
            <div className="col-auto min-vh-100"  style={sideBarStyle}>
            <div className="d-flex justify-content-center">
            <Image src={confirmedImage} roundedCircle className="userImage" />
            </div>
            <h3>Bonjour Apprenant</h3>
            <p> Votre score est 100 points </p>
                <ul>
                    <li>
                        <a className="nav-link px-2">
                            <i className="bi bi-book" /> <span className="ms-1 d-none d-sm-inline">Cours</span>
                        </a>
                    </li>
                    <li>
                        <a className="nav-link px-2">
                            <i className="bi bi-alphabet-uppercase" /> <span className="ms-1 d-none d-sm-inline">Quiz</span>
                        </a>
                    </li>
                    <li>
                        <a className="nav-link px-2">
                            <i className="bi bi-award-fill" /> <span className="ms-1 d-none d-sm-inline">Progression</span>
                        </a>
                    </li>
                    <li>
                        <a className="nav-link px-2">
                            <i className="bi bi-chat-left" /> <span className="ms-1 d-none d-sm-inline">Messagerie</span>
                        </a>
                    </li>
                    <li>
                        <a className="nav-link px-2">
                            <i className="bi bi-box-arrow-left" /> <span className="ms-1 d-none d-sm-inline">Déconnexion</span>
                        </a>
                    </li>
                </ul>
            </div>
            </div>
            <div style={BgStyle} >
                <div className='info-bx'>
                    <h1>Informations Personnelles</h1>
                <Container>
                    <Row className='justify-content-md-center my-3'>
                    {Object.keys(formData).map((field) => (
                    <div key={field} className="input-group" style={groupInputs}>
                    <Col md={7}>
                    <input type={field === "mdp" ? "password" : "text"} name={field} value={formData[field]} onChange={handleInputChange}readOnly={!editableFields[field]} className={editableFields[field] ? "editable" : "readonly"} style={inputs} id='inputs'/>
                    </Col>
                    <Col md={4}>
                    <Button onClick={() => toggleEdit(field)}> {editableFields[field] ? "Save" : "Edit"} </Button>
                    </Col>
                    </div>
                ))}
                </Row>
                <Row className='justify-content-md-center my-3'>
                    <Col md={6}>
                        <label>Modifier Votre Image</label>
                    </Col>
                    <Col md={3}>
                    <Avatar width={400} height={300} onCrop={onCrop} onClose={onClose} src={src}/>
                    <input type='button' value="Confirmer l'Image" onClick={confirmImage} className='img-btn'/>
                    </Col>
                </Row>
                </Container>
                </div>
            
            </div>
        </div>
    )
}