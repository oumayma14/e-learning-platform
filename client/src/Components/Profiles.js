import React, { useEffect, useState } from "react";
import axios from "axios";

export const Profiles = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3002/api/users")
      .then((response) => {
        if (Array.isArray(response.data)) {
          setUsers(response.data);
        } else {
          console.error("Invalid response format:", response.data);
        }
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  return (
    <div id="profile">
      <LeaderboardTable data={users} />
    </div>
  );
};

function LeaderboardTable({ data }) {
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
          {data
            .sort((a, b) => b.score - a.score)
            .map((user, index) => (
              <tr key={user.id || index}>
                <td>
                <img src={`http://localhost:3002/uploads/${user.image}?${new Date().getTime()}`} alt="Profil" className="profile-img" />
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
