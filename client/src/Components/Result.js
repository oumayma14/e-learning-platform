import React from 'react';
import '../Styles/Result.css';
import { Link } from 'react-router-dom';


export default function Result() {
    function onRestart(){
        console.log('on Restart')
    }
    return (
        <div className="result-container">
            <div className="result-card">
                <h1 className="result-title">Résultats du Quiz</h1>
                
                <div className="result-grid">
                    <div className="result-item">
                        <span className="result-label">Nom d'utilisateur</span>
                        <span className="result-value">Daily Tuition</span>
                    </div>
                    <div className="result-item">
                        <span className="result-label">Points totaux</span>
                        <span className="result-value">50</span>
                    </div>
                    <div className="result-item">
                        <span className="result-label">Questions</span>
                        <span className="result-value">05</span>
                    </div>
                    <div className="result-item">
                        <span className="result-label">Tentatives</span>
                        <span className="result-value">03</span>
                    </div>
                    <div className="result-item highlight">
                        <span className="result-label">Points obtenus</span>
                        <span className="result-value">30</span>
                    </div>
                    <div className="result-item highlight">
                        <span className="result-label">Statut</span>
                        <span className="result-value passed">Réussi</span>
                    </div>
                </div>
                <div className='start'>
                    <Link className='btn' to={'../catalogue/quiz-start'} onClick={onRestart}>Restart</Link>
                </div>
            </div>
        </div>
    );
}