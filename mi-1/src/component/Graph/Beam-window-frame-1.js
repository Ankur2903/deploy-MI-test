import React, { useState, useCallback, useEffect } from 'react';
import CircleSector from './Shap/Circle';
import * as Props from '../constant';
import Linex from './Shap/Linex';
import Liney from './Shap/Liney';
import { COM } from '../AdvanceOutput/COM';
import { ComputeMomentOfInertia } from '../AdvanceOutput/MomentOfInertia';
import PredefinedPoints from '../PredefinedPoints';
import { ComputePrincipalAxisAngle } from '../AdvanceOutput/PrincipalAxisAngle';

function Beam_window_frame_1_graph({ side11, side22,side33, side44, radius1, thickness1, outerRadius1, sendValue}) {
  const mx = Math.max(side11,side33);
  const thickness = (thickness1/mx)*Props.ratio
  const side1 = (side11/mx)*Props.ratio
  const side2 = (side22/mx)*Props.ratio
  const side3 = (side33/mx)*Props.ratio
  const side4 = (side44/mx)*Props.ratio
  const radius = (radius1/mx)*Props.ratio
  const outerRadius = (outerRadius1/mx)*Props.ratio

  const predefinedPoints = [
    { id: 1, type: 'line', x: 50 + outerRadius, y: 150 - thickness, w: side3 - outerRadius - radius, h: thickness, angle: 0 },
    { id: 2, type: 'line', x: 50, y: 150 - side1 + outerRadius, w: thickness, h: side1 - 2 * outerRadius, angle: 0 },
    { id: 3, type: 'line', x: 50 + outerRadius, y: 150 - side1, w: side2 - 2 * outerRadius, h: thickness, angle: 0 },
    { id: 4, type: 'line', x: 50 + side2 - thickness, y: 150 - side1 + outerRadius, w: thickness, h: side1 - 2 * outerRadius + thickness - side4, angle: 0 },
    { id: 5, type: 'line', x: 50 + side2 + outerRadius - thickness, y: 150 - side4, w: side3 - side2 - outerRadius + thickness - radius, h: thickness, angle: 0 },
    { id: 6, type: 'line', x: 50 + side3 - thickness, y: 150 - side4 + radius, w: thickness, h: side4 - 2 * radius, angle: 0 },
    { id: 7, type: 'circle', x: 50 + outerRadius, y: 150 - outerRadius, r: outerRadius, angle: 90, rotation: 90, t: thickness },
    { id: 8, type: 'circle', x: 50 + outerRadius, y: 150 - side1 + outerRadius, r: outerRadius, angle: 90, rotation: 180, t: thickness },
    { id: 9, type: 'circle', x: 50 + side2 - outerRadius, y: 150 - side1 + outerRadius, r: outerRadius, angle: 90, rotation: 270, t: thickness },
    { id: 10, type: 'circle', x: 50 + side2 + outerRadius - thickness, y: 150 - side4 - outerRadius + thickness, r: outerRadius, angle: 90, rotation: 90, t: thickness },
    { id: 11, type: 'circle', x: 50 + side3 - radius, y: 150 - side4 + radius, r: radius, angle: 90, rotation: 270, t: thickness },
    { id: 12, type: 'circle', x: 50 + side3 - radius, y: 150 - radius, r: radius, angle: 90, rotation: 0, t: thickness },
  ];

  const {a, b} = COM(predefinedPoints)

  const translatedPoints = predefinedPoints.map(point => ({
    ...point,
    x: point.x + 100 - a,
    y: point.y + 100 - b
  }));

  const {Ix, Iy, sw, ol, acs, xmax, ymax, Ixy} = ComputeMomentOfInertia(predefinedPoints, a, b, mx, Props.ratio, thickness);
  const Paa = Math.atan(2*Ixy/(Ix - Iy))*90/Math.PI
  const Iu = (Paa <= 0) ? (Number(Ix) + Number(Iy))/2 - Math.sqrt(Math.pow((Number(Ix) - Number(Iy))/2, 2) + Ixy*Ixy) : (Number(Ix) + Number(Iy))/2 + Math.sqrt(Math.pow((Number(Ix) - Number(Iy))/2, 2) + Ixy*Ixy)
  const Iv = (Paa > 0) ? (Number(Ix) + Number(Iy))/2 - Math.sqrt(Math.pow((Number(Ix) - Number(Iy))/2, 2) + Ixy*Ixy) : (Number(Ix) + Number(Iy))/2 + Math.sqrt(Math.pow((Number(Ix) - Number(Iy))/2, 2) + Ixy*Ixy)
  const {umax, vmax} = ComputePrincipalAxisAngle(predefinedPoints, a, b, mx, Props.ratio, thickness, Paa);


  useEffect(() => {
    sendValue({ Ix, Iy, sw, ol, acs, xmax, ymax, Ixy, Paa, Iu, Iv, umax, vmax});// Send all consts as an object when the component mounts
  }, [Ix, Iy, sw, ol, acs, xmax, ymax, Ixy, Paa, Iu, Iv, umax, vmax]);


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
    }};

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
      <svg
        viewBox={viewBox}
        style={{ width: '100%', height: '61vh', backgroundColor: '#f9f9f9', border: '1px solid #ccc' }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart} 
      >
        
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

