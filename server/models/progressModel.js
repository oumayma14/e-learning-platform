const db = require('../config/db');
const util = require('util');
db.query = util.promisify(db.query);

const getProgressByPeriod = async (username, period) => {
  let query = '';

  if (period === 'week') {
    query = `
      SELECT DATE(created_at) as date, SUM(score) as totalScore
      FROM learner_progress
      WHERE username = ?
        AND YEARWEEK(created_at, 1) = YEARWEEK(NOW(), 1)
      GROUP BY DATE(created_at)
      ORDER BY date ASC;
    `;
  } else if (period === 'month') {
    query = `
      SELECT DATE(created_at) as date, SUM(score) as totalScore
      FROM learner_progress
      WHERE username = ?
        AND YEAR(created_at) = YEAR(NOW())
        AND MONTH(created_at) = MONTH(NOW())
      GROUP BY DATE(created_at)
      ORDER BY date ASC;
    `;
  } else if (period === 'year') {
    query = `
      SELECT MONTH(created_at) as month, SUM(score) as totalScore
      FROM learner_progress
      WHERE username = ?
        AND YEAR(created_at) = YEAR(NOW())
      GROUP BY MONTH(created_at)
      ORDER BY month ASC;
    `;
  } else {
    throw new Error('Invalid period');
  }

  const results = await db.query(query, [username]);
  return results;
};

module.exports = { getProgressByPeriod };
