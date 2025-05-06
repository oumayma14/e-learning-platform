const db = require('../config/db');

const createFormateur = (nom, email, mot_de_passe, callback) => {
    const sql = 'INSERT INTO formateurs (nom, email, mot_de_passe, role) VALUES (?, ?, ?, ?)';
    db.query(sql, [nom, email, mot_de_passe, 'formateur'], callback);
  };

const findFormateurByEmail = (email, callback) => {
  db.query('SELECT * FROM formateurs WHERE email = ?', [email], callback);
};

const findFormateurById = (id, callback) => {
  db.query('SELECT id, nom, email FROM formateurs WHERE id = ?', [id], callback);
};

const updateFormateur = (id, nom, email, callback) => {
  db.query('UPDATE formateurs SET nom = ?, email = ? WHERE id = ?', [nom, email, id], callback);
};

const deleteFormateur = (id, callback) => {
  db.query('DELETE FROM formateurs WHERE id = ?', [id], callback);
};

module.exports = {
  createFormateur,
  findFormateurByEmail,
  findFormateurById,
  updateFormateur,
  deleteFormateur
};
