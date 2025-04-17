import React from 'react'
import Questions from './Questions'
import '../Styles/Quiz.css'

export default function Quiz() {
    function onNext(){
        console.log("on next click")
    }
    function onPrev(){
        console.log('on prev click')
    }
    
    return (
        <div className="quiz-app">
            <h1 className="quiz-app__title">Quiz Application</h1>
            
            <Questions />
            
            <div className="quiz-app__nav-buttons">
                <button className="quiz-app__button quiz-app__button--prev" onClick={onPrev}>Prev</button>
                <button className="quiz-app__button quiz-app__button--next" onClick={onNext}>Next</button>
            </div>
        </div>
    )
}