{dimensioning && <PredefinedPoints points={translatedPoints} mx={mx} thickness={thickness} scale={scale}/>}

        {/* Line Shape */}
       <rect x={50 + outerRadius + 100 - a} y={150 - thickness + 100 - b} width={side3 - outerRadius - radius} height={thickness} fill="black" />
      <rect x={50 + 100 - a} y={150 - side1 + outerRadius + 100 - b} width={thickness} height={side1 - 2*outerRadius} fill="black" />
      <rect x={50 + outerRadius + 100 - a} y={150 - side1 + 100 - b} width={side2 - 2*outerRadius} height={thickness} fill="black" />
      <rect x={50 + side2 - thickness + 100 - a} y={150 - side1 + outerRadius + 100 - b} width={thickness} height={side1 - 2*outerRadius + thickness - side4} fill="black" />
      <rect x={50 + side2 + outerRadius - thickness + 100 - a} y={150 - side4 + 100 - b} width={side3 - side2 - outerRadius + thickness - radius} height={thickness} fill="black" />
      <rect x={50 + side3 - thickness + 100 - a} y={150 - side4 + radius + 100 - b} width={thickness} height={side4 - 2*radius} fill="black" />

      {/* outer radius */}
      <CircleSector radius={outerRadius} centerX={50 + outerRadius + 100 - a} centerY={150 - outerRadius + 100 - b} angle={90} rotation={90} thickness={thickness}/>
      <CircleSector radius={outerRadius} centerX={50 + outerRadius + 100 - a} centerY={150 - side1 + outerRadius + 100 - b} angle={90} rotation={180} thickness={thickness}/>
      <CircleSector radius={outerRadius} centerX={50 + side2 - outerRadius + 100 - a} centerY={150 - side1 + outerRadius + 100 - b} angle={90} rotation={270} thickness={thickness}/>
      <CircleSector radius={outerRadius} centerX={50 + side2 + outerRadius - thickness + 100 - a} centerY={150 - side4 - outerRadius + thickness + 100 - b} angle={90} rotation={90} thickness={thickness}/>
      <CircleSector radius={radius} centerX={50 + side3 - radius + 100 - a} centerY={150 - side4 + radius + 100 - b} angle={90} rotation={270} thickness={thickness}/>
      <CircleSector radius={radius} centerX={50 + side3 - radius + 100 - a} centerY={150 - radius + 100 - b} angle={90} rotation={0} thickness={thickness}/>

      {/* Horizontal Arrow for side1 */}
      <Liney  x1={45 + 100 - a} x2={45 + 100 - a} y1={150 - side1 + 100 - b} y2={150 + 100 - b} text={'A'} val={side11} textHeight={-17}/>

      {/* Horizontal Arrow for side4 */}
      <Linex x1={50 + 100 - a} x2={50 + side2 + 100 - a} y1={145 - side1 + 100 - b} y2={145 - side1 + 100 - b} text={'B'} val={side22} textHeight={-5}/>

      {/* Vertical Arrow for side3 */}
      <Linex x1={50 + 100 - a} x2={50 + side3 + 100 - a} y1={155 + 100 - b} y2={155 + 100 - b} text={'C'} val={side33} textHeight={5}/>       

      {/* Horizontal Arrow for side4 */}
      <Liney x1={55 + side3 + 100 - a} x2={55 + side3 + 100 - a} y1={150 - side4 + 100 - b} y2={150 + 100 - b} text={'D'} val={side44} textHeight={17}/>

      {/* Vertical Arrow for radius */}
      <Linex x1={50 + side3 - radius + 100 - a} x2={50 + side3 + 100 - a} y1={145 - side4 + 100 - b} y2={145 - side4 + 100 - b} text={'R'} val={radius1} textHeight={-6}/> 

      
      </svg>
      <button title={Props.title3} className='btn btn mx-2 my-2' onClick={zoomIn} style={{color: 'white', backgroundColor: '#1b065c'}}><i className="fa-solid fa-magnifying-glass-plus"></i></button>
      <button title={Props.title6} className='btn btn mx-2 my-2' onClick={resetZoom} style={{color: 'white', backgroundColor: '#1b065c'}}><i className="fa-solid fa-maximize"></i> </button>
      <button title={Props.title4} className='btn btn mx-2 my-2' onClick={zoomOut} style={{color: 'white', backgroundColor: '#1b065c'}}> <i className="fa-solid fa-magnifying-glass-minus"></i> </button>
    </div>
  );
}

export default Beam_window_frame_1_graph;
