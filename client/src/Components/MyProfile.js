import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import defaultAvatar from "../assets/default-avatar.png";
import "../Styles/MyProfile.css";

export default function MyProfile() {
  const { user, logout, setUser } = useAuth();
  const [profile, setProfile] = useState({
    username: "",
    name: "",
    email: "",
    role: "",
    image: null,
    score: 0,
    password: "",
  });
  const [message, setMessage] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const apiUrl = process.env.REACT_APP_API_URL;
  const uploadsPath = process.env.REACT_APP_UPLOADS_PATH;
  const imageUrl = profile?.image
    ? `${apiUrl}${uploadsPath}/${profile.image}`
    : defaultAvatar;

  useEffect(() => {
    if (user) {
      setProfile({
        username: user.username || "",
        name: user.name || "",
        email: user.email || "",
        role: user.role || "",
        image: user.image || null,
        score: user.score || 0,
        password: "",
      });
    }
  }, [user]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 3000); // message disappears after 4 seconds
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/update/${user.username}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Profil mis à jour avec succès !");
        const updatedUser = data.updatedUser || data.user;

        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));

        setProfile({
          ...profile,
          ...updatedUser,
          password: "",
        });
        setIsEditing(false);
      } else {
        setMessage(data.error || "Erreur lors de la mise à jour.");
      }
    } catch (err) {
      setMessage("Erreur réseau.");
    }
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/users/${profile.username}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Compte supprimé avec succès.");
        logout();
        window.location.href = "/";
      } else {
        const data = await res.json();
        alert(data.error || "Erreur lors de la suppression.");
      }
    } catch (err) {
      alert("Erreur réseau.");
    }
  };

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
              <h3 className="profile-subtitle">Modifier vos informations</h3>
              <p className="text-muted">Mettez à jour votre profil</p>
            </div>
            <div className="col-md-4 text-md-right">
              <img
                src={imageUrl}
                alt="Profil"
                className="profile-image rounded-circle shadow"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultAvatar;
                }}
              />
            </div>
          </div>

          {message && <div className="alert alert-info mt-3">{message}</div>}

          <div className="profile-details mt-4">
            <div className="row">
              <div className="col-md-6 mb-3">
                <label>Nom d'utilisateur</label>
                <input
                  type="text"
                  name="username"
                  className="form-control"
                  value={profile.username}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label>Nom complet</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={profile.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={profile.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label>Mot de passe (laisser vide si inchangé)</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  value={profile.password}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label>Rôle</label>
                <input
                  type="text"
                  name="role"
                  className="form-control"
                  value={profile.role}
                  onChange={handleChange}
                  disabled
                />
              </div>
            </div>

            <div className="d-flex justify-content-between mt-4">
              {!isEditing ? (
                <button
                  className="btn btn-primary"
                  onClick={() => setIsEditing(true)}
                >
                  Modifier
                </button>
              ) : (
                <button className="btn btn-success" onClick={handleUpdate}>
                  Enregistrer
                </button>
              )}
              <button
                className="btn btn-danger"
                onClick={() => setShowConfirmModal(true)}
              >
                Supprimer le compte
              </button>
            </div>
          </div>
        </div>
      </div>

      {showConfirmModal && (
        <div className="modal-backdrop show d-flex justify-content-center align-items-center">
          <div className="modal-dialog shadow">
            <div className="modal-content p-3">
              <h5 className="modal-title">Confirmation</h5>
              <p>Êtes-vous sûr de vouloir supprimer votre compte ?</p>
              <div className="d-flex justify-content-end">
                <button
                  className="btn btn-secondary me-2"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Annuler
                </button>
                <button className="btn btn-danger" onClick={confirmDelete}>
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
