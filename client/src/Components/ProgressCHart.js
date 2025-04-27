import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { progressService } from '../services/apiService';
import CountUp from 'react-countup';
import { getLevelFromScore } from '../utils/levelUtils'; 
import '../Styles/ProgressChart.css';

const ProgressChart = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalPoints: 0, quizzesCompleted: 0, bestScore: 0 });
  const [progressData, setProgressData] = useState([]);
  const [range, setRange] = useState('year');
  const funMessages = [
    "Continue comme ça, futur champion ! 🏆",
    "Chaque jour un pas de plus 🚀",
    "Ton succès est en construction 🔥",
    "Les petits progrès font de grandes réussites ✨",
    "Tu es sur la bonne voie ! 🎯",
    "Bientôt au sommet ! ⛰️",
    "Ta persévérance paie ! 🌟",
  ];
  const [motivationalMessage, setMotivationalMessage] = useState("");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * funMessages.length);
    setMotivationalMessage(funMessages[randomIndex]);
  }, []); 

  useEffect(() => {
    if (user) {
      fetchStats();
      fetchProgress();
    }
  }, [user, range]);

  const fetchStats = async () => {
    try {
      const data = await progressService.getUserProgress(user.username, 'year');
      const totalPoints = data.reduce((sum, item) => sum + (item.totalScore || 0), 0);
      const quizzesCompleted = data.length;
      const bestScore = data.reduce((max, item) => (item.totalScore > max ? item.totalScore : max), 0);
      setStats({ totalPoints, quizzesCompleted, bestScore });
    } catch (error) {
      console.error('Erreur en récupérant les statistiques:', error.message);
    }
  };

  const fetchProgress = async () => {
    try {
      const data = await progressService.getUserProgress(user.username, range);
      const mappedData = data.map(item => ({
        period: item.date || `Mois ${item.month}`,
        totalScore: item.totalScore,
      }));
      setProgressData(mappedData);
    } catch (error) {
      console.error('Erreur en récupérant la progression:', error.message);
    }
  };

  const userLevel = getLevelFromScore(stats.totalPoints);

  return (
    <div className="progress-container">
      
      <div className="stats-cards-container">
      <p className="motivational-message">{motivationalMessage}</p>

        {/* Carte Niveau dynamique */}
        <div className="stat-card level-card" style={{ backgroundColor: userLevel.color }}>
          <h3 style={{ color: '#fff', fontSize: '1.5rem' , textAlign: 'center'}}>{userLevel.level}</h3>
        </div>
      </div>

      <h2 className="progress-title">📈 Progression Totale</h2>
      <div className="range-buttons">
        {['week', 'month', 'year'].map((r) => (
          <button
            key={r}
            className={`range-btn ${range === r ? 'active' : ''}`}
            onClick={() => setRange(r)}
          >
            {r === 'week' ? 'Semaine' : r === 'month' ? 'Mois' : 'Année'}
          </button>
        ))}
      </div>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={progressData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="totalScore" stroke="#fe6363" strokeWidth={3} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};

export default ProgressChart;
