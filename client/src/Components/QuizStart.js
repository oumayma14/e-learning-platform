import { Routes, Route, Link } from 'react-router-dom';
import MainQuiz from './MainQuiz';
import Quiz from './Quiz';
import AddQuiz from './AddQuiz';
import JoinChallenge from './JoinChallenge';
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
        <Route index element={<MainQuiz />} />
        <Route path='add-quiz' element={<AddQuiz />} />
        <Route path='quiz/:id' element={<Quiz />} />
        <Route path='join-challenge/:code' element={<JoinChallenge />} />

      </Routes>
    </div>
  );
};
