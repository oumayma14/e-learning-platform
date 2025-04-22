import { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import MainQuiz from './MainQuiz';
import Quiz from './Quiz';
import AddQuiz from './AddQuiz';

export const QuizStart = () => {

  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      margin: 0,
      padding: 0,
      overflow: 'hidden',
    }}>
      <Routes>
        {/* Main route showing the main quiz list and AddQuiz button */}
        <Route 
          index 
          element={<MainQuiz />} 
        />
        
        {/* Route to AddQuiz form */}
        <Route path='add-quiz' element={<AddQuiz />} />
        
        {/* Dynamic route for a specific quiz */}
        <Route path='quiz/:id' element={<Quiz />} />
      </Routes>
    </div>
  );
};
