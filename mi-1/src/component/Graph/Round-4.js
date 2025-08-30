import React, { useState, useCallback, useEffect } from 'react';
import Linex from './Shap/Linex';
import Linez from './Shap/Linez';
import CircleSector from './Shap/Circle';
import * as Props from '../constant';
import Liney from './Shap/Liney';
import { COM } from '../AdvanceOutput/COM';
import { ComputeMomentOfInertia } from '../AdvanceOutput/MomentOfInertia';
import PredefinedPoints from '../PredefinedPoints';

function Round_graph_4({side1, radius1, thickness1, outerRadius1, sendValue }) {
const mx = 2*radius1;
  const radius = 50;
  const thickness = (thickness1 / (2 * radius1)) * Props.ratio
  const outerRadius = (outerRadius1*Props.ratio)/mx;
  const side = (side1*Props.ratio)/mx;
  const aa = 180/Math.PI
  const angle2 = Math.PI/2 - Math.asin((side - radius - outerRadius)/(radius - outerRadius))
  const angle1 = 2*Math.PI - 2*angle2;

  const predefinedPoints = [
  { id: 1, type: 'circle', r: radius, x: 100, y: 100, angle: angle1 * aa, rotation: angle2 * aa - 90, t: thickness },
  { id: 2, type: 'circle', r: outerRadius, x: 100 + (radius - outerRadius) * Math.sin(angle2), y: 100 - (radius - outerRadius) * Math.cos(angle2), angle: angle2 * aa, rotation: -90, t: thickness },
  { id: 3, type: 'circle', r: outerRadius, x: 100 - (radius - outerRadius) * Math.sin(angle2), y: 100 - (radius - outerRadius) * Math.cos(angle2), angle: angle2 * aa, rotation: -90 - aa * angle2, t: thickness },
  { id: 4, type: 'line', x: 100 - (radius - outerRadius) * Math.sin(angle2), y: 100 - (radius - outerRadius) * Math.cos(angle2) - outerRadius, w: 2 * (radius - outerRadius) * Math.sin(angle2), h: thickness, angle: 0 },
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

  const svgWidth = 200 * (radius / 50);
  const svgHeight = 200 * (radius / 50);

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
        <input title={Props.title1} className="form-check-input" onClick={clickOndimensioning}  type="checkbox" role="switch" id="flexSwitchCheckDefault" style={{color: '#1b065c', transform: 'translateY(0px) translateX(4px)'}}/>
        <label className="form-check-label" htmlFor="flexSwitchCheckDefault" >DIMENSIONING FUNCTION</label>
      </div>
      <svg viewBox={viewBox} style={{ width: '100%', height: '61vh', backgroundColor: '#f9f9f9', border: '1px solid #ccc' }} onMouseDown={handleMouseDown} onTouchStart={handleTouchStart} >
        <defs>{/* Define grid pattern */}
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="gray" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect x='-1000' y='-1000' width="2000" height="2000" fill="url(#grid)"/>
        {/* Draw X and Y axes */}
        <line x1="-1000" y1={50 + radius} x2={svgWidth + 1000} y2={50 + radius} stroke="gray" strokeWidth="1" />
        <line x1={50 + radius} y1="-1000" x2={50 + radius} y2={svgHeight + 1000} stroke="gray" strokeWidth="1" />

        {dimensioning && <PredefinedPoints points={translatedPoints} mx={mx} thickness={thickness} scale={scale}/>}

        <CircleSector radius={radius} centerX={100 + 100 - a} centerY={100 + 100 - b} angle={angle1 * aa} rotation={angle2 * aa - 90} thickness={thickness} />
        <CircleSector radius={outerRadius} centerX={100 + (radius - outerRadius) * Math.sin(angle2) + 100 - a} centerY={100 - (radius - outerRadius) * Math.cos(angle2) + 100 - b} angle={angle2 * aa} rotation={-90} thickness={thickness} />
        <CircleSector radius={outerRadius} centerX={100 - (radius - outerRadius) * Math.sin(angle2) + 100 - a} centerY={100 - (radius - outerRadius) * Math.cos(angle2) + 100 - b} angle={angle2 * aa} rotation={-90 - aa * angle2} thickness={thickness} />
        <rect x={100 - (radius - outerRadius) * Math.sin(angle2) + 100 - a} y={100 - (radius - outerRadius) * Math.cos(angle2) - outerRadius + 100 - b} width={2 * ((radius - outerRadius) * Math.sin(angle2))} height={thickness} fill="black" />
        <Linex x1={50 + 100 - a} x2={150 + 100 - a} y1={160 + 100 - b} y2={160 + 100 - b} text={'D'} val={2 * radius} textHeight={10} />
        <Liney x1={160 + 100 - a} x2={160 + 100 - a} y1={100 - (radius - outerRadius) * Math.cos(angle2) - outerRadius + 100 - b} y2={150 + 100 - b} text={'A'} val={side1} textHeight={17} />


      </svg>
      <button title={Props.title3} className='btn btn mx-2 my-2' onClick={zoomIn} style={{color: 'white', backgroundColor: '#1b065c'}}><i className="fa-solid fa-magnifying-glass-plus"></i></button>
      <button title={Props.title6} className='btn btn mx-2 my-2' onClick={resetZoom} style={{color: 'white', backgroundColor: '#1b065c'}}><i className="fa-solid fa-maximize"></i> </button>
      <button title={Props.title4} className='btn btn mx-2 my-2' onClick={zoomOut} style={{color: 'white', backgroundColor: '#1b065c'}}> <i className="fa-solid fa-magnifying-glass-minus"></i> </button>
    </div>
  );
}

export default Round_graph_4;
