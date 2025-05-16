const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db'); // ✅ Add this line to import the database connection
const {
  createFormateur,
  findFormateurByEmail,
  findFormateurById,
  updateFormateur,
  deleteFormateur
} = require('../models/formateur.model');

// REGISTER
exports.register = (req, res) => {
  const { nom, email, mot_de_passe } = req.body;
  bcrypt.hash(mot_de_passe, 10, (err, hash) => {
    if (err) return res.status(500).json({ message: 'Erreur de hash' });

    createFormateur(nom, email, hash, (err, result) => {
      if (err) return res.status(500).json({ message: 'Erreur création formateur', error: err });
      res.status(201).json({ message: 'Formateur créé avec succès' });
    });
  });
};

// LOGIN
exports.login = (req, res) => {
  const { email, mot_de_passe } = req.body;
  findFormateurByEmail(email, (err, results) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur' });
    if (results.length === 0) return res.status(404).json({ message: 'Formateur introuvable' });

    const formateur = results[0];
    bcrypt.compare(mot_de_passe, formateur.mot_de_passe, (err, match) => {
      if (err) return res.status(500).json({ message: 'Erreur de vérification' });
      if (!match) return res.status(401).json({ message: 'Mot de passe incorrect' });

      const token = jwt.sign(
        { id: formateur.id, email: formateur.email, role: formateur.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        token,
        user: {
          id: formateur.id,
          nom: formateur.nom,
          email: formateur.email,
          role: formateur.role
        }
      });
    });
  });
};


// GET
exports.getFormateur = (req, res) => {
  const id = req.params.id;
  findFormateurById(id, (err, results) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur' });
    if (results.length === 0) return res.status(404).json({ message: 'Formateur introuvable' });
    res.json(results[0]);
  });
};

// PUT
exports.updateFormateur = (req, res) => {
  const id = req.params.id;
  const { nom, email } = req.body;
  updateFormateur(id, nom, email, (err, result) => {
    if (err) return res.status(500).json({ message: 'Erreur mise à jour' });
    res.json({ message: 'Formateur mis à jour' });
  });
};

// DELETE
exports.deleteFormateur = (req, res) => {
  const id = req.params.id;
  deleteFormateur(id, (err, result) => {
    if (err) return res.status(500).json({ message: 'Erreur suppression' });
    res.json({ message: 'Formateur supprimé' });
  });
};

// LEADERBOARD
exports.getLeaderboard = (req, res) => {
  const formateurId = req.params.formateurId;
  const quizId = req.params.quizId;
  
  const query = `
      SELECT 
          u.username,
          up.score,
          up.created_at
      FROM quizzes q
      JOIN user_progress up ON q.id = up.quiz_id
      JOIN user u ON up.username = u.username
      WHERE q.formateur_id = ? AND q.id = ?
      ORDER BY up.score DESC, up.created_at ASC
  `;

  pool.query(query, [formateurId, quizId], (err, results) => {
      if (err) {
          console.error("Erreur récupération du classement :", err);
          return res.status(500).json({ message: "Erreur serveur" });
      }

      res.json(results);
  });
};

