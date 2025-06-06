const Quiz = require('../models/quizModel');
const pool = require('../config/db');


const validateQuizData = (data) => {
  const errors = [];
  const requiredFields = {title: 'string',  description: 'string',  difficulty: 'string',  category: 'string', timeLimit: 'number' };
  for (const [field, type] of Object.entries(requiredFields)) {
    if (!data[field]) {
      errors.push(`${field} is required`);
    } else if (typeof data[field] !== type) {
      errors.push(`${field} must be a ${type}`);
    }
  }
  if (data.timeLimit !== undefined) {
    if (!Number.isInteger(data.timeLimit)) {
      errors.push('Time limit must be a whole number');
    } else if (data.timeLimit < 1) {
      errors.push('Time limit must be at least 1 second');
    } else if (data.timeLimit > 7200) {
      errors.push('Time limit cannot exceed 7200 seconds (2 hours)');
    }
  }
  const validDifficulties = ['Débutant', 'Intermédiaire', 'Avancé'];
  if (data.difficulty && !validDifficulties.includes(data.difficulty)) {
    errors.push(`Invalid difficulty. Must be one of: ${validDifficulties.join(', ')}`);
  }


  return errors;
};

exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.getAll();
    res.json({ success: true, data: quizzes });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch quizzes',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};


exports.getQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.getWithQuestions(req.params.id);
    if (!quiz) {
      return res.status(404).json({ 
        success: false, 
        message: 'Quiz not found' 
      });
    }
    res.json({ success: true, data: quiz });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch quiz' 
    });
  }
};

exports.createQuiz = async (req, res) => {
  try {
    const errors = validateQuizData(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation failed',
        errors 
      });
    }

    const quizId = await Quiz.create(req.body);
    res.status(201).json({ 
      success: true, 
      data: { id: quizId },
      message: 'Quiz created successfully' 
    });
  } catch (error) {
    console.error("⛔ Erreur createFullQuiz:", error);
    console.log("⛔ DATA REÇUE:", req.body);
    console.error("❌ Error creating quiz:", error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create quiz',
      ...(process.env.NODE_ENV === 'development' && {
        detail: error.message
      })
    });
  }
};
 
exports.deleteQuiz = async (req, res) => {
  try {
    const deleted = await Quiz.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ 
        success: false, 
        message: 'Quiz not found' 
      });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete quiz' 
    });
  }
};

exports.createFullQuiz = async (req, res) => {
  const { title, description, difficulty, category, questions, timeLimit} = req.body;

  // Validate quiz data
  const errors = validateQuizData({ title, description, difficulty, category, timeLimit });
  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors });
  }

  let conn;
  try {
    conn = await pool.getConnection();
    conn.query = require('util').promisify(conn.query);
    await conn.query('START TRANSACTION');

    // Insert quiz
    const result = await conn.query(
      'INSERT INTO quizze (title, description, difficulty, category, time_limit) VALUES (?, ?, ?, ?, ?)',
      [title, description, difficulty, category, timeLimit]
    );
    const quizId = result.insertId;
    // 🔐 Get formateur ID from token
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    const creatorId = decoded.id;

    // 🔗 Link quiz to formateur in formateur_quizzes
    await conn.query(
      'INSERT INTO trainer_quizzes (trainer_id, quiz_id) VALUES (?, ?)',
      [creatorId, quizId]
    );


    // Insert questions and options
    for (const question of questions) {
      const { questionText, questionType, timeLimit, questionOrder, options, correctShortAnswer } = question;

      const questionResult = await conn.query(
        'INSERT INTO quiz_questions (quiz_id, question_text, question_type, time_limit, question_order, correct_short_answer) VALUES (?, ?, ?, ?, ?, ?)',
        [quizId, questionText, questionType, timeLimit || null, questionOrder || 0, correctShortAnswer || null]
      );
      
      const questionId = questionResult.insertId;

      if (options && options.length > 0) {
        const optionValues = options.map((opt, index) => [
          questionId,
          opt.text,
          opt.isCorrect || false,
          index
        ]);
        const placeholders = optionValues.map(() => '(?, ?, ?, ?)').join(', ');
        const flatValues = optionValues.flat();

        await conn.query(
          `INSERT INTO quiz_options (question_id, option_text, is_correct, option_order) VALUES ${placeholders}`,
          flatValues
        );
      }
    }

    await conn.query('COMMIT');
    res.status(201).json({ success: true, data: { id: quizId }, message: 'Quiz and questions created successfully' });
  } catch (error) {
    if (conn) await conn.query('ROLLBACK');
    res.status(500).json({ success: false, message: 'Failed to create quiz with questions', error: error.message });
  } finally {
    if (conn) conn.release();
  }
  
};

exports.getQuizzesByFormateur = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    const formateurId = decoded.id;

    const quizzes = await Quiz.getByFormateurId(formateurId);
    res.json({ success: true, data: quizzes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
  }
};
// quizController.js
exports.updateQuiz = async (req, res) => {
  try {
      const quizId = req.params.id;
      const { title, description, difficulty, category, timeLimit } = req.body;

      // ✅ Update the main quiz details
      const updated = await Quiz.update(quizId, {
          title, 
          description, 
          difficulty, 
          category, 
          timeLimit
      });

      if (!updated) {
          return res.status(404).json({
              success: false,
              message: 'Quiz not found'
          });
      }

      res.json({
          success: true,
          message: 'Quiz updated successfully'
      });

  } catch (error) {
      console.error("Error updating quiz:", error);
      res.status(500).json({
          success: false,
          message: 'Failed to update quiz',
          ...(process.env.NODE_ENV === 'development' && { detail: error.message })
      });
  }
};

