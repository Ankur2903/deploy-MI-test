import React, { useMemo, useState } from 'react';

const PredefinedPoints = ({ points, mx, thickness, scale }) => {
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
            x: 0 + base.x,
            y: 0 + base.y,
          },
          {
            id: base.id + 0.2,
            x: 0 + base.x + base.w * Math.cos(aa * base.angle),
            y: 0 + base.y + base.w * Math.sin(aa * base.angle),
          },
          {
            id: base.id + 0.3,
            x: 0 + base.x - base.h * Math.sin(aa * base.angle),
            y: 0 + base.y + base.h * Math.cos(aa * base.angle),
          },
          {
            id: base.id + 0.4,
            x: 0 + base.x - base.h * Math.sin(aa * base.angle) + base.w * Math.cos(aa * base.angle),
            y: 0 + base.y + base.h * Math.cos(aa * base.angle) + base.w * Math.sin(aa * base.angle),
          }
        );
      } 
      else if (base.type === 'circle') {
        result.push({
            id: base.id + 0.1,
            x: 0 + base.x,
            y: 0 + base.y,
          },
          {
            id: base.id + 0.2,
            x: 0 + base.x + (base.r/Math.cos(aa*base.angle/2))*Math.cos(aa*(base.rotation + base.angle/2)),
            y: 0 + base.y + (base.r/Math.cos(aa*base.angle/2))*Math.sin(aa*(base.rotation + base.angle/2)),
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
        {predefinedPoints.map((point) => (
          <circle key={point.id} cx={0 + point.x} cy={0 + point.y} r={Math.min(2*thickness/3, 4/3)} fill={selectedIds.includes(point.id) ? 'green' : 'red'} style={{ cursor: 'pointer' }} onClick={() => handlePointClick(point.id)}/>
        ))}

        {selectedIds.length === 2 && (() => {
          const p1 = getPointById(selectedIds[0]);
          const p2 = getPointById(selectedIds[1]);
          const dist = calculateDistance(p1, p2);
          return (
            <>
              <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="green" strokeWidth={Math.min(thickness/3, 2/3)} />
              <text x={(p1.x + p2.x)/2 + 2.5*thickness} y={(p1.y + p2.y)/2 - 2.5*thickness} fontSize={Math.min(3*thickness, 6)} fill="green" transform={`rotate(${Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI)},  ${(p1.x + p2.x) / 2 + 2 * thickness}, ${(p1.y + p2.y) / 2 - 2 * thickness})`}>{(dist*mx/100).toFixed(2)} mm</text>
              {(p2.x).toFixed(2) != (p1.x).toFixed(2) && (p2.y).toFixed(2) !== (p1.y).toFixed(2) && <>
              {/* Horizontal line from p1 to aligned x of p2 */}
              <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p1.y} stroke="green" strokeWidth={Math.min(thickness/3, 2/3)} />
              <text x={(p1.x + p2.x)/2} y={p1.y + 5 + 2.5*thickness} fontSize={Math.min(3*thickness, 6)} fill="green">{(Math.abs(p2.x - p1.x)*mx/100).toFixed(2)} mm</text>
              {/* Vertical line from p2 to aligned y of p1 */}
              <line x1={p2.x} y1={p2.y} x2={p2.x} y2={p1.y} stroke="green" strokeWidth={Math.min(thickness/3, 2/3)} />
              <text x={p2.x - 2.5*thickness} y={(p1.y + p2.y) / 2} fontSize={Math.min(3*thickness, 6)} fill="green" transform={`rotate(-90, ${p2.x - 2.5*thickness}, ${(p1.y + p2.y) / 2})`}>{(Math.abs(p2.y - p1.y)*mx/100).toFixed(2)} mm </text>
              </>}
             
            </>
          );
        })()}
    </>
  );
};

export default PredefinedPoints;
