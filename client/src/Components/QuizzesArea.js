import React from 'react';
import QuizCard from './QuizCard';
import PlaceHolder from './PlaceHolder';

function QuizzesArea(props) {
    const allQuizzes = ['quizze'];
  return (
    <div className="poppins mx-md-5 mx-3 mt-md-4 mt-3">
    {allQuizzes.length === 0 ? (
        <PlaceHolder />
    ) : (
    <div className="mx-md-5 mx-3 mt-md-4 mt-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <h2 className="h4 fw-bold mb-md-4 mb-3">Catalogue des Quizzes</h2>
      
      <div className="d-flex flex-wrap gap-md-3 gap-2">
        <QuizCard />
        <QuizCard />
        <QuizCard />
      </div>
    </div>)}
    </div>
  );
}

export default QuizzesArea;