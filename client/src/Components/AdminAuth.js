import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Form, Button, Alert, Row, Col } from 'react-bootstrap';

const AdminAuth = ({ isLogin = false }) => {
    const minHeight = "100vh";
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', password: '', email: '', full_name: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const baseUrl = 'http://localhost:3002/api/admin';
            const url = isLogin ? `${baseUrl}/login` : `${baseUrl}/register`;
            const payload = isLogin
                ? { username: formData.username, password: formData.password }
                : formData;
            
            const response = await axios.post(url, payload);

            if (isLogin) {
                localStorage.setItem('admin_token', response.data.token);
                navigate('/admin/dashboard');
            } else {
                alert('Admin registered successfully. You can now log in.');
                navigate('/admin/login');
            }
        } catch (error) {
            console.error('Error:', error);
            setError(error.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <Container className="mt-5" style={{ minHeight }}>
            <Row className="justify-content-center">
                <Col xs={12} sm={10} md={8} lg={6} xl={5}>
                    <h2 className="text-center mb-4">
                        {isLogin ? 'Admin Login' : 'Admin Registration'}
                    </h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        {!isLogin && (
                            <Form.Group className="mb-3">
                                <Form.Label>Full Name</Form.Label>
                                <Form.Control type="text" name="full_name" placeholder="Enter full name" onChange={handleChange} required />
                            </Form.Group>
                        )}
                        <Form.Group className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" name="username" placeholder="Enter username" onChange={handleChange} required />
                        </Form.Group>
                        {!isLogin && (
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" name="email" placeholder="Enter email" onChange={handleChange} required />
                            </Form.Group>
                        )}
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" name="password" placeholder="Enter password" onChange={handleChange} required />
                        </Form.Group>
                        <Button type="submit" variant="primary" className="w-100 mb-3">
                            {isLogin ? 'Login' : 'Register'}
                        </Button>
                    </Form>
                    <div className="text-center">
                        {isLogin ? (
                            <p>
                                Don't have an account? <Link to="/admin/register">Register here</Link>
                            </p>
                        ) : (
                            <p>
                                Already have an account? <Link to="/admin/login">Login here</Link>
                            </p>
                        )}
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default AdminAuth;
