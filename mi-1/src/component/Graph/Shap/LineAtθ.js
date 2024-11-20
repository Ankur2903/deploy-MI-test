import React from 'react';

const LineAtTheta = ({x, y, w, h, angle, color}) => {
  const centerX = x;  // Calculate center for rotation
  const centerY = y;

  return (
    <>
      <rect x={x} y={y} width={w} height={h} fill={color} 
        transform={`rotate(${angle}, ${centerX}, ${centerY})`}
      />
    </>
  );
};

export default LineAtTheta;
