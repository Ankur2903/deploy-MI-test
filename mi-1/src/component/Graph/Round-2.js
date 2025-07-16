import React, { useState, useCallback, useEffect } from 'react';
import Linex from './Shap/Linex';
import Linez from './Shap/Linez';
import CircleSector from './Shap/Circle';
import Liney from './Shap/Liney';

function Round_2_graph({side11, side22, radius1, thickness1, outerRadius1 }) {
  const aa = Math.PI/180;
  const mx = Math.max(side11, side22)
  const side1 = (side11/mx)*100;
  const side2 = (side22/mx)*100;
  const radius = (radius1/mx)*100;
  const thickness = (thickness1/mx)*100;
  const outerRadius = (outerRadius1/mx)*100;
  const angle = Math.asin(((side2/2) - outerRadius)/(radius - outerRadius));
  
  
  const [viewBox, setViewBox] = useState('0 0 200 200');
  const [isDragging, setIsDragging] = useState(false);
  const [startCoords, setStartCoords] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);

  const svgWidth = 200;
  const svgHeight = 200;

  const handlePan = useCallback((dx, dy) => {
    setViewBox((prevViewBox) => {
      const [x, y, w, h] = prevViewBox.split(' ').map(Number);
      return `${x - dx} ${y - dy} ${w} ${h}`;
    });
  }, []);

  const startDrag = (x, y) => {
    setIsDragging(true);
    setStartCoords({ x, y });
  };

  const handleDrag = (x, y) => {
    if (isDragging) {
      const dx = x - startCoords.x;
      const dy = y - startCoords.y;
      handlePan(dx, dy);
      setStartCoords({ x, y });
    }
  };

  const stopDrag = () => {
    setIsDragging(false);
  };

  const handleMouseDown = (event) => {
    startDrag(event.clientX, event.clientY);
  };

  const handleMouseMove = (event) => {
    handleDrag(event.clientX, event.clientY);
  };

  const handleMouseUp = () => {
    stopDrag();
  };

  const handleTouchStart = (event) => {
    const touch = event.touches[0];
    startDrag(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (event) => {
    const touch = event.touches[0];
    handleDrag(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = () => {
    stopDrag();
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, startCoords, handlePan]);

  const zoomIn = () => {
    setScale((prevScale) => prevScale * 1.2);
  };

  const zoomOut = () => {
    setScale((prevScale) => prevScale / 1.2);
  };

  const resetZoom = () => {
    setScale(1); // Reset scale to initial state
    setViewBox('0 0 200 200');
  };

  const updateViewBox = () => {
    const newWidth = svgWidth / scale;
    const newHeight = svgHeight / scale;
    setViewBox(`0 0 ${newWidth} ${newHeight}`);
  };

  useEffect(() => {
    updateViewBox();
  }, [scale]);

  const [dimensioning, setDimensioning] = useState(false)
  const [points, setPoints] = useState([]);
  const [distance, setDistance] = useState(null);

  const clickOndimensioning = ()=> {
    setDimensioning(!dimensioning);
    setPoints([])
  }

  const handleSVGClick = (event) => {
    if(!dimensioning) return;
    const svg = event.target.closest('svg');
    const { left, top, width, height } = svg.getBoundingClientRect();

    const viewBox = svg.viewBox.baseVal;
    const scaleX = viewBox.width / width;  
    const scaleY = viewBox.height / height;

    const newPoint = {
      x: (event.clientX - left)*scaleX + viewBox.x ,
      y: (event.clientY - top)*scaleY + viewBox.y,
    };
    if (points.length === 1) {
      const p1 = points[0];
      const p2 = newPoint;
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const calculatedDistance = Math.sqrt(dx * dx + dy * dy).toFixed(2);
      setDistance(calculatedDistance);
    }
    setPoints((prevPoints) => prevPoints.length === 1 ? [prevPoints[0], newPoint] : [newPoint]);
  };

  return (
    <div style={{ position: 'relative' }}>
      <div className="form-check form-switch" style={{color: 'white', backgroundColor: '#1b065c'}}>
            <input className="form-check-input" onClick={clickOndimensioning} type="checkbox" role="switch" id="flexSwitchCheckDefault" style={{color: '#1b065c', transform: 'translateY(0px) translateX(4px)'}}/>
            <label className="form-check-label" htmlFor="flexSwitchCheckDefault">DIMENSIONING FUNCTION</label>
          </div>
      <svg viewBox={viewBox} style={{ width: '100%', height: 'auto', backgroundColor: '#f9f9f9', border: '1px solid #ccc' }} onMouseDown={handleMouseDown} onTouchStart={handleTouchStart} onClick={handleSVGClick}>
        {/* Define grid pattern */}

        {points.map((point, index) => (
              <circle key={index} cx={point.x} cy={point.y} r={2} fill={index === 0 ? "blue" : "red"} />
            ))}

            {points.length === 2 && (<line x1={points[0].x} y1={points[0].y} x2={points[1].x} y2={points[1].y} stroke="black"/>)}

            {points.length === 2 && <text  x={(points[0].x + points[1].x)/2 + 3} y={(points[0].y + points[1].y)/2 - 3} fontSize="5"> {(distance*mx/100).toFixed(3)} mm</text>}

        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="gray" strokeWidth="0.5" />
          </pattern>
        </defs>

        {/* Apply grid pattern as background */}
        <rect x='-1000' y='-1000' width="2000" height="2000" fill="url(#grid)" />

        {/* Draw X and Y axes */}
        <line x1="-1000" y1={100} x2={svgWidth + 1000} y2={100} stroke="gray" strokeWidth="1" />
        <line x1={100} y1="-1000" x2={100} y2={svgHeight + 1000} stroke="gray" strokeWidth="1" />

        {/* Add X and Y axis ticks and labels */}
        <rect x={100 - (side1 - 2*(radius - (radius - outerRadius)*Math.cos(angle)))/2} y={100 - side2/2} width={side1 - 2*(radius - (radius - outerRadius)*Math.cos(angle))} height={thickness} fill="black"/>

        <rect x={100 - (side1 - 2*(radius - (radius - outerRadius)*Math.cos(angle)))/2} y={100 + side2/2 - thickness} width={side1 - 2*(radius - (radius - outerRadius)*Math.cos(angle))} height={thickness} fill="black"/>

        {/* Circle */}
        <CircleSector radius={radius} centerX={100 - Math.abs(2*radius - side1)/2} centerY={100} angle={2*angle*180/Math.PI} rotation={-angle*180/Math.PI} thickness={thickness} />

        <CircleSector radius={radius} centerX={100 + Math.abs(2*radius - side1)/2} centerY={100} angle={2*angle*180/Math.PI} rotation={180 - angle*180/Math.PI} thickness={thickness} />

        <CircleSector radius={outerRadius} centerX={100 + (side1 - 2*(radius - (radius - outerRadius)*Math.cos(angle)))/2} centerY={100 - side2/2 + outerRadius} angle={90 - angle*180/Math.PI} rotation={270} thickness={thickness} />

        <CircleSector radius={outerRadius} centerX={100 + (side1 - 2*(radius - (radius - outerRadius)*Math.cos(angle)))/2} centerY={100 + side2/2 - outerRadius} angle={90 - angle*180/Math.PI} rotation={angle*180/Math.PI} thickness={thickness} />

        <CircleSector radius={outerRadius} centerX={100 - (side1 - 2*(radius - (radius - outerRadius)*Math.cos(angle)))/2} centerY={100 + side2/2 - outerRadius} angle={90 - angle*180/Math.PI} rotation={90} thickness={thickness} />

        <CircleSector radius={outerRadius} centerX={100 - (side1 - 2*(radius - (radius - outerRadius)*Math.cos(angle)))/2} centerY={100 - side2/2 + outerRadius} angle={90 - angle*180/Math.PI} rotation={180 + angle*180/Math.PI} thickness={thickness} />
        
        {/* Horizontal Arrow for side1 */}
        <Linex x1={100 - side1/2} x2={100 + side1/2} y1={155} y2={155} text={'A'} val={side11} textHeight={5} />

        {/* Horizontal Arrow for side2 */}
        <Liney x1={155} x2={155} y1={100 - side2/2} y2={100 + side2/2} text={'B'} val={side22} textHeight={17} />

        {/* Horizontal Arrow for radius */}
        <Linex x1={100 + side1/2 - radius} x2={100 + side1/2} y1={100} y2={100} text={'R'} val={radius1} textHeight={5} />


      </svg>
      <button title='Zoom in' className='btn btn mx-2 my-2' onClick={zoomIn} style={{color: 'white', backgroundColor: '#1b065c'}}><i className="fa-solid fa-magnifying-glass-plus"></i></button>
      <button title='Reset zoom' className='btn btn mx-2 my-2' onClick={resetZoom} style={{color: 'white', backgroundColor: '#1b065c'}}><i className="fa-solid fa-maximize"></i> </button>
      <button title='Zoom out' className='btn btn mx-2 my-2' onClick={zoomOut} style={{color: 'white', backgroundColor: '#1b065c'}}> <i className="fa-solid fa-magnifying-glass-minus"></i> </button>
    </div>
  );
}

export default Round_2_graph;
