const { getProgressByPeriod } = require('../models/progressModel');

exports.getUserProgress = async (req, res) => {
  const { username } = req.params;
  const { period } = req.query;

  try {
    const results = await getProgressByPeriod(username, period);
    res.json(results);
  } catch (error) {
    console.error('Progress fetch error:', error);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
};
