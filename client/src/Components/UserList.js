// src/Components/UserList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Container, Button, InputGroup, FormControl, Alert, Dropdown, Form, Pagination, Modal } from 'react-bootstrap';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');
    const [roleFilter, setRoleFilter] = useState("All");
    const [editingUser, setEditingUser] = useState(null);
    const [editedName, setEditedName] = useState('');
    const [editedEmail, setEditedEmail] = useState('');
    const [editedRole, setEditedRole] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(12);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const minHeight = "100vh";

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            const response = await axios.get('http://localhost:3002/api/admin/users', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUsers(response.data.users);
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('Failed to load users. Please try again.');
        }
    };

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            await axios.delete(`http://localhost:3002/api/admin/users/${userToDelete.username}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUsers(users.filter(user => user.username !== userToDelete.username));
            setShowDeleteModal(false);
            setUserToDelete(null);
            alert("Utilisateur supprimé avec succès.");
        } catch (error) {
            console.error('Error deleting user:', error);
            setError('Échec de la suppression de l\'utilisateur. Veuillez réessayer.');
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('admin_token');
            await axios.put(`http://localhost:3002/api/admin/users/${editingUser.username}`, 
                { name: editedName, email: editedEmail, role: editedRole },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setUsers(users.map(user => 
                user.username === editingUser.username 
                    ? { ...user, name: editedName, email: editedEmail, role: editedRole }
                    : user
            ));
            setEditingUser(null);
            setEditedName('');
            setEditedEmail('');
            setEditedRole('');
            alert("Utilisateur mis à jour avec succès.");
        } catch (error) {
            console.error('Error updating user:', error);
            setError('Échec de la mise à jour de l\'utilisateur. Veuillez réessayer.');
        }
    };

    const startEditing = (user) => {
        setEditingUser(user);
        setEditedName(user.name);
        setEditedEmail(user.email);
        setEditedRole(user.role);
    };

    const confirmDelete = (user) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    const filteredUsers = users.filter(user => {
        const username = String(user.username || "").toLowerCase();
        const name = String(user.name || "").toLowerCase();
        const email = String(user.email || "").toLowerCase();
        const role = String(user.role || "").toLowerCase();

        const matchesSearch = username.includes(searchTerm.toLowerCase()) ||
            name.includes(searchTerm.toLowerCase()) ||
            email.includes(searchTerm.toLowerCase());

        const matchesRole = roleFilter === "All" || role === roleFilter.toLowerCase();

        return matchesSearch && matchesRole;
    });

    // Pagination logic
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <Container className="mt-5" style={{ minHeight }}>
            <h2 className="mb-4">Gestion des utilisateurs</h2>

            {error && <Alert variant="danger">{error}</Alert>}

            <InputGroup className="mb-3">
                <FormControl
                    placeholder="Chercher des utilisateurs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Dropdown>
                    <Dropdown.Toggle variant="secondary" id="role-filter">
                        {roleFilter === "All" ? "Filtrer par rôle" : roleFilter}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => setRoleFilter("All")}>Tous</Dropdown.Item>
                        <Dropdown.Item onClick={() => setRoleFilter("Apprenant")}>Apprenant</Dropdown.Item>
                        <Dropdown.Item onClick={() => setRoleFilter("Formateur")}>Formateur</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </InputGroup>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Username/ID</th>
                        <th>Nom</th>
                        <th>Email</th>
                        <th>Rôle</th>
                        <th>Score</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentUsers.map(user => (
                        <tr key={user.username}>
                            <td>{user.username}</td>
                            <td>{editingUser && editingUser.username === user.username ? (
                                <Form.Control 
                                    value={editedName} 
                                    onChange={(e) => setEditedName(e.target.value)} 
                                />
                            ) : user.name}</td>
                            <td>{editingUser && editingUser.username === user.username ? (
                                <Form.Control 
                                    value={editedEmail} 
                                    onChange={(e) => setEditedEmail(e.target.value)} 
                                />
                            ) : user.email}</td>
                            <td>{editingUser && editingUser.username === user.username ? (
                                <Form.Select 
                                    value={editedRole} 
                                    onChange={(e) => setEditedRole(e.target.value)}
                                >
                                    <option>Apprenant</option>
                                    <option>Formateur</option>
                                </Form.Select>
                            ) : user.role}</td>
                            <td>{user.score}</td>
                            <td>
                                <Button variant="warning" size="sm" onClick={() => startEditing(user)} className="me-2">
                                    Modifier
                                </Button>
                                <Button variant="danger" size="sm" onClick={() => confirmDelete(user)}>
                                    Supprimer
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Pagination>
                {Array.from({ length: totalPages }, (_, index) => (
                    <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
                        {index + 1}
                    </Pagination.Item>
                ))}
            </Pagination>

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmer la suppression</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Êtes-vous sûr de vouloir supprimer l'utilisateur <strong>{userToDelete?.username}</strong> ? Cette action est irréversible.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Annuler
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Supprimer
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default UserList;
