import React from 'react';

const CloudShape = () => {
  return (
    <svg
      width="100%"  // This makes the SVG scale to the full width of its container
      height="100%"
      viewBox="0 0 420 270"  // Keeps the original aspect ratio
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"  // Ensures the SVG scales and stays centered
    >
      <defs>
        <filter id="shadow" x="-10%" y="-10%" width="150%" height="150%">
          <feOffset result="offOut" in="SourceAlpha" dx="9" dy="9" />
          <feGaussianBlur result="blurOut" in="offOut" stdDeviation="1" />
          <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
        </filter>
      </defs>
      
      <rect x="50" y="100" width="350" height="100" rx="50" ry="50" fill="#edeff3" filter="url(#shadow)" />
      <circle cx="160" cy="100" r="50" fill="#edeff3" />
      <circle cx="270" cy="100" r="90" fill="#edeff3" />
    </svg>
  );
};

export default CloudShape;
