import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Container, Spinner, Alert, Button, Modal, Form } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

const FormateurLeaderboard = ({ formateurId }) => {
    const { quizId } = useParams();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [feedback, setFeedback] = useState('');

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const url = `http://localhost:3002/api/formateur/${formateurId}/leaderboard/${quizId}`;
                const response = await axios.get(url);
                setUsers(response.data);
            } catch (err) {
                setError("Failed to load leaderboard");
            } finally {
                setLoading(false);
            }
        };

        if (quizId && formateurId) {
            fetchLeaderboard();
        }
    }, [formateurId, quizId]);

    const handleUserClick = async (username) => {
        try {
            const userResponse = await axios.get(`http://localhost:3002/api/users/${username}`);
            setUserEmail(userResponse.data.email);
            setSelectedUser(username);
            setShowModal(true);
            setFeedback('');
        } catch (err) {
            console.error(err);
            setFeedback('Failed to load user email. Please try again.');
        }
    };

    const handleSendEmail = async () => {
        try {
            const response = await axios.post('http://localhost:3002/api/messages/send-simple-email', {
                to: userEmail,
                subject,
                message
            });

            setFeedback(response.data.message);
            setShowModal(false);
            setSubject('');
            setMessage('');
            setSelectedUser('');
            setUserEmail('');
        } catch (err) {
            console.error(err);
            setFeedback('Failed to send email. Please try again.');
        }
    };

    if (loading) return <Spinner animation="border" variant="primary" className="d-block mx-auto mt-5" />;

    if (error) return <Alert variant="danger" className="mt-5">{error}</Alert>;

    return (
        <Container className="leaderboard-container">
            <h2 className="text-center mb-4">Formateur Leaderboard</h2>

            {feedback && <Alert variant="info">{feedback}</Alert>}

            <Table striped bordered hover responsive className="leaderboard-table">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Score</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr
                            key={index}
                            onClick={() => handleUserClick(user.username)}
                            style={{ cursor: 'pointer' }}
                        >
                            <td>{user.username}</td>
                            <td>{user.score}</td>
                            <td>{new Date(user.created_at).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Send Email to {selectedUser}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="subject">
                            <Form.Label>Subject</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter the subject"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="message" className="mt-3">
                            <Form.Label>Message</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={5}
                                placeholder="Enter your message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSendEmail}>
                        Send Email
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default FormateurLeaderboard;
