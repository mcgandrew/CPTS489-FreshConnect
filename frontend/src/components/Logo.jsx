import React from 'react';

const Logo = () => {
  return (
    <svg
      version="1.1"
      baseProfile="full"
      width="320"  // Increased width
      height="100"  // Increased height
      viewBox="0 0 240 70"  // Expanded viewBox to match new dimensions
      xmlns="http://www.w3.org/2000/svg"
      style={{ background: 'transparent' }}
    >
      {/* Leaf Icon - Improved Design */}
      <g id="leaf-icon" transform="translate(10, 10)">  {/* Moved icon to provide more space */}
        <path
          d="M25 10 
             C 40 0, 50 15, 40 30 
             C 30 45, 10 45, 5 30 
             C 0 15, 15 5, 25 10 
             Z"
          fill="#45a049"
          stroke="#378639"
          strokeWidth="1"
        />
        
        {/* Leaf vein */}
        <path
          d="M25 10 
             C 25 15, 23 25, 22 35"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        
        {/* Additional veins for detail */}
        <path
          d="M25 15 
             C 30 20, 32 25, 33 30"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1"
          strokeLinecap="round"
        />
        
        <path
          d="M22 20 
             C 18 25, 15 28, 12 30"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1"
          strokeLinecap="round"
        />
        
        {/* Stem */}
        <path
          d="M22 35
             C 22 40, 20 45, 18 48"
          fill="none"
          stroke="#378639"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>

      {/* Text - Fresh Connect */}
      <text
        id="fresh-text"
        x="65"  // Adjusted position
        y="35"  // Adjusted position
        fontFamily="'Segoe UI', Arial, sans-serif"
        fontSize="22"
        fontWeight="600"
        fill="#333333"
      >
        Fresh
      </text>
      
      <text
        id="connect-text"
        x="122"  // Adjusted position
        y="35"  // Adjusted position
        fontFamily="'Segoe UI', Arial, sans-serif"
        fontSize="22"
        fontWeight="600"
        fill="#45a049"
      >
        Connect
      </text>
      
      {/* Tagline */}
      <text
        id="tagline"
        x="65"  // Adjusted position
        y="50"  // Adjusted position
        fontFamily="'Segoe UI', Arial, sans-serif"
        fontSize="10"
        fontWeight="400"
        fill="#666666"
        letterSpacing="0.5"
      >
        FARM TO TABLE MARKETPLACE
      </text>
      
      {/* Connect dot accent */}
      
    </svg>
  );
}

export default Logo;
