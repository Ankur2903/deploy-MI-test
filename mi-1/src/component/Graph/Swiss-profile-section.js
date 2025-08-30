import React, { useState, useCallback, useEffect } from 'react';
import CircleSector from './Shap/Circle';
import * as Props from '../constant';
import Linex from './Shap/Linex';
import Liney from './Shap/Liney';
import LineAtTheta from './Shap/LineAtθ';
import { COM } from '../AdvanceOutput/COM';
import { ComputeMomentOfInertia } from '../AdvanceOutput/MomentOfInertia';
import PredefinedPoints from '../PredefinedPoints';

function Swiss_profile_section_graph({radius11, radius22, angle, thickness1, outerRadius11, outerRadius22, sendValue}) {
  const aa = Math.PI/180
  const mx = Math.max(2*radius22*Math.sin(aa*angle/2), radius22 - (radius22 - radius11)*Math.cos(aa*angle/2));
  const radius1 = (radius11/mx)*Props.ratio
  const radius2 = (radius22/mx)*Props.ratio
  const thickness = (thickness1/mx)*Props.ratio
  const outerRadius1 = (outerRadius11/mx)*Props.ratio
  const outerRadius2 = (outerRadius22/mx)*Props.ratio

  const angle2 = (180/Math.PI)*Math.asin(outerRadius2/(radius2 - outerRadius2))
  const angle1 = (180/Math.PI)*Math.asin(outerRadius1/(radius1 - thickness + outerRadius1))

  const l = radius2/Math.cos(aa*angle2) - (radius1 - thickness)/Math.cos(aa*angle1)  - radius2*Math.tan(aa*angle2) - (radius1 - thickness)*Math.tan(aa*angle1)

  const predefinedPoints = [
    { id: 1, type: 'line', x: 100 - (radius2 - outerRadius2)*Math.sin(aa*(angle/2 - angle2)) - (outerRadius2 - thickness)*Math.cos(aa*angle/2), y: 50 + radius2 - (radius2 - outerRadius2)*Math.cos(aa*(angle/2 - angle2)) + (outerRadius2 - thickness)*Math.sin(aa*angle/2), w: l, h: thickness, angle: 90 - angle/2 },
    { id: 2, type: 'line', x: 100 + (radius1 - thickness + outerRadius1)*Math.sin(aa*(angle/2 - angle1)) + (outerRadius1 - thickness)*Math.cos(aa*angle/2), y: 50 + radius2 - (radius1 - thickness + outerRadius1)*Math.cos(aa*(angle/2 - angle1)) + (outerRadius1 - thickness)*Math.sin(aa*angle/2), w: l, h: thickness, angle: angle/2 - 90 },
    { id: 3, type: 'circle', x: 100, y: 50 + radius2, r: radius2, angle: angle - 2*angle2, rotation: 270 - angle/2 + angle2, t: thickness },
    { id: 4, type: 'circle', x: 100, y: 50 + radius2, r: radius1, angle: angle - 2*angle1, rotation: 270 - angle/2 + angle1, t: thickness },
    { id: 5, type: 'circle', x: 100 + (radius1 - thickness + outerRadius1)*Math.sin(aa*(angle/2 - angle1)), y: 50 + radius2 - (radius1 - thickness + outerRadius1)*Math.cos(aa*(angle/2 - angle1)), r: outerRadius1, angle: 90 - angle1, rotation: angle/2, t: thickness },
    { id: 6, type: 'circle', x: 100 - (radius1 - thickness + outerRadius1)*Math.sin(aa*(angle/2 - angle1)), y: 50 + radius2 - (radius1 - thickness + outerRadius1)*Math.cos(aa*(angle/2 - angle1)), r: outerRadius1, angle: 90 - angle1, rotation: 90 - angle/2 + angle1, t: thickness },
    { id: 7, type: 'circle', x: 100 + (radius2 - outerRadius2)*Math.sin(aa*(angle/2 - angle2)), y: 50 + radius2 - (radius2 - outerRadius2)*Math.cos(aa*(angle/2 - angle2)), r: outerRadius2, angle: angle2 + 90, rotation: angle/2 - 90 - angle2, t: thickness },
    { id: 8, type: 'circle', x: 100 - (radius2 - outerRadius2)*Math.sin(aa*(angle/2 - angle2)), y: 50 + radius2 - (radius2 - outerRadius2)*Math.cos(aa*(angle/2 - angle2)), r: outerRadius2, angle: angle2 + 90, rotation: 180 - angle/2, t: thickness },
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

{dimensioning && <PredefinedPoints points={translatedPoints} mx={mx} thickness={thickness} scale={scale}/>}

        {/* L Shape */}
        <LineAtTheta x={100 - a + 100 - (radius2 - outerRadius2) * Math.sin(aa * (angle / 2 - angle2)) - (outerRadius2 - thickness) * Math.cos(aa * angle / 2)} y={100 - b + 50 + radius2 - (radius2 - outerRadius2) * Math.cos(aa * (angle / 2 - angle2)) + (outerRadius2 - thickness) * Math.sin(aa * angle / 2)} w={l} h={thickness} angle={90 - angle / 2} />

        <LineAtTheta x={100 - a + 100 + (radius1 - thickness + outerRadius1) * Math.sin(aa * (angle / 2 - angle1)) + (outerRadius1 - thickness) * Math.cos(aa * angle / 2)} y={100 - b + 50 + radius2 - (radius1 - thickness + outerRadius1) * Math.cos(aa * (angle / 2 - angle1)) + (outerRadius1 - thickness) * Math.sin(aa * angle / 2)} w={l} h={thickness} angle={angle / 2 - 90} />

        <CircleSector radius={radius2} centerX={100 - a + 100} centerY={100 - b + 50 + radius2} angle={angle - 2 * angle2} rotation={270 - angle / 2 + angle2} thickness={thickness} />

        <CircleSector radius={radius1} centerX={100 - a + 100} centerY={100 - b + 50 + radius2} angle={angle - 2 * angle1} rotation={270 - angle / 2 + angle1} thickness={thickness} />

        <CircleSector radius={outerRadius1} centerX={100 - a + 100 + (radius1 - thickness + outerRadius1) * Math.sin(aa * (angle / 2 - angle1))} centerY={100 - b + 50 + radius2 - (radius1 - thickness + outerRadius1) * Math.cos(aa * (angle / 2 - angle1))} angle={90 - angle1} rotation={angle / 2} thickness={thickness} />

        <CircleSector radius={outerRadius1} centerX={100 - a + 100 - (radius1 - thickness + outerRadius1) * Math.sin(aa * (angle / 2 - angle1))} centerY={100 - b + 50 + radius2 - (radius1 - thickness + outerRadius1) * Math.cos(aa * (angle / 2 - angle1))} angle={90 - angle1} rotation={90 - angle / 2 + angle1} thickness={thickness} />

        <CircleSector radius={outerRadius2} centerX={100 - a + 100 + (radius2 - outerRadius2) * Math.sin(aa * (angle / 2 - angle2))} centerY={100 - b + 50 + radius2 - (radius2 - outerRadius2) * Math.cos(aa * (angle / 2 - angle2))} angle={angle2 + 90} rotation={angle / 2 - 90 - angle2} thickness={thickness} />

        <CircleSector radius={outerRadius2} centerX={100 - a + 100 - (radius2 - outerRadius2) * Math.sin(aa * (angle / 2 - angle2))} centerY={100 - b + 50 + radius2 - (radius2 - outerRadius2) * Math.cos(aa * (angle / 2 - angle2))} angle={angle2 + 90} rotation={180 - angle / 2} thickness={thickness} />

        <Linex x1={100 - a + 95 - (radius2 - outerRadius2) * Math.sin(aa * (angle / 2 - angle2)) - outerRadius2} x2={100 - a + 95 - (radius2 - outerRadius2) * Math.sin(aa * (angle / 2 - angle2)) - outerRadius2} y1={100 - b + 50 + radius2 - (radius2 - outerRadius2) * Math.cos(aa * (angle / 2 - angle2))} y2={100 - b + 50 + radius2 - (radius2 - outerRadius2) * Math.cos(aa * (angle / 2 - angle2))} text={'r2'} val={outerRadius22} textHeight={-10} />

        <Linex x1={100 - a + 90 - (radius1 - thickness + outerRadius1) * Math.sin(aa * (angle / 2 - angle1)) - outerRadius1} x2={100 - a + 90 - (radius1 - thickness + outerRadius1) * Math.sin(aa * (angle / 2 - angle1)) - outerRadius1} y1={100 - b + 50 + radius2 - (radius1 - thickness + outerRadius1) * Math.cos(aa * (angle / 2 - angle1))} y2={100 - b + 50 + radius2 - (radius1 - thickness + outerRadius1) * Math.cos(aa * (angle / 2 - angle1))} text={'r1'} val={outerRadius11} textHeight={10} />

        <Linex x1={100 - a + 100} x2={100 - a + 100} y1={100 - b + 45} y2={100 - b + 45} text={'R2'} val={radius22} textHeight={-5} />

        <Linex x1={100 - a + 100} x2={100 - a + 100} y1={100 - b + 55 + radius2 - radius1} y2={100 - b + 55 + radius2 - radius1} text={'R1'} val={radius11} textHeight={7} />




      </svg>
      <button title={Props.title3} className='btn btn mx-2 my-2' onClick={zoomIn} style={{color: 'white', backgroundColor: '#1b065c'}}><i className="fa-solid fa-magnifying-glass-plus"></i></button>
      <button title={Props.title6} className='btn btn mx-2 my-2' onClick={resetZoom} style={{color: 'white', backgroundColor: '#1b065c'}}><i className="fa-solid fa-maximize"></i> </button>
      <button title={Props.title4} className='btn btn mx-2 my-2' onClick={zoomOut} style={{color: 'white', backgroundColor: '#1b065c'}}> <i className="fa-solid fa-magnifying-glass-minus"></i> </button>
    </div>
  );
}

export default Swiss_profile_section_graph;
