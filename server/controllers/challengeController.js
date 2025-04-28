const challengeModel = require('../models/challengeModel');

exports.createChallenge = async (req, res) => {
  const { quizId, challengerUsername , code} = req.body;
  try {
    const challengeId = await challengeModel.createChallenge(quizId, challengerUsername, code);
    res.json({ challengeId });
  } catch (error) {
    console.error('Erreur création challenge:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.joinChallenge = async (req, res) => {
    const { id } = req.params;
    const { opponentUsername } = req.body;
  
    try {
      const challenge = await challengeModel.getChallengeById(id);
  
      if (!challenge) {
        return res.status(404).json({ message: 'Challenge introuvable' });
      }
  
      if (challenge.opponent_username) {
        return res.status(400).json({ message: 'Déjà 2 joueurs dans ce défi' });
      }
  
      await challengeModel.joinChallenge(id, opponentUsername);
      res.json({ message: 'Challenge rejoint avec succès' });
  
    } catch (error) {
      console.error('Erreur rejoindre challenge:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  };
  

exports.submitChallengerScore = async (req, res) => {
  const { id } = req.params;
  const { challengerScore } = req.body;
  try {
    await challengeModel.submitChallengerScore(id, challengerScore);
    res.json({ message: 'Score soumis avec succès' });
  } catch (error) {
    console.error('Erreur soumettre score:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.getChallengeById = async (req, res) => {
  const { id } = req.params;
  try {
    const challenge = await challengeModel.getChallengeById(id);
    res.json(challenge);
  } catch (error) {
    console.error('Erreur récupérer challenge:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  };

};

exports.getChallengeByCode = async (req, res) => {
    const { code } = req.params;
    try {
      const challenge = await challengeModel.getChallengeByCode(code);
      if (!challenge) {
        return res.status(404).json({ message: 'Challenge non trouvé' });
      }
      res.json(challenge);
    } catch (error) {
      console.error('Erreur récupération challenge par code:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  };

exports.getAllChallenges = async (req, res) => {
    try {
      const challenges = await challengeModel.getAllChallenges();
      res.json(challenges);
    } catch (error) {
      console.error('Erreur récupération tous les challenges:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  };
  