import React, { useState, useCallback, useEffect } from 'react';
import Linex from './Shap/Linex';
import Linez from './Shap/Linez';
import CircleSector from './Shap/Circle';
import * as Props from '../constant';
import Liney from './Shap/Liney';
import { COM } from '../AdvanceOutput/COM';
import { ComputeMomentOfInertia } from '../AdvanceOutput/MomentOfInertia';
import PredefinedPoints from '../PredefinedPoints';

function Round_3_graph({side11, side22, diameter1, thickness1, outerRadius1, sendValue }) {
  const aa = Math.PI/180;
  const radius1 = diameter1/2;
  const mx = diameter1
  const side1 = (side11/mx)*Props.ratio
  const side2 = (side22/mx)*Props.ratio
  const radius = (radius1/mx)*Props.ratio
  const thickness = (thickness1/mx)*Props.ratio
  const outerRadius = (outerRadius1/mx)*Props.ratio
  const angle = Math.asin((side2/2 + outerRadius)/(radius - outerRadius))* (180 / Math.PI);

  const predefinedPoints = [
  { id: 1, type: 'line', x: 100 - (radius - outerRadius)*Math.sin(angle*aa) + outerRadius - thickness, y: 100 - (radius - outerRadius)*Math.cos(angle*aa), w: thickness, h: radius + (radius - outerRadius)*Math.cos(angle*aa) - side1 - (outerRadius - thickness), angle: 0 },
  { id: 2, type: 'line', x: 100 + (radius - outerRadius)*Math.sin(angle*aa) - outerRadius, y: 100 - (radius - outerRadius)*Math.cos(angle*aa), w: thickness, h: radius + (radius - outerRadius)*Math.cos(angle*aa) - side1 - (outerRadius - thickness), angle: 0 },
  { id: 3, type: 'line', x: 100 - (radius - outerRadius)*Math.sin(angle*aa) + 2*outerRadius - thickness, y: 100 + radius - side1 - (outerRadius - thickness) + outerRadius - thickness, w: side2 - 2*(outerRadius - thickness), h: thickness, angle: 0 },
  { id: 4, type: 'circle', x: 100, y: 100, r: radius, angle: 360 - 2*angle, rotation: angle - 90, t: thickness },
  { id: 5, type: 'circle', x: 100 + (radius - outerRadius)*Math.sin(angle*aa), y: 100 - (radius - outerRadius)*Math.cos(angle*aa), r: outerRadius, angle: 90 + angle, rotation: 180, t: thickness },
  { id: 6, type: 'circle', x: 100 - (radius - outerRadius)*Math.sin(angle*aa), y: 100 - (radius - outerRadius)*Math.cos(angle*aa), r: outerRadius, angle: 90 + angle, rotation: -angle - 90, t: thickness },
  { id: 7, type: 'circle', x: 100 + (radius - outerRadius)*Math.sin(angle*aa) - 2*outerRadius + thickness, y: 100 + radius - side1 - (outerRadius - thickness), r: outerRadius, angle: 90, rotation: 0, t: thickness },
  { id: 8, type: 'circle', x: 100 - (radius - outerRadius)*Math.sin(angle*aa) + 2*outerRadius - thickness, y: 100 + radius - side1 - (outerRadius - thickness), r: outerRadius, angle: 90, rotation: 90, t: thickness }
];

  const {a, b} = COM(predefinedPoints)

  const translatedPoints = predefinedPoints.map(point => ({
    ...point,
    x: point.x + 100 - a,
    y: point.y + 100 - b
  }));  
  
  const {Ix, Iy, sw, ol, acs} = ComputeMomentOfInertia(predefinedPoints, a, b, mx, Props.ratio, thickness);

  useEffect(() => {
    sendValue({ Ix, Iy, sw, ol, acs});// Send all consts as an object when the component mounts
  }, [Ix, Iy, sw, ol, acs]);


  const [viewBox, setViewBox] = useState(Props.title7);
  const [isDragging, setIsDragging] = useState(false);
  const [startCoords, setStartCoords] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);

  const svgWidth = Props.x2
  const svgHeight = Props.y2

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
    setViewBox(Props.title7);
  };

  const updateViewBox = () => {
    const newWidth = svgWidth / scale;
    const newHeight = svgHeight / scale;
    setViewBox(`${Props.x1} ${Props.y1} ${Props.x2/scale} ${Props.y2/scale}`);
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

  

  return (
    <div style={{ position: 'relative' }}>
      <div className="form-check form-switch" style={{color: 'white', backgroundColor: '#1b065c'}}>
            <input title={Props.title1} className="form-check-input" onClick={clickOndimensioning} type="checkbox" role="switch" id="flexSwitchCheckDefault" style={{color: '#1b065c', transform: 'translateY(0px) translateX(4px)'}}/>
            <label className="form-check-label" htmlFor="flexSwitchCheckDefault">DIMENSIONING FUNCTION</label>
          </div>
      <svg viewBox={viewBox} style={{ width: '100%', height: '61vh', backgroundColor: '#f9f9f9', border: '1px solid #ccc' }} onMouseDown={handleMouseDown} onTouchStart={handleTouchStart} >
        {/* Define grid pattern */}

        

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

{dimensioning && <PredefinedPoints points={translatedPoints} mx={mx} thickness={thickness}/>}

        {/* Add X and Y axis ticks and labels */}
        <rect x={100 - (radius - outerRadius)*Math.sin(angle*aa) + outerRadius - thickness + 100 - a} y={100 - (radius - outerRadius)*Math.cos(angle*aa) + 100 - b} width={thickness} height={radius + (radius - outerRadius)*Math.cos(angle*aa) - side1 - (outerRadius - thickness)} fill="black"/>

        <rect x={100 + (radius - outerRadius)*Math.sin(angle*aa) - outerRadius + 100 - a} y={100 - (radius - outerRadius)*Math.cos(angle*aa) + 100 - b} width={thickness} height={radius + (radius - outerRadius)*Math.cos(angle*aa) - side1 - (outerRadius - thickness)} fill="black"/>

        <rect x={100 - (radius - outerRadius)*Math.sin(angle*aa) + 2*outerRadius - thickness + 100 - a} y={100 + radius  - side1 - (outerRadius - thickness) + outerRadius - thickness + 100 - b} width={side2 - 2*(outerRadius - thickness)} height={thickness} fill="black"/>

        <CircleSector radius={radius} centerX={100 + 100 - a} centerY={100 + 100 - b} angle={360 - 2*angle} rotation={angle - 90} thickness={thickness} />

        <CircleSector radius={outerRadius} centerX={100 + (radius - outerRadius)*Math.sin(angle*aa) + 100 - a} centerY={100 - (radius - outerRadius)*Math.cos(angle*aa) + 100 - b} angle={90 + angle} rotation={180} thickness={thickness} />

        <CircleSector radius={outerRadius} centerX={100 - (radius - outerRadius)*Math.sin(angle*aa) + 100 - a} centerY={100 - (radius - outerRadius)*Math.cos(angle*aa) + 100 - b} angle={90 + angle} rotation={-angle-90} thickness={thickness} />

        <CircleSector radius={outerRadius} centerX={100 + (radius - outerRadius)*Math.sin(angle*aa) - 2*outerRadius + thickness + 100 - a} centerY={100 + radius  - side1 - (outerRadius - thickness) + 100 - b} angle={90} rotation={0} thickness={thickness} />

        <CircleSector radius={outerRadius} centerX={100 - (radius - outerRadius)*Math.sin(angle*aa) + 2*outerRadius - thickness + 100 - a} centerY={100 + radius  - side1 - (outerRadius - thickness) + 100 - b} angle={90} rotation={90} thickness={thickness} />

        <Linex x1={100 - radius + 100 - a} x2={100 + radius + 100 - a} y1={155 + 100 - b} y2={155 + 100 - b} text={'D'} val={diameter1} textHeight={5} />

        <Liney x1={155 + 100 - a} x2={155 + 100 - a} y1={100 + radius  - side1 - (outerRadius - thickness) + outerRadius - thickness + 100 - b} y2={150 + 100 - b} text={'A'} val={side11} textHeight={17} />

        <Linex x1={100 - side2/2 + 100 - a} x2={100 + side2/2 + 100 - a} y1={45 + 100 - b} y2={45 + 100 - b} text={'B'} val={side22} textHeight={-5} />

      </svg>
      <button title={Props.title3} className='btn btn mx-2 my-2' onClick={zoomIn} style={{color: 'white', backgroundColor: '#1b065c'}}><i className="fa-solid fa-magnifying-glass-plus"></i></button>
      <button title={Props.title6} className='btn btn mx-2 my-2' onClick={resetZoom} style={{color: 'white', backgroundColor: '#1b065c'}}><i className="fa-solid fa-maximize"></i> </button>
      <button title={Props.title4} className='btn btn mx-2 my-2' onClick={zoomOut} style={{color: 'white', backgroundColor: '#1b065c'}}> <i className="fa-solid fa-magnifying-glass-minus"></i> </button>
    </div>
  );
}

export default Round_3_graph;
