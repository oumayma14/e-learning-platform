import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import "../Styles/MainQuiz.css"

export default function MainQuiz() {
    const inputRef = useRef(null)

    return (
        <div className='quiz-container'>
            <h1 className='quiz-title'>Quiz Application</h1>

            <ol className='quiz-instructions'>
                <li className='quiz-instructions__item'>You will be asked 10 questions one after another.</li>
                <li className='quiz-instructions__item'>10 points is awarded for the correct answer.</li>
                <li className='quiz-instructions__item'>Each question has three options. You can choose only one option.</li>
                <li className='quiz-instructions__item'>You can review and change answers before the quiz finish.</li>
                <li className='quiz-instructions__item'>The result will be declared at the end of the quiz.</li>
            </ol>

            <form className='quiz-form'>
                <input 
                    ref={inputRef}  
                    className='quiz-form__input' 
                    type="text" 
                    placeholder='Username*' 
                />
            </form>

            <div className='quiz-actions'>
                <Link className='quiz-actions__button' to={'quiz'}>Start Quiz</Link>
            </div>
        </div>
    )
}