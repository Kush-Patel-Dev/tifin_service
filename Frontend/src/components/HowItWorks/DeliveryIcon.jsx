import React from 'react';

const DeliveryIcon = ({ size = '1em', color = 'currentColor', className }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 64 64" 
      width={size} 
      height={size} 
      fill="none" 
      stroke={color} 
      strokeWidth="4" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
    >
      {/* Box */}
      <rect x="8" y="24" width="18" height="16" rx="2" />
      <path d="M 8 30 L 26 30" />
      <rect x="14" y="24" width="6" height="6" stroke="none" fill={color} />
      
      {/* Scooter Base */}
      <path d="M 20 46 L 46 46 A 8 8 0 0 0 54 38 A 8 8 0 0 0 46 30 L 28 30" />
      
      {/* Front pole and handles */}
      <path d="M 46 30 L 50 16 L 56 16" />
      
      {/* Headlight */}
      <path d="M 52 22 L 56 22 L 56 28 L 52 28 Z" />
      
      {/* Wheels */}
      <circle cx="18" cy="46" r="6" />
      <circle cx="48" cy="46" r="6" />
      
      {/* Rider Body */}
      <path d="M 28 30 L 32 18 C 34 14 38 14 40 18 L 46 22" />
      <path d="M 26 26 L 30 20" />
      
      {/* Rider Helmet */}
      <path d="M 34 10 A 8 8 0 1 1 48 16 A 8 8 0 0 1 34 10 Z" />
      
      {/* Speed lines */}
      <path d="M 2 32 L -6 32" />
      <path d="M 0 38 L -8 38" />
      <path d="M 3 44 L -5 44" />
    </svg>
  );
};

export default DeliveryIcon;
