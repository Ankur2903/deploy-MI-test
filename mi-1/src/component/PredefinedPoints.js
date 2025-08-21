import React, { useMemo, useState } from 'react';

const PredefinedPoints = ({ points, mx, thickness }) => {
  const aa = Math.PI / 180;

  // Generate predefined points only once
  const predefinedPoints = useMemo(() => {
    const result = [];
    for (let i = 0; i < points.length; i++) {
      const base = points[i];
      if (base.type === 'line') {
        result.push(
          {
            id: base.id + 0.1,
            x: base.x,
            y: base.y,
          },
          {
            id: base.id + 0.2,
            x: base.x + base.w * Math.cos(aa * base.angle),
            y: base.y + base.w * Math.sin(aa * base.angle),
          },
          {
            id: base.id + 0.3,
            x: base.x - base.h * Math.sin(aa * base.angle),
            y: base.y + base.h * Math.cos(aa * base.angle),
          },
          {
            id: base.id + 0.4,
            x: base.x - base.h * Math.sin(aa * base.angle) + base.w * Math.cos(aa * base.angle),
            y: base.y + base.h * Math.cos(aa * base.angle) + base.w * Math.sin(aa * base.angle),
          }
        );
      } 
      else if (base.type === 'circle') {
        result.push({
            id: base.id + 0.1,
            x: base.x,
            y: base.y,
          },
          {
            id: base.id + 0.2,
            x:
              base.x +
              (base.r / Math.cos(aa * base.angle / 2)) *
                Math.cos(aa * (base.rotation + base.angle / 2)),
            y:
              base.y +
              (base.r / Math.cos(aa * base.angle / 2)) *
                Math.sin(aa * (base.rotation + base.angle / 2)),
          }
        );
      }
    }
    return result;
  }, [points]);

  const [selectedIds, setSelectedIds] = useState([]);

  const handlePointClick = (id) => {
    if (selectedIds.length === 2) {
      setSelectedIds([id]); // Reset with new first point
    } else if (!selectedIds.includes(id)) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const getPointById = (id) => predefinedPoints.find((p) => p.id === id);

  const calculateDistance = (p1, p2) => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy).toFixed(2);
  };

  return (
    <>
      <svg width="100%" height="500px" style={{ border: '1px solid black' }}>
        {predefinedPoints.map((point) => (
          <circle key={point.id} cx={point.x} cy={point.y} r="1.3" fill={selectedIds.includes(point.id) ? 'green' : 'red'} style={{ cursor: 'pointer' }} onClick={() => handlePointClick(point.id)}/>
        ))}

        {selectedIds.length === 2 && (() => {
          const p1 = getPointById(selectedIds[0]);
          const p2 = getPointById(selectedIds[1]);
          const dist = calculateDistance(p1, p2);
          return (
            <>
              <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="green" strokeWidth="1"/>
              <text x={(p1.x + p2.x)/2 + 2.5*thickness} y={(p1.y + p2.y)/2 - 2.5*thickness} fontSize="5" fill="green" transform={`rotate(${Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI)},  ${(p1.x + p2.x) / 2 + 2 * thickness}, ${(p1.y + p2.y) / 2 - 2 * thickness})`}>{(dist*mx/100).toFixed(2)} mm</text>
              {(p2.x).toFixed(2) != (p1.x).toFixed(2) && (p2.y).toFixed(2) !== (p1.y).toFixed(2) && <>
              {/* Horizontal line from p1 to aligned x of p2 */}
              <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p1.y} stroke="green" strokeWidth="1" />
              <text x={(p1.x + p2.x)/2} y={p1.y + 5 + 2.5*thickness} fontSize="5" fill="green">{(Math.abs(p2.x - p1.x)*mx/100).toFixed(2)} mm</text>
              {/* Vertical line from p2 to aligned y of p1 */}
              <line x1={p2.x} y1={p2.y} x2={p2.x} y2={p1.y} stroke="green" strokeWidth="1" />
              <text x={p2.x - 2.5*thickness} y={(p1.y + p2.y) / 2} fontSize="5" fill="green" transform={`rotate(-90, ${p2.x - 2.5*thickness}, ${(p1.y + p2.y) / 2})`}>{(Math.abs(p2.y - p1.y)*mx/100).toFixed(2)} mm </text>
              </>}
             
            </>
          );
        })()}
      </svg>
      <p>Click any two points to measure distance.</p>
    </>
  );
};

export default PredefinedPoints;
