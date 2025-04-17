import MainQuiz from './MainQuiz'
import { Routes, Route } from "react-router-dom";
import Quiz from "./Quiz";
import Result from "./Result";

export const QuizStart = () => {
  return (
      <div style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        margin: 0,
        padding: 0,
        overflow: 'hidden'
      }}>
        <Routes>
          <Route index element={<MainQuiz />} />
          <Route path="quiz" element={<Quiz />} />
          <Route path="result" element={<Result />} />
        </Routes>
      </div>
  );
};