const pool = require('../config/db');

class Question {
  static async create(quizId, questionData) {
    let conn;
    try {
      conn = await pool.getConnection();
      conn.query = require('util').promisify(conn.query); // ⬅️ For async/await
      await conn.query('START TRANSACTION');

      const { questionText, questionType, questionOrder } = questionData;

      const result = await conn.query(
        `INSERT INTO questions 
      (quiz_id, question_text, question_type, question_order, correct_short_answer) 
        VALUES (?, ?, ?, ?, ?)`,
        [quizId, questionText, questionType, questionOrder || 0, questionData.correctShortAnswer || null]
        [
          quizId,
          questionText,
          questionType,
          questionOrder || 0
        ]
      );

      const insertId = result.insertId;
      if (!insertId) {
        throw new Error('Failed to get insert ID from database');
      }

      await conn.query('COMMIT');
      return insertId;
    } catch (error) {
      if (conn) await conn.query('ROLLBACK');
      throw error; // Removed logging
    } finally {
      if (conn) conn.release();
    }
  }

  static async addOptions(questionId, options) {
    let conn;
    try {
      conn = await pool.getConnection();
      conn.query = require('util').promisify(conn.query);
      await conn.query('START TRANSACTION');

      const values = options.map((opt, index) => [
        questionId,
        opt.text,
        opt.isCorrect || false,
        index
      ]);

      // Build VALUES placeholders dynamically
      const placeholders = values.map(() => '(?, ?, ?, ?)').join(', ');
      const flatValues = values.flat();

      await conn.query(
        `INSERT INTO options 
        (question_id, option_text, is_correct, option_order) 
        VALUES ${placeholders}`,
        flatValues
      );

      await conn.query('COMMIT');
    } catch (error) {
      if (conn) await conn.query('ROLLBACK');
      throw error; // Removed logging
    } finally {
      if (conn) conn.release();
    }
  }

  static async getByQuizId(quizId) {
    let conn;
    try {
      conn = await pool.getConnection();
      conn.query = require('util').promisify(conn.query);

      const questions = await conn.query(
        'SELECT * FROM questions WHERE quiz_id = ? ORDER BY question_order',
        [quizId]
      );

      for (const question of questions) {
        const options = await conn.query(
          'SELECT * FROM options WHERE question_id = ? ORDER BY option_order',
          [question.id]
        );
        question.options = options;
      }

      return questions;
    } finally {
      if (conn) conn.release();
    }
  }
}

module.exports = Question;
