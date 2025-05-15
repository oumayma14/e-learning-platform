import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button, Table, Container } from 'react-bootstrap';
import { CSVLink } from 'react-csv';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const Adminexport = () => {
    // State for user scores, platform stats, and quiz counts
    const [scores, setScores] = useState([]);
    const [stats, setStats] = useState({ users: 0, trainers: 0, quizzes: 0 });
    const [categoryCounts, setCategoryCounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch data on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('admin_token');

                // Fetch user scores
                const scoresResponse = await axios.get('http://localhost:3002/api/admin/scores', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                // Fetch platform statistics
                const statsResponse = await axios.get('http://localhost:3002/api/admin/stats', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                // Fetch quiz category counts
                const categoryCountsResponse = await axios.get('http://localhost:3002/api/admin/quiz-category-counts', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                // Update state with the fetched data
                setScores(scoresResponse.data);
                setStats(statsResponse.data);
                setCategoryCounts(categoryCountsResponse.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load data');
                setLoading(false);
            }
        };

        fetchData();
    }, []);
    const renderCategoryRows = () => {
        const rows = [];
        for (let i = 0; i < categoryCounts.length; i += 5) {
            const chunk = categoryCounts.slice(i, i + 5);
            
            // Add empty cells if the last row has less than 5 items
            while (chunk.length < 5) {
                chunk.push({ category: '', count: '' });
            }
    
            rows.push(
                <tr key={`row-${i}`}>
                    {chunk.map((category, index) => (
                        <td key={`name-${i + index}`}>{category.category}</td>
                    ))}
                </tr>
            );
            rows.push(
                <tr key={`count-${i}`}>
                    {chunk.map((category, index) => (
                        <td key={`count-${i + index}`}>{category.count}</td>
                    ))}
                </tr>
            );
        }
        return rows;
    };
    // Function to export charts as PDF
    const exportPDF = () => {
        const chartsContainer = document.getElementById('charts-container');
        html2canvas(chartsContainer).then((canvas) => {
            const pdf = new jsPDF();
            const imgData = canvas.toDataURL('image/png');
            pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
            pdf.save('platform_stats.pdf');
        });
    };

    // Handle loading and error states
    if (loading) return <Container className="text-center my-5"><p>Loading data...</p></Container>;
    if (error) return <Container className="text-center my-5"><p>{error}</p></Container>;

    return (
        <Container fluid style={{ backgroundColor: '#f9f9f9', minHeight: '100vh', padding: '20px' }}>
            <div id="charts-container" style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
                <h2 className="text-center mb-4">Scores d'utilisateurs et statistiques de la plateforme</h2>

                {/* User Scores Line Chart */}
                <p>Ce graphique représente les scores de tous les utilisateurs de la plateforme. Il fournit une vue d'ensemble détaillée des performances des utilisateurs, aidant les administrateurs à suivre les progrès et à identifier les utilisateurs les plus performants.</p>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={scores} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="username" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="score" stroke="#007bff" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>

                {/* Platform Stats Table */}
                <p className="mt-4">Le tableau ci-dessous fournit un résumé détaillé des statistiques globales de la plateforme, y compris le nombre total d'apprenants (Apprenants), de formateurs (Formateurs) et de quiz.</p>
                <Table striped bordered hover responsive className="mt-4">
                    <thead>
                        <tr>
                            <th>Catégorie</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Apprenants</td>
                            <td>{stats.users}</td>
                        </tr>
                        <tr>
                            <td>Formateurs</td>
                            <td>{stats.trainers}</td>
                        </tr>
                        <tr>
                            <td>Quizzes</td>
                            <td>{stats.quizzes}</td>
                        </tr>
                    </tbody>
                </Table>

                {/* Quiz Category Counts Table */}
                <p className="mt-4">Le tableau ci-dessous présente le nombre de quiz pour chaque catégorie.</p>
                <Table striped bordered hover responsive className="mt-4 text-center">
                    <tbody>
                        {renderCategoryRows()}
                    </tbody>
                </Table>

            </div>

            {/* Export Buttons */}
            <div className="text-center">
                <Button variant="primary" href="/admin/dashboard">Retour au tableau de bord</Button>
                <CSVLink data={scores} filename="user_scores.csv" className="btn btn-success ml-3">Exporter les scores au format CSV</CSVLink>
                <Button variant="warning" onClick={exportPDF} className="ml-3">Exporter en PDF</Button>
            </div>
        </Container>
    );
};

export default Adminexport;
