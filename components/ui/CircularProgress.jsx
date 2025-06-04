import React from 'react';

const CircularProgress = ({ name, progress, sz = 150 }) => {

  let size = sz;
  let strokeWidth = 6;
  let primaryColor = "#2563EB";
  let trackColor = "#E0F2FE";

  const radius = size / 2 - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;
  return (

    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle
          stroke={trackColor}
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          stroke={primaryColor}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <p className="text-sm font-bold text-blue-800">{name}</p>
        <p className="text-xs text-gray-600">{progress}%</p>
      </div>
    </div>

  )
}

export default CircularProgress