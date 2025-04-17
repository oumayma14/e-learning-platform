import React, { useEffect } from "react";
import { useState } from "react";
import data from './data';
import '../Styles/Questions.css'

export default function Questions() {
    const [checked, setChecked] = useState(undefined);
    const question = data[0];

    useEffect(() => {
        console.log(question);
    }, [question]);

    function onSelect() {
        setChecked(true);
        console.log('radio button change');
    }

    return (
        <div className="questions-container">
            <h2 className="question-text">{question.question}</h2>
            <ul className="options-list">
                {question.options.map((option, i) => (
                    <li key={`${question.id}-${i}`} className="option-item">
                        <input 
                            type="radio"
                            value={checked}
                            name="options"
                            id={`q${i}-option`}
                            onChange={onSelect}
                            className="radio-input"
                        />    
                        <label className="option-label" htmlFor={`q${i}-option`}>
                            {option}
                        </label>
                        <div className="check"></div>
                    </li>
                ))}
            </ul>
        </div>
    );
}