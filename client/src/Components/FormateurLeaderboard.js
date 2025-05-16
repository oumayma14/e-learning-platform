import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Container, Spinner, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

const FormateurLeaderboard = ({ formateurId }) => {
    const { quizId } = useParams();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    if (loading) return <Spinner animation="border" variant="primary" className="d-block mx-auto mt-5" />;

    if (error) return <Alert variant="danger" className="mt-5">{error}</Alert>;

    return (
        <Container className="leaderboard-container">
            <h2 className="text-center mb-4">Formateur Leaderboard</h2>
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
                        <tr key={index}>
                            <td>{user.username}</td>
                            <td>{user.score}</td>
                            <td>{new Date(user.created_at).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default FormateurLeaderboard;
