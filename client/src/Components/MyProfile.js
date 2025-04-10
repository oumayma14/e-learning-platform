import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import defaultAvatar from "../assets/default-avatar.png";
import "../Styles/MyProfile.css";

export default function MyProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    username: user?.username || "", 
    name: user?.name || "", 
    email: user?.email || "", 
    role: user?.role || "", 
    image: user?.image || null
  });

  const apiUrl = process.env.REACT_APP_API_URL;
  const uploadsPath = process.env.REACT_APP_UPLOADS_PATH;
  const imageUrl = user?.image ? `${apiUrl}${uploadsPath}/${user.image}` : defaultAvatar;

  useEffect(() => {
    if (user) {
      setProfile({ 
        username: user.username, 
        name: user.name, 
        email: user.email, 
        role: user.role, 
        image: user.image 
      });
    }
  }, [user]);

  return (
    <div className="profile-container">
      <div className="profile-header text-center mb-5">
        <h2 className="profile-title">Mon Profil</h2>
        <div className="profile-header-divider"></div>
      </div>

      <div className="profile-card card shadow-lg">
        <div className="card-body p-4 p-md-5">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h3 className="profile-subtitle">Informations personnelles</h3>
              <p className="text-muted">Gérez vos informations de profil</p>
            </div>
            <div className="col-md-4 text-md-right">
              <div className="profile-image-container">
                <img 
                  src={imageUrl}
                  alt="Profil"
                  className="profile-image rounded-circle shadow"
                  onError={(e) => { e.target.onerror = null; e.target.src = defaultAvatar; }}
                />
              </div>
            </div>
          </div>

          <div className="profile-details mt-4">
            <div className="row">
              <div className="col-md-6 mb-4">
                <div className="profile-info-item">
                  <label>Nom d'utilisateur</label>
                  <p className="profile-info-value">{profile.username}</p>
                </div>
              </div>
              <div className="col-md-6 mb-4">
                <div className="profile-info-item">
                  <label>Nom complet</label>
                  <p className="profile-info-value">{profile.name}</p>
                </div>
              </div>
              <div className="col-md-6 mb-4">
                <div className="profile-info-item">
                  <label>Email</label>
                  <p className="profile-info-value">{profile.email}</p>
                </div>
              </div>
              <div className="col-md-6 mb-4">
                <div className="profile-info-item">
                  <label>Rôle</label>
                  <p className="profile-info-value">
                    <span className="profile-role-badge">{profile.role}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}