const db = require('../config/db');
const util = require('util');

db.query = util.promisify(db.query);

exports.createChallenge = async (quizId, challengerUsername, code) => {
  const result = await db.query(
    'INSERT INTO quiz_challenges (quiz_id, challenger_username,code) VALUES (?, ?, ?)',
    [quizId, challengerUsername, code]
  );
  return result.insertId;
};

exports.joinChallenge = async (challengeId, opponentUsername) => {
    await db.query(
      `UPDATE quiz_challenges 
       SET opponent_username = ?
       WHERE id = ?`,
      [opponentUsername, challengeId]
    );
  };
  

exports.submitChallengerScore = async (challengeId, challengerScore) => {
  await db.query(
    `UPDATE quiz_challenges 
     SET challenger_score = ?
     WHERE id = ?`,
    [challengerScore, challengeId]
  );
};

exports.getChallengeById = async (challengeId) => {
  const rows = await db.query(
    `SELECT * FROM quiz_challenges WHERE id = ?`,
    [challengeId]
  );
  return rows[0];
};

exports.getChallengeByCode = async (code) => {
    const rows = await db.query(
      `SELECT * FROM quiz_challenges WHERE code = ?`,
      [code]
    );
    return rows[0];
  };
  
  exports.getAllChallenges = async () => {
    const rows = await db.query('SELECT * FROM quiz_challenges');
    return rows;
  };
  