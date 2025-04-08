import React, { useEffect, useState, useMemo } from "react";
import { leaderboardService } from "../services/apiService";
import defaultAvatar from "../assets/default-avatar.png"; // Make sure this path is correct

export const Profiles = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await leaderboardService.getLeaderboard();
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          setError("Invalid data format received");
        }
      } catch (err) {
        setError(err.message || "Error fetching leaderboard");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const sortedData = useMemo(() => {
    return [...users].sort((a, b) => b.score - a.score);
  }, [users]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div id="profile">
      <LeaderboardTable data={sortedData} defaultAvatar={defaultAvatar} />
    </div>
  );
};

function LeaderboardTable({ data, defaultAvatar }) {
  if (!data.length) return <p>Aucun utilisateur trouvé.</p>;

  return (
    <div className="leaderboard-container">
      <h1 className="leaderboard-title">Tableau de bord</h1>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Photo</th>
            <th>Nom</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {data.map((user, index) => (
            <tr key={user.id || index}>
              <td>
                <img 
                  src={user.image 
                    ? `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_UPLOADS_PATH}/${user.image}`
                    : defaultAvatar
                  }
                  alt="Profil"
                  className="profile-img"
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = defaultAvatar;
                  }}
                />
              </td>
              <td>{user.username}</td>
              <td>{user.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}