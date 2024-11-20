import React from 'react';

const CircleSector = ({ radius, centerX, centerY, angle, rotation, thickness, color }) => {
  const calculatePath = () => {
    const innerRadius = radius - thickness;

    if (angle === 360) {
      return `
        M ${centerX + radius},${centerY}
        A ${radius},${radius} 0 1,1 ${centerX - radius},${centerY}
        A ${radius},${radius} 0 1,1 ${centerX + radius},${centerY}
        M ${centerX + innerRadius},${centerY}
        A ${innerRadius},${innerRadius} 0 1,0 ${centerX - innerRadius},${centerY}
        A ${innerRadius},${innerRadius} 0 1,0 ${centerX + innerRadius},${centerY}
      `;
    }

    const startAngle = 0;
    const endAngle = angle;

    const x1 = centerX + radius * Math.cos((startAngle * Math.PI) / 180);
    const y1 = centerY + radius * Math.sin((startAngle * Math.PI) / 180);
    const x2 = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
    const y2 = centerY + radius * Math.sin((endAngle * Math.PI) / 180);

    const x3 = centerX + innerRadius * Math.cos((endAngle * Math.PI) / 180);
    const y3 = centerY + innerRadius * Math.sin((endAngle * Math.PI) / 180);
    const x4 = centerX + innerRadius * Math.cos((startAngle * Math.PI) / 180);
    const y4 = centerY + innerRadius * Math.sin((startAngle * Math.PI) / 180);

    return `
      M ${x1},${y1}
      A ${radius},${radius} 0 ${endAngle > 180 ? 1 : 0},1 ${x2},${y2}
      L ${x3},${y3}
      A ${innerRadius},${innerRadius} 0 ${endAngle > 180 ? 1 : 0},0 ${x4},${y4}
      Z
    `;
  };

  return (
    <path
      d={calculatePath()}
      fill={color}
      transform={`rotate(${rotation} ${centerX} ${centerY})`}
    />
  );
};

export default CircleSector;
