import React, { useState, useCallback, useEffect } from 'react';
import CircleSector from './Shap/Circle';
import * as Props from '../constant';
import Linex from './Shap/Linex';
import Liney from './Shap/Liney';
import LineAtTheta from './Shap/LineAtθ';
import { COM } from '../AdvanceOutput/COM';
import { ComputeMomentOfInertia } from '../AdvanceOutput/MomentOfInertia';
import PredefinedPoints from '../PredefinedPoints';
import { ComputePrincipalAxisAngle } from '../AdvanceOutput/PrincipalAxisAngle';

function Stiffner_graph({side11, side22, side33, side44, angle1, thickness1, outerRadius11, outerRadius22, sendValue}) {
  const aa = Math.PI/180
  const mx = Math.max(side33, side11);
  const side1 = (side11/mx)*Props.ratio
  const side2 = (side22/mx)*Props.ratio
  const side3 = (side33/mx)*Props.ratio
  const side4 = (side44/mx)*Props.ratio
  const angle = angle1;
  const thickness = (thickness1/mx)*Props.ratio
  const outerRadius1 = (outerRadius11/mx)*Props.ratio
  const outerRadius2 = (outerRadius22/mx)*Props.ratio

  const predefinedPoints = [
    { id: 1, type: 'line', x: 100 - side3/2, y: 100 - side1/2 + outerRadius1, w: thickness, h: side1 - 2 * outerRadius1, angle: 0 },
    { id: 2, type: 'line', x: 100 + side3/2 - thickness, y: 100 - side1/2 + outerRadius1, w: thickness, h: side1 - 2 * outerRadius1, angle: 0 },
    { id: 3, type: 'line', x: 100 - side3/2 + outerRadius1, y: 100 - side1/2, w: side2 - outerRadius1 - outerRadius1 * Math.tan(aa * angle / 2), h: thickness, angle: 0 },
    { id: 4, type: 'line', x: 100 - side3/2 + outerRadius1, y: 100 + side1/2 - thickness, w: side2 - outerRadius1 - outerRadius1 * Math.tan(aa * angle / 2), h: thickness, angle: 0 },
    { id: 5, type: 'line', x: 100 + side3/2 - outerRadius1 - (side2 - outerRadius1 - outerRadius1 * Math.tan(aa * angle / 2)), y: 100 - side1/2, w: side2 - outerRadius1 - outerRadius1 * Math.tan(aa * angle / 2), h: thickness, angle: 0 },
    { id: 6, type: 'line', x: 100 + side3/2 - outerRadius1 - (side2 - outerRadius1 - outerRadius1 * Math.tan(aa * angle / 2)), y: 100 + side1/2 - thickness, w: side2 - outerRadius1 - outerRadius1 * Math.tan(aa * angle / 2), h: thickness, angle: 0 },
    { id: 7, type: 'line', x: 100 - side3/2 + side2 - outerRadius1 * Math.tan(aa * angle / 2) + outerRadius1 * Math.sin(aa * angle) + ((side4 + outerRadius1 * Math.cos(aa * angle) - outerRadius1 - (outerRadius2 - thickness) * (1 - Math.cos(aa * angle))) / Math.sin(aa * angle)) * Math.cos(aa * angle) + (outerRadius2 - thickness) * Math.sin(aa * angle), y: 100 - side1/2 + side4, w: side3 - 2 * (side2 - outerRadius1 * Math.tan(aa * angle / 2) + outerRadius1 * Math.sin(aa * angle) + ((side4 + outerRadius1 * Math.cos(aa * angle) - outerRadius1 - (outerRadius2 - thickness) * (1 - Math.cos(aa * angle))) / Math.sin(aa * angle)) * Math.cos(aa * angle) + (outerRadius2 - thickness) * Math.sin(aa * angle)), h: thickness, angle: 0 },
    { id: 8, type: 'line', x: 100 - side3/2 + side2 - outerRadius1 * Math.tan(aa * angle / 2) + outerRadius1 * Math.sin(aa * angle) + ((side4 + outerRadius1 * Math.cos(aa * angle) - outerRadius1 - (outerRadius2 - thickness) * (1 - Math.cos(aa * angle))) / Math.sin(aa * angle)) * Math.cos(aa * angle) + (outerRadius2 - thickness) * Math.sin(aa * angle), y: 100 + side1/2 - side4 - thickness, w: side3 - 2 * (side2 - outerRadius1 * Math.tan(aa * angle / 2) + outerRadius1 * Math.sin(aa * angle) + ((side4 + outerRadius1 * Math.cos(aa * angle) - outerRadius1 - (outerRadius2 - thickness) * (1 - Math.cos(aa * angle))) / Math.sin(aa * angle)) * Math.cos(aa * angle) + (outerRadius2 - thickness) * Math.sin(aa * angle)), h: thickness, angle: 0 },
    { id: 9, type: 'line', x: 100 - side3/2 + side2 - outerRadius1 * Math.tan(aa * angle / 2) + outerRadius1 * Math.sin(aa * angle), y: 100 - side1/2 + outerRadius1 - outerRadius1 * Math.cos(aa * angle), w: (side4 + outerRadius1 * Math.cos(aa * angle) - outerRadius1 - (outerRadius2 - thickness) * (1 - Math.cos(aa * angle))) / Math.sin(aa * angle), h: thickness, angle: angle },
    { id: 10, type: 'line', x: 100 - side3/2 + side2 - outerRadius1 * Math.tan(aa * angle / 2) + (outerRadius1 - thickness) * Math.sin(aa * angle), y: 100 + side1/2 - outerRadius1 + (outerRadius1 - thickness) * Math.cos(aa * angle), w: (side4 + outerRadius1 * Math.cos(aa * angle) - outerRadius1 - (outerRadius2 - thickness) * (1 - Math.cos(aa * angle))) / Math.sin(aa * angle), h: thickness, angle: -angle },
    { id: 11, type: 'line', x: 100 + side3/2 - side2 + outerRadius1 * Math.tan(aa * angle / 2) - (outerRadius1 - thickness) * Math.sin(aa * angle), y: 100 - side1/2 + outerRadius1 - (outerRadius1 - thickness) * Math.cos(aa * angle), w: (side4 + outerRadius1 * Math.cos(aa * angle) - outerRadius1 - (outerRadius2 - thickness) * (1 - Math.cos(aa * angle))) / Math.sin(aa * angle), h: thickness, angle: 180 - angle },
    { id: 12, type: 'line', x: 100 + side3/2 - side2 + outerRadius1 * Math.tan(aa * angle / 2) - outerRadius1 * Math.sin(aa * angle), y: 100 + side1/2 - outerRadius1 + outerRadius1 * Math.cos(aa * angle), w: (side4 + outerRadius1 * Math.cos(aa * angle) - outerRadius1 - (outerRadius2 - thickness) * (1 - Math.cos(aa * angle))) / Math.sin(aa * angle), h: thickness, angle: 180 + angle },
    { id: 13, type: 'circle', x: 100 - side3/2 + outerRadius1, y: 100 - side1/2 + outerRadius1, r: outerRadius1, angle: 90, rotation: 180, t: thickness },
    { id: 14, type: 'circle', x: 100 + side3/2 - outerRadius1, y: 100 - side1/2 + outerRadius1, r: outerRadius1, angle: 90, rotation: 270, t: thickness },
    { id: 15, type: 'circle', x: 100 - side3/2 + outerRadius1, y: 100 + side1/2 - outerRadius1, r: outerRadius1, angle: 90, rotation: 90, t: thickness },
    { id: 16, type: 'circle', x: 100 + side3/2 - outerRadius1, y: 100 + side1/2 - outerRadius1, r: outerRadius1, angle: 90, rotation: 0, t: thickness },
    { id: 17, type: 'circle', x: 100 - side3/2 + side2 - outerRadius1 * Math.tan(aa * angle / 2), y: 100 + side1/2 - outerRadius1, r: outerRadius1, angle: angle, rotation: 90 - angle, t: thickness },
    { id: 18, type: 'circle', x: 100 - side3/2 + outerRadius1 + side2 - outerRadius1 - outerRadius1 * Math.tan(aa * angle / 2), y: 100 - side1/2 + outerRadius1, r: outerRadius1, angle: angle, rotation: 270, t: thickness },
    { id: 19, type: 'circle', x: 100 + side3/2 - outerRadius1 - (side2 - outerRadius1 - outerRadius1 * Math.tan(aa * angle / 2)), y: 100 + side1/2 - outerRadius1, r: outerRadius1, angle: angle, rotation: 90, t: thickness },
    { id: 20, type: 'circle', x: 100 + side3/2 - outerRadius1 - (side2 - outerRadius1 - outerRadius1 * Math.tan(aa * angle / 2)), y: 100 - side1/2 + outerRadius1, r: outerRadius1, angle: angle, rotation: 270 - angle, t: thickness },
    { id: 21, type: 'circle', x: 100 - side3/2 + side2 - outerRadius1 * Math.tan(aa * angle / 2) + outerRadius1 * Math.sin(aa * angle) + ((side4 + outerRadius1 * Math.cos(aa * angle) - outerRadius1 - (outerRadius2 - thickness) * (1 - Math.cos(aa * angle))) / Math.sin(aa * angle)) * Math.cos(aa * angle) + (outerRadius2 - thickness) * Math.sin(aa * angle), y: 100 - side1/2 + side4 - (outerRadius2 - thickness), r: outerRadius2, angle: angle, rotation: 90, t: thickness },
    { id: 22, type: 'circle', x: 100 - side3/2 + side2 - outerRadius1 * Math.tan(aa * angle / 2) + outerRadius1 * Math.sin(aa * angle) + ((side4 + outerRadius1 * Math.cos(aa * angle) - outerRadius1 - (outerRadius2 - thickness) * (1 - Math.cos(aa * angle))) / Math.sin(aa * angle)) * Math.cos(aa * angle) + (outerRadius2 - thickness) * Math.sin(aa * angle), y: 100 + side1/2 - side4 + (outerRadius2 - thickness), r: outerRadius2, angle: angle, rotation: 270 - angle, t: thickness },
    { id: 23, type: 'circle', x: 100 + side3/2 - side2 + outerRadius1 * Math.tan(aa * angle / 2) - outerRadius1 * Math.sin(aa * angle) - ((side4 + outerRadius1 * Math.cos(aa * angle) - outerRadius1 - (outerRadius2 - thickness) * (1 - Math.cos(aa * angle))) / Math.sin(aa * angle)) * Math.cos(aa * angle) - (outerRadius2 - thickness) * Math.sin(aa * angle), y: 100 + side1/2 - side4 + (outerRadius2 - thickness), r: outerRadius2, angle: angle, rotation: 270, t: thickness },
    { id: 24, type: 'circle', x: 100 + side3/2 - side2 + outerRadius1 * Math.tan(aa * angle / 2) - outerRadius1 * Math.sin(aa * angle) - ((side4 + outerRadius1 * Math.cos(aa * angle) - outerRadius1 - (outerRadius2 - thickness) * (1 - Math.cos(aa * angle))) / Math.sin(aa * angle)) * Math.cos(aa * angle) - (outerRadius2 - thickness) * Math.sin(aa * angle), y: 100 - side1/2 + side4 - (outerRadius2 - thickness), r: outerRadius2, angle: angle, rotation: 90 - angle, t: thickness }
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

        {/* L Shape */}
        <rect x={100 - side3/2 + 100 - a} y={100 - side1/2 + outerRadius1 + 100 - b} width={thickness} height={side1 - 2*outerRadius1} fill="black" />
        <rect x={100 + side3/2 - thickness + 100 - a} y={100 - side1/2 + outerRadius1 + 100 - b} width={thickness} height={side1 - 2*outerRadius1} fill="black" />
        <rect x={100 - side3/2 + outerRadius1 + 100 - a} y={100 - side1/2 + 100 - b} width={side2 - outerRadius1 - outerRadius1*Math.tan(aa*angle/2)} height={thickness} fill="black" />
        <rect x={100 - side3/2 + outerRadius1 + 100 - a} y={100 + side1/2 - thickness + 100 - b} width={side2 - outerRadius1 - outerRadius1*Math.tan(aa*angle/2)} height={thickness} fill="black" />
        <rect x={100 + side3/2 - outerRadius1 - (side2 - outerRadius1 - outerRadius1*Math.tan(aa*angle/2)) + 100 - a} y={100 - side1/2 + 100 - b} width={side2 - outerRadius1 - outerRadius1*Math.tan(aa*angle/2)} height={thickness} fill="black" />
        <rect x={100 + side3/2 - outerRadius1 - (side2 - outerRadius1 - outerRadius1*Math.tan(aa*angle/2)) + 100 - a} y={100 + side1/2 - thickness + 100 - b} width={side2 - outerRadius1 - outerRadius1*Math.tan(aa*angle/2)} height={thickness} fill="black" />


        <rect x={100 - side3/2 + side2 - outerRadius1*Math.tan(aa*angle/2) + outerRadius1*Math.sin(aa*angle)  + ((side4 + outerRadius1*Math.cos(aa*angle) - outerRadius1 - (outerRadius2 - thickness)*(1 - Math.cos(aa*angle)))/Math.sin(aa*angle))*Math.cos(aa*angle) + (outerRadius2 - thickness)*Math.sin(aa*angle) + 100 - a} y={100 - side1/2 + side4 + 100 - b} width={side3 - 2*(side2 - outerRadius1*Math.tan(aa*angle/2) + outerRadius1*Math.sin(aa*angle)  + ((side4 + outerRadius1*Math.cos(aa*angle) - outerRadius1 - (outerRadius2 - thickness)*(1 - Math.cos(aa*angle)))/Math.sin(aa*angle))*Math.cos(aa*angle) + (outerRadius2 - thickness)*Math.sin(aa*angle))} height={thickness} fill="black" />

        <rect x={100 - side3/2 + side2 - outerRadius1*Math.tan(aa*angle/2) + outerRadius1*Math.sin(aa*angle)  + ((side4 + outerRadius1*Math.cos(aa*angle) - outerRadius1 - (outerRadius2 - thickness)*(1 - Math.cos(aa*angle)))/Math.sin(aa*angle))*Math.cos(aa*angle) + (outerRadius2 - thickness)*Math.sin(aa*angle) + 100 - a} y={100 + side1/2 - side4 - thickness + 100 - b} width={side3 - 2*(side2 - outerRadius1*Math.tan(aa*angle/2) + outerRadius1*Math.sin(aa*angle)  + ((side4 + outerRadius1*Math.cos(aa*angle) - outerRadius1 - (outerRadius2 - thickness)*(1 - Math.cos(aa*angle)))/Math.sin(aa*angle))*Math.cos(aa*angle) + (outerRadius2 - thickness)*Math.sin(aa*angle))} height={thickness} fill="black"/>

        <LineAtTheta x={100 - side3/2 + side2 - outerRadius1*Math.tan(aa*angle/2) + outerRadius1*Math.sin(aa*angle) + 100 - a} y={100 - side1/2 + outerRadius1 - outerRadius1*Math.cos(aa*angle) + 100 - b} w={(side4 + outerRadius1*Math.cos(aa*angle) - outerRadius1 - (outerRadius2 - thickness)*(1 - Math.cos(aa*angle)))/Math.sin(aa*angle)} h={thickness} angle={angle}/>

        <LineAtTheta x={100 - side3/2 + side2 - outerRadius1*Math.tan(aa*angle/2) + (outerRadius1 - thickness)*Math.sin(aa*angle) + 100 - a} y={100 + side1/2 - outerRadius1 + (outerRadius1 - thickness)*Math.cos(aa*angle) + 100 - b} w={(side4 + outerRadius1*Math.cos(aa*angle) - outerRadius1 - (outerRadius2 - thickness)*(1 - Math.cos(aa*angle)))/Math.sin(aa*angle)} h={thickness} angle={-angle}/>

        <LineAtTheta x={100 + side3/2 - side2 + outerRadius1*Math.tan(aa*angle/2) - (outerRadius1 - thickness)*Math.sin(aa*angle) + 100 - a} y={100 - side1/2 + outerRadius1 - (outerRadius1 - thickness)*Math.cos(aa*angle) + 100 - b} w={(side4 + outerRadius1*Math.cos(aa*angle) - outerRadius1 - (outerRadius2 - thickness)*(1 - Math.cos(aa*angle)))/Math.sin(aa*angle)} h={thickness} angle={180 - angle}/>

        <LineAtTheta x={100 + side3/2 - side2 + outerRadius1*Math.tan(aa*angle/2) - outerRadius1*Math.sin(aa*angle) + 100 - a} y={100 + side1/2 - outerRadius1 + outerRadius1*Math.cos(aa*angle) + 100 - b} w={(side4 + outerRadius1*Math.cos(aa*angle) - outerRadius1 - (outerRadius2 - thickness)*(1 - Math.cos(aa*angle)))/Math.sin(aa*angle)} h={thickness} angle={180 + angle}/>

        {/* outer radius */}
        <CircleSector radius={outerRadius1} centerX={(100 - side3/2 + outerRadius1) + 100 - a} centerY={(100 - side1/2 + outerRadius1) + 100 - b} angle={90} rotation={180} thickness={thickness}/>
        <CircleSector radius={outerRadius1} centerX={(100 + side3/2 - outerRadius1) + 100 - a} centerY={(100 - side1/2 + outerRadius1) + 100 - b} angle={90} rotation={270} thickness={thickness}/>
        <CircleSector radius={outerRadius1} centerX={(100 - side3/2 + outerRadius1) + 100 - a} centerY={(100 + side1/2 - outerRadius1) + 100 - b} angle={90} rotation={90} thickness={thickness}/>
        <CircleSector radius={outerRadius1} centerX={(100 + side3/2 - outerRadius1) + 100 - a} centerY={(100 + side1/2 - outerRadius1) + 100 - b} angle={90} rotation={0} thickness={thickness}/>
        <CircleSector radius={outerRadius1} centerX={(100 - side3/2 + side2 - outerRadius1*Math.tan(aa*angle/2)) + 100 - a} centerY={(100 + side1/2 - outerRadius1) + 100 - b} angle={angle} rotation={90 - angle} thickness={thickness}/>
        <CircleSector radius={outerRadius1} centerX={(100 - side3/2 + outerRadius1 + side2 - outerRadius1 - outerRadius1*Math.tan(aa*angle/2)) + 100 - a} centerY={(100 - side1/2 + outerRadius1) + 100 - b} angle={angle} rotation={270} thickness={thickness}/>
        <CircleSector radius={outerRadius1} centerX={(100 + side3/2 - outerRadius1 - (side2 - outerRadius1 - outerRadius1*Math.tan(aa*angle/2))) + 100 - a} centerY={(100 + side1/2 - outerRadius1) + 100 - b} angle={angle} rotation={90} thickness={thickness}/>
        <CircleSector radius={outerRadius1} centerX={(100 + side3/2 - outerRadius1 - (side2 - outerRadius1 - outerRadius1*Math.tan(aa*angle/2))) + 100 - a} centerY={(100 - side1/2 + outerRadius1) + 100 - b} angle={angle} rotation={270 - angle} thickness={thickness}/>


        <CircleSector radius={outerRadius2} centerX={100 - a + (100 - side3/2 + side2 - outerRadius1*Math.tan(aa*angle/2) + outerRadius1*Math.sin(aa*angle) + ((side4 + outerRadius1*Math.cos(aa*angle) - outerRadius1 - (outerRadius2 - thickness)*(1 - Math.cos(aa*angle)))/Math.sin(aa*angle))*Math.cos(aa*angle) + (outerRadius2 - thickness)*Math.sin(aa*angle))} centerY={100 - b + (100 - side1/2 + side4 - (outerRadius2 - thickness))} angle={angle} rotation={90} thickness={thickness} />

        <CircleSector radius={outerRadius2} centerX={100 - a + (100 - side3/2 + side2 - outerRadius1*Math.tan(aa*angle/2) + outerRadius1*Math.sin(aa*angle) + ((side4 + outerRadius1*Math.cos(aa*angle) - outerRadius1 - (outerRadius2 - thickness)*(1 - Math.cos(aa*angle)))/Math.sin(aa*angle))*Math.cos(aa*angle) + (outerRadius2 - thickness)*Math.sin(aa*angle))} centerY={100 - b + (100 + side1/2 - side4 + (outerRadius2 - thickness))} angle={angle} rotation={270 - angle} thickness={thickness} />

        <CircleSector radius={outerRadius2} centerX={100 - a + (100 + side3/2 - side2 + outerRadius1*Math.tan(aa*angle/2) - outerRadius1*Math.sin(aa*angle) - ((side4 + outerRadius1*Math.cos(aa*angle) - outerRadius1 - (outerRadius2 - thickness)*(1 - Math.cos(aa*angle)))/Math.sin(aa*angle))*Math.cos(aa*angle) - (outerRadius2 - thickness)*Math.sin(aa*angle))} centerY={100 - b + (100 + side1/2 - side4 + (outerRadius2 - thickness))} angle={angle} rotation={270} thickness={thickness} />

        <CircleSector radius={outerRadius2} centerX={100 - a + (100 + side3/2 - side2 + outerRadius1*Math.tan(aa*angle/2) - outerRadius1*Math.sin(aa*angle) - ((side4 + outerRadius1*Math.cos(aa*angle) - outerRadius1 - (outerRadius2 - thickness)*(1 - Math.cos(aa*angle)))/Math.sin(aa*angle))*Math.cos(aa*angle) - (outerRadius2 - thickness)*Math.sin(aa*angle))} centerY={100 - b + (100 - side1/2 + side4 - (outerRadius2 - thickness))} angle={angle} rotation={90 - angle} thickness={thickness} />


       
        <CircleSector radius={outerRadius2} centerX={100 - side3 / 2 + side2 + 100 - a} />

        <Linex x1={100 - side3 / 2 + 100 - a} x2={100 - side3 / 2 + side2 + 100 - a} y1={95 - side1 / 2 + 100 - b} y2={95 - side1 / 2 + 100 - b} text={'B'} val={side22} textHeight={-10} />

        <Linex x1={100 - side3 / 2 + 100 - a} x2={100 + side3 / 2 + 100 - a} y1={105 + side1 / 2 + 100 - b} y2={105 + side1 / 2 + 100 - b} text={'C'} val={side33} textHeight={10} />

        <Liney x1={95 - side3 / 2 + 100 - a} x2={95 - side3 / 2 + 100 - a} y1={100 - side1 / 2 + 100 - b} y2={100 + side1 / 2 + 100 - b} text={'A'} val={side11} textHeight={-17} />

        <Liney x1={100 + 100 - a} x2={100 + 100 - a} y1={100 - side1 / 2 + 100 - b} y2={100 - side1 / 2 + side4 + 100 - b} text={'D'} val={side44} textHeight={13} />

        <Liney x1={105 - side3 / 2 + side2 + 100 - a} x2={105 - side3 / 2 + side2 + 100 - a} y1={100 + side1 / 2 + 100 - b} y2={100 + side1 / 2 + 100 - b} text={'θ'} val={angle1} textHeight={17} />



      
      </svg>
      <button title={Props.title3} className='btn btn mx-2 my-2' onClick={zoomIn} style={{color: 'white', backgroundColor: '#1b065c'}}><i className="fa-solid fa-magnifying-glass-plus"></i></button>
      <button title={Props.title6} className='btn btn mx-2 my-2' onClick={resetZoom} style={{color: 'white', backgroundColor: '#1b065c'}}><i className="fa-solid fa-maximize"></i> </button>
      <button title={Props.title4} className='btn btn mx-2 my-2' onClick={zoomOut} style={{color: 'white', backgroundColor: '#1b065c'}}> <i className="fa-solid fa-magnifying-glass-minus"></i> </button>
    </div>
  );
}

export default Stiffner_graph;
