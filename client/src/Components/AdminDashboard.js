import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Button, Alert, Row, Col, Card } from 'react-bootstrap';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

const AdminDashboardWithCharts = () => {
    const navigate = useNavigate();
    const [admin, setAdmin] = useState(null);
    const [error, setError] = useState('');
    const [stats, setStats] = useState({});
    const [quizCounts, setQuizCounts] = useState([]);
    const [userScores, setUserScores] = useState([]);
    const [loading, setLoading] = useState(true);
    const minHeight = "100vh";

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const token = localStorage.getItem('admin_token');
                if (!token) {
                    navigate('/admin/login');
                    return;
                }

                const response = await axios.get('http://localhost:3002/api/admin/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAdmin(response.data.admin);

                const statsResponse = await axios.get('http://localhost:3002/api/admin/stats', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(statsResponse.data);

                const quizCountsResponse = await axios.get('http://localhost:3002/api/admin/quiz-category-counts', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setQuizCounts(quizCountsResponse.data);

                const userScoresResponse = await axios.get('http://localhost:3002/api/admin/scores', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUserScores(userScoresResponse.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching admin data:', error);
                setError('Unauthorized access. Please log in again.');
                localStorage.removeItem('admin_token');
                navigate('/admin/login');
            }
        };

        fetchAdminData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        navigate('/admin/login');
    };

    if (loading) return <Container className="text-center my-5"><p>Chargement des données...</p></Container>;
    if (error) return <Container className="text-center my-5"><p>{error}</p></Container>;

    const pieData = [
        { name: 'Apprenants', value: stats.users || 0 },
        { name: 'Formateurs', value: stats.trainers || 0 },
        { name: 'Quizzes', value: stats.quizzes || 0 }
    ];

    const COLORS = ['#007bff', '#28a745', '#ffc107'];

    return (
        <Container fluid className="mt-5" style={{ minHeight, backgroundColor: '#f4f6f9', padding: '40px' }}>
            {admin && <h1 className="text-center mb-5" style={{ fontWeight: 'bold', color: '#343a40' }}>Bienvenue, {admin.full_name}!</h1>}

            <Row className="mb-5">
                {/* Platform Stats Pie Chart */}
                <Col md={4}>
                    <Card className="shadow-sm mb-4" style={{ padding: '20px', borderRadius: '15px', backgroundColor: '#ffffff' }}>
                        <h3 className="text-center mb-4" style={{ fontWeight: 'bold', color: '#007bff' }}>Répartition des Utilisateurs et Quizzes</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>

                {/* User Scores Line Chart */}
                <Col md={4}>
                    <Card className="shadow-sm mb-4" style={{ padding: '20px', borderRadius: '15px', backgroundColor: '#ffffff' }}>
                        <h3 className="text-center mb-4" style={{ fontWeight: 'bold', color: '#007bff' }}>Scores des Utilisateurs</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={userScores} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="username" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="score" stroke="#007bff" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>

                {/* Quiz Category Bar Chart */}
                <Col md={4}>
                    <Card className="shadow-sm mb-4" style={{ padding: '20px', borderRadius: '15px', backgroundColor: '#ffffff' }}>
                        <h3 className="text-center mb-4" style={{ fontWeight: 'bold', color: '#007bff' }}>Quiz par Catégorie</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={quizCounts} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="category" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#007bff" radius={[10, 10, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>

            {/* Navigation Buttons */}
            <div className="text-center mb-5" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '15px' }}>
    <Button variant="primary" as={Link} to="/admin/users" style={{ minWidth: '220px', padding: '15px 30px', fontWeight: 'bold', backgroundColor: '#007bff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,123,255,0.3)' }}>
        Gérer les utilisateurs
    </Button>
    <Button variant="secondary" as={Link} to="/admin/quizzes" style={{ minWidth: '220px', padding: '15px 30px', fontWeight: 'bold', backgroundColor: '#6c757d', borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(108,117,125,0.3)' }}>
     Gérer les quizzes
    </Button>
    <Button variant="info" as={Link} to="/admin/scores" style={{ minWidth: '220px', padding: '15px 30px', fontWeight: 'bold', backgroundColor: '#17a2b8', borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(23,162,184,0.3)' }}>
     Voir les scores des utilisateurs
    </Button>
    <Button variant="info" as={Link} to="/admin/export" style={{ minWidth: '220px', padding: '15px 30px', fontWeight: 'bold', backgroundColor: '#20c997', borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(32,201,151,0.3)' }}>
     Exporter les scores
    </Button>
    <Button variant="danger" onClick={handleLogout} style={{ minWidth: '220px', padding: '15px 30px', fontWeight: 'bold', backgroundColor: '#dc3545', borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(220,53,69,0.3)' }}>
    Déconnexion
    </Button>
</div>
        </Container>
    );
};

export default AdminDashboardWithCharts;
