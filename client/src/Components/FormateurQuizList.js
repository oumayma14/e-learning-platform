import React, { useEffect, useState } from 'react';

const FormateurQuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuizzes = async () => {
      const token = localStorage.getItem('formateurToken'); // Adjust to your auth storage
      try {
        const response = await fetch('http://localhost:3002/api/quizzes/formateur/quizzes', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch quizzes');
        }

        setQuizzes(data.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchQuizzes();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Mes Quiz</h2>

      {error && <p className="text-red-500">{error}</p>}

      {quizzes.length === 0 && !error ? (
        <p>Vous n'avez pas encore créé de quiz.</p>
      ) : (
        <ul className="space-y-2">
          {quizzes.map((quiz) => (
            <li key={quiz.id} className="p-4 border rounded shadow">
              <h3 className="text-lg font-semibold">{quiz.title}</h3>
              <p className="text-sm text-gray-600">{quiz.description}</p>
              <p className="text-sm">Difficulté: {quiz.difficulty}</p>
              <p className="text-sm">Catégorie: {quiz.category}</p>
              <p className="text-sm">Durée: {quiz.time_limit} sec</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FormateurQuizList;
