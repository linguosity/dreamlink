import React from 'react';

const CloudShape = () => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 420 270"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <filter id="shadow" x="-10%" y="-10%" width="150%" height="150%">
          <feOffset result="offOut" in="SourceAlpha" dx="9" dy="9" />
          <feGaussianBlur result="blurOut" in="offOut" stdDeviation="1" />
          <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
        </filter>
        <linearGradient id="cloudGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#f3f4f6', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#ffffff', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      
      <g filter="url(#shadow)">
        <rect x="50" y="100" width="350" height="100" rx="50" ry="50" fill="url(#cloudGradient)" />
        <circle cx="160" cy="100" r="50" fill="url(#cloudGradient)" />
        <circle cx="270" cy="100" r="90" fill="url(#cloudGradient)" />
      </g>
    </svg>
  );
};

export default CloudShape;