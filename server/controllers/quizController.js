const Quiz = require('../models/quizModel');

const validateQuizData = (data) => {
  const errors = [];
  const requiredFields = {
    title: 'string',
    description: 'string',
    difficulty: 'string',
    category: 'string'
  };

  for (const [field, type] of Object.entries(requiredFields)) {
    if (!data[field]) {
      errors.push(`${field} is required`);
    } else if (typeof data[field] !== type) {
      errors.push(`${field} must be a ${type}`);
    }
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
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create quiz',
      ...(process.env.NODE_ENV === 'development' && {
        detail: error.message
      })
    });
  }
};

exports.updateQuiz = async (req, res) => {
  try {
    const errors = validateQuizData(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation failed',
        errors 
      });
    }

    const updated = await Quiz.update(req.params.id, req.body);
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
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update quiz' 
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
