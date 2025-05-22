const pool = require('../config/db');

class Question {
  static async create(quizId, questionData) {
    let conn;
    try {
        conn = await pool.getConnection();
        conn.query = require('util').promisify(conn.query);
        await conn.query('START TRANSACTION');

        const { questionText, questionType, questionOrder, correctShortAnswer, timeLimit } = questionData;

        // ✅ Corrected the INSERT statement
        const result = await conn.query(
            `INSERT INTO quiz_questions 
            (quiz_id, question_text, question_type, question_order, correct_short_answer, time_limit) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            [quizId, questionText, questionType, questionOrder || 0, correctShortAnswer || null, timeLimit || null]
        );

        const insertId = result.insertId;
        if (!insertId) {
            throw new Error('Failed to get insert ID from database');
        }

        await conn.query('COMMIT');
        return insertId;
    } catch (error) {
        if (conn) await conn.query('ROLLBACK');
        throw error;
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
          opt.option_text,
          opt.is_correct ? 1 : 0,
          index
      ]);

      const placeholders = values.map(() => '(?, ?, ?, ?)').join(', ');
      const flatValues = values.flat();

      const result = await conn.query(
          `INSERT INTO quiz_options 
          (question_id, option_text, is_correct, option_order) 
          VALUES ${placeholders}`,
          flatValues
      );

      await conn.query('COMMIT');
      return result.insertId;
  } catch (error) {
      if (conn) await conn.query('ROLLBACK');
      throw error;
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
          'SELECT * FROM quiz_questions WHERE quiz_id = ? ORDER BY question_order',
          [quizId]
      );

      for (const question of questions) {
          const options = await conn.query(
              'SELECT * FROM quiz_options WHERE question_id = ? ORDER BY option_order',
              [question.id]
          );
          question.options = options;
      }

      return questions;
  } finally {
      if (conn) conn.release();
  }
}


  static async getById(questionId) {
    const rows = await pool.query('SELECT * FROM quiz_questions WHERE id = ?', [questionId]);
    return rows[0] || null;
}

static async update(questionId, questionData) {
  const { question_text, question_type, question_order, correct_short_answer, time_limit } = questionData;
  
  // ✅ Ensure all fields are updated correctly
  await pool.query(
      `UPDATE quiz_questions SET 
          question_text = ?, 
          question_type = ?, 
          question_order = ?, 
          correct_short_answer = ?, 
          time_limit = ?
      WHERE id = ?`,
      [question_text, question_type, question_order, correct_short_answer, time_limit, questionId]
  );
}



static async delete(questionId) {
  try {
      // ✅ Delete all associated options first
      await pool.query('DELETE FROM quiz_options WHERE question_id = ?', [questionId]);
      
      // ✅ Now delete the question itself
      const result = await pool.query('DELETE FROM quiz_questions WHERE id = ?', [questionId]);
      
      return result.affectedRows > 0;
  } catch (error) {
      throw error;
  }
}


// ✅ Add this method for deleting options
static async deleteOption(optionId) {
  try {
      const result = await pool.query(
          'DELETE FROM quiz_options WHERE id = ?',
          [optionId]
      );
      return result.affectedRows > 0;
  } catch (error) {
      throw error;
  }
}


// ✅ Corrected updateOptions method for options
static async updateOptions(questionId, options) {
  let conn;
  try {
      conn = await pool.getConnection();
      conn.query = require('util').promisify(conn.query);
      await conn.query('START TRANSACTION');

      // ✅ Separate existing and new options
      const existingOptions = options.filter(opt => opt.id);
      const newOptions = options.filter(opt => !opt.id);

      // ✅ Update existing options
      for (const option of existingOptions) {
          await conn.query(
              `UPDATE quiz_options SET 
                  option_text = ?, 
                  is_correct = ?, 
                  option_order = ? 
              WHERE id = ? AND question_id = ?`,
              [option.option_text, option.is_correct ? 1 : 0, option.option_order || 0, option.id, questionId]
          );
      }

      // ✅ Insert new options
      if (newOptions.length > 0) {
          const values = newOptions.map((opt, index) => [
              questionId,
              opt.option_text,
              opt.is_correct ? 1 : 0,
              opt.option_order || index
          ]);

          const placeholders = values.map(() => '(?, ?, ?, ?)').join(', ');
          const flatValues = values.flat();

          await conn.query(
              `INSERT INTO quiz_options (question_id, option_text, is_correct, option_order) 
              VALUES ${placeholders}`,
              flatValues
          );
      }

      await conn.query('COMMIT');
  } catch (error) {
      if (conn) await conn.query('ROLLBACK');
      throw error;
  } finally {
      if (conn) conn.release();
  }
}


}

module.exports = Question;
