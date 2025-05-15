import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, Button, Container } from 'react-bootstrap';

const AdminUserScoreChart = () => {
    const [scores, setScores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const minHeight = "100vh";


    useEffect(() => {
        const fetchScores = async () => {
            try {
                const token = localStorage.getItem('admin_token');
                const response = await axios.get('http://localhost:3002/api/admin/scores', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setScores(response.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError('Failed to load scores');
                setLoading(false);
            }
        };

        fetchScores();
    }, []);

    if (loading) return <Container className="text-center my-5"><p>Loading...</p></Container>;
    if (error) return <Container className="text-center my-5"><p>{error}</p></Container>;

    return (
        <Container className="my-5" style={{ minHeight }}>
            <Card className="shadow-sm p-4">
                <h2 className="text-center mb-4">Aperçu des scores des utilisateurs</h2>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={scores} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="username" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="score" stroke="#007bff" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
                <div className="text-center mt-4">
                    <Button variant="primary" href="/admin/dashboard">Retour au tableau de bord</Button>
                </div>
            </Card>
        </Container>
    );
};

export default AdminUserScoreChart;
