import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faPlay, faCode } from "@fortawesome/free-solid-svg-icons";
import targetImage from "../assets/target-777.png";

const QuizCard = () => {
  return (
    <div className="rounded border border-light bg-white p-4 mb-3 shadow-sm" style={{ 
      maxWidth: '350px', // Increased from 300px
      minHeight: '350px',
      width: '100%' // Added to ensure it expands to maxWidth
    }}>
      {/* Main content container */}
      <div className="h-100 d-flex flex-column align-items-center">
        {/* Code icon container - wider version */}
        <div 
          className="position-relative rounded mb-4"
          style={{ 
            backgroundColor: '#fe6363',
            height: '180px',
            width: 'calc(100% + 32px)', // Adjusted to match new width
            marginLeft: '-16px',
            marginRight: '-16px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <FontAwesomeIcon 
            icon={faCode} 
            className="text-white" 
            style={{ 
              width: '90px', 
              height: '90px',
              position: 'relative'
            }} 
          />
          
          {/* Ellipsis Icon */}
          <div 
            className="position-absolute"
            style={{ 
              top: '12px',
              right: '28px',
              cursor: 'pointer'
            }}
          >
            <FontAwesomeIcon 
              icon={faEllipsis} 
              className="text-white" 
              style={{ width: '15px', height: '15px', top: '20%' }} 
            />
          </div>
        </div>

        {/* Quiz Title */}
        <div className="flex-grow-1 d-flex flex-column justify-content-center text-center w-100">
          <h3 className="fw-bold text-dark mb-1" style={{ fontSize: '1.3rem' }}>Javascript Quiz</h3>
          <p className="text-secondary mb-3 small">20 Questions</p>
        </div>

        {/* Success Rate + Play Button */}
        <div className="w-100 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-1">
            <img 
              src={targetImage} 
              alt="Success rate" 
              style={{ width: '20px', height: '20px' }}
            />
            <span className="text-dark small">Success rate: 100%</span>
          </div>
          
          <div 
            className="d-flex justify-content-center align-items-center position-relative"
            style={{ 
              width: '40px',
              height: '40px',
              backgroundColor: '#fe6363',
              borderRadius: '50%'
            }}
          >
            <FontAwesomeIcon 
              icon={faPlay} 
              className="text-white position-absolute" 
              style={{ 
                width: '20px', 
                height: '20px',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizCard;