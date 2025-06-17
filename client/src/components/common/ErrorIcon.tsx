import React from 'react';

const ErrorIcon: React.FC = () => {
  return (
    <svg 
      width="16" 
      height="16" 
      viewBox="0 0 100 100" 
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0 mt-0.5"
    >
      <circle cx="50" cy="50" r="45" fill="rgb(220, 38, 38)" />
      <text 
        x="50%" 
        y="50%" 
        textAnchor="middle" 
        dominantBaseline="central"
        fill="white" 
        fontSize="50" 
        fontFamily="Arial" 
        fontWeight="bold"
      >
        !
      </text>
    </svg>
  );
};

export default ErrorIcon; 