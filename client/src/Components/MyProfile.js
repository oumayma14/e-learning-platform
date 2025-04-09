import React, { useState } from "react";

export default function MyProfile() {
  const [profile, setProfile] = useState({
    name: "Jane Doe",
    email: "jane.doe@example.com",
    bio: "Passionate about learning!",
  });

  const [editMode, setEditMode] = useState(false);

  const [stats] = useState({
    chaptersCompleted: 12,
    timeSpent: "18h 45min",
    goalsAchieved: 5,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const toggleEdit = () => setEditMode(!editMode);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Mon Profil</h2>

      {/* Profile Info */}
      <div className="bg-white p-4 rounded-2xl shadow mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Informations personnelles</h3>
          <button
            className="text-sm text-blue-500 hover:underline"
            onClick={toggleEdit}
          >
            {editMode ? "Enregistrer" : "Modifier"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-500">Nom complet</label>
            {editMode ? (
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            ) : (
              <p>{profile.name}</p>
            )}
          </div>
          <div>
            <label className="block text-sm text-gray-500">Email</label>
            {editMode ? (
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            ) : (
              <p>{profile.email}</p>
            )}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-500">Bio</label>
            {editMode ? (
              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            ) : (
              <p>{profile.bio}</p>
            )}
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <h3 className="text-xl font-semibold mb-4">
          Suivi de progression & Statistiques
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg bg-gray-50 text-center">
            <p className="text-4xl font-bold text-blue-500">
              {stats.chaptersCompleted}
            </p>
            <p>Chapitres complétés</p>
          </div>
          <div className="p-4 border rounded-lg bg-gray-50 text-center">
            <p className="text-4xl font-bold text-green-500">{stats.timeSpent}</p>
            <p>Temps passé</p>
          </div>
          <div className="p-4 border rounded-lg bg-gray-50 text-center">
            <p className="text-4xl font-bold text-purple-500">
              {stats.goalsAchieved}
            </p>
            <p>Objectifs atteints</p>
          </div>
        </div>
      </div>
    </div>
  );
}
