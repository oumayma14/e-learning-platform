import { useState } from 'react';
import MainQuiz from './MainQuiz';
import { Routes, Route } from "react-router-dom";
import Quiz from './Quiz';
import AddQuiz from './AddQuiz';

export const QuizStart = () => {
  const [showAddQuizModal, setShowAddQuizModal] = useState(false);

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
        <Route index element={
          <>
            <MainQuiz onAddQuizClick={() => setShowAddQuizModal(true)} />
            {showAddQuizModal && (
              <AddQuiz onClose={() => setShowAddQuizModal(false)} />
            )}
          </>
        } />
        <Route path='quiz/:id' element={<Quiz/>}/>
      </Routes>
    </div>
  );
};