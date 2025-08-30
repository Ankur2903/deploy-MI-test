import React, { useState, useCallback, useEffect } from 'react';
import CircleSector from './Shap/Circle';
import * as Props from '../constant';
import Linex from './Shap/Linex';
import Liney from './Shap/Liney';
import LineAtTheta from './Shap/LineAtθ';
import Linez from './Shap/Linez';
import { COM } from '../AdvanceOutput/COM';
import { ComputeMomentOfInertia } from '../AdvanceOutput/MomentOfInertia';
import PredefinedPoints from '../PredefinedPoints';

function Trip_tube_graph({ side11, side22, side33, side44, side55, thickness1, outerRadius11, outerRadius22, outerRadius33, outerRadius44, angle1, angle2, angle3, sendValue}) {
  const mx = Math.max(side22,side11);
  const thickness = (thickness1/mx)*Props.ratio
  const side1 = (side11/mx)*Props.ratio
  const side2 = (side22/mx)*Props.ratio
  const side3 = (side33/mx)*Props.ratio
  const side4 = (side44/mx)*Props.ratio
  const side5 = (side55/mx)*Props.ratio
  const outerRadius1 = (outerRadius11/mx)*Props.ratio
  const outerRadius2 = (outerRadius22/mx)*Props.ratio
  const outerRadius3 = (outerRadius33/mx)*Props.ratio
  const outerRadius4 = (outerRadius44/mx)*Props.ratio

  const aa = Math.PI/180;
  const l1 = (side1 - outerRadius3 - outerRadius3*Math.cos(aa*angle1) - (outerRadius4 - thickness)*(1 + Math.cos(aa*angle1)) - side3)/(Math.sin(aa*angle1))

  const l2 = side2 - side5 + outerRadius3/Math.tan(aa*angle1/2) + l1*Math.cos(aa*angle1) - outerRadius3*Math.sin(aa*angle1) - (outerRadius4 - thickness)*Math.sin(aa*angle1) - outerRadius2

  const angle4 = 360 - angle3 - angle2

  const l3 = (side1 - outerRadius1 - outerRadius1*Math.cos(aa*angle2) - Math.tan(aa*angle2)*(side2 - outerRadius1 + outerRadius1*Math.sin(aa*angle2) + outerRadius2*Math.sin(aa*(angle3 + angle4)) - side4 + outerRadius2/Math.tan(aa*angle4/2)) - outerRadius2 + outerRadius2*Math.cos(aa*(angle3 + angle4)))/(Math.sin(aa*angle4) + Math.cos(aa*angle4)*Math.tan(aa*angle2))

  const l4 = (side1 - outerRadius1 - outerRadius1*Math.cos(aa*angle2) - outerRadius2 + outerRadius2*Math.cos(aa*(angle3 + angle4)) - l3*Math.sin(aa*angle4))/(Math.sin(aa*angle2))

  const x = 50 + outerRadius1 + outerRadius1*Math.cos(aa*angle2) + l4*Math.sin(aa*angle2) - outerRadius2*Math.cos(aa*(angle3 + angle4))

  const y = 150 - side2 + outerRadius1 - outerRadius1*Math.sin(aa*angle2) + l4*Math.cos(aa*angle2) - outerRadius2*Math.sin(aa*(angle3 + angle4))

  const predefinedPoints = [
    { id: 1, type: 'line', x: 50 + side1 - side3 + outerRadius2, y: 150 - thickness, w: side3 - outerRadius1 - outerRadius2, h: thickness, angle: 0 },
    { id: 2, type: 'line', x: 50 + side1 - side3, y: 150 - outerRadius2 - l2, w: thickness, h: l2, angle: 0 },
    { id: 3, type: 'line', x: 50 + side1 - thickness, y: 150 - side4 + outerRadius2 / Math.tan(aa * angle4 / 2), w: thickness, h: side4 - outerRadius1 - outerRadius2 / Math.tan(aa * angle4 / 2), angle: 0 },
    { id: 4, type: 'line', x: 50, y: 150 - side2 + outerRadius1, w: thickness, h: side5 - outerRadius1 - outerRadius3 / Math.tan(aa * angle1 / 2), angle: 0 },
    { id: 5, type: 'line', x: 50 + outerRadius3 + (outerRadius3 - thickness) * Math.cos(aa * angle1), y: 150 - side2 + side5 - outerRadius3 / Math.tan(aa * angle1 / 2) + (outerRadius3 - thickness) * Math.sin(aa * angle1), w: l1, h: thickness, angle: angle1 - 90 },
    { id: 6, type: 'line', x: 50 + side1 - outerRadius2 - (outerRadius2 - thickness) * Math.cos(aa * angle4), y: 150 - side4 + outerRadius2 / Math.tan(aa * angle4 / 2) - (outerRadius2 - thickness) * Math.sin(aa * angle4), w: l3, h: thickness, angle: angle4 + 90 },
    { id: 7, type: 'line', x: 50 + outerRadius1 + outerRadius1 * Math.cos(aa * angle2), y: 150 - side2 + outerRadius1 - outerRadius1 * Math.sin(aa * angle2), w: l4, h: thickness, angle: 90 - angle2 },
    { id: 8, type: 'circle', x: 50 + side1 - side3 + outerRadius2, y: 150 - outerRadius2, r: outerRadius2, angle: 90, rotation: 90, t: thickness },
    { id: 9, type: 'circle', x: 50 + side1 - outerRadius1, y: 150 - outerRadius1, r: outerRadius1, angle: 90, rotation: 0, t: thickness },
    { id: 10, type: 'circle', x: 50 + side1 - side3 + thickness - outerRadius4, y: 150 - outerRadius2 - l2, r: outerRadius4, angle: 180 - angle1, rotation: angle1 - 180, t: thickness },
    { id: 11, type: 'circle', x: 50 + side1 - outerRadius2, y: 150 - side4 + outerRadius2 / Math.tan(aa * angle4 / 2), r: outerRadius2, angle: 180 - angle4, rotation: angle4 - 180, t: thickness },
    { id: 12, type: 'circle', x: 50 + outerRadius1, y: 150 - side2 + outerRadius1, r: outerRadius1, angle: 180 - angle2, rotation: 180, t: thickness },
    { id: 13, type: 'circle', x: 50 + outerRadius3, y: 150 - side2 + side5 - outerRadius3 / Math.tan(aa * angle1 / 2), r: outerRadius3, angle: 180 - angle1, rotation: angle1, t: thickness },
    { id: 14, type: 'circle', x: x, y: y, r: outerRadius2, angle: 180 - angle3, rotation: angle3 + angle4 - 360, t: thickness },
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
            <input title={Props.title1} onClick={clickOndimensioning} className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" style={{color: '#1b065c', transform: 'translateY(0px) translateX(4px)'}}/>
            <label className="form-check-label" htmlFor="flexSwitchCheckDefault" >DIMENSIONING FUNCTION</label>
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
        <rect x={50 + side1 - side3 + outerRadius2 + 100 - a} y={150 - thickness + 100 - b} width={side3 - outerRadius1 - outerRadius2} height={thickness} fill="black" />
        <rect x={50 + side1 - side3 + 100 - a} y={150 - outerRadius2 - l2 + 100 - b} width={thickness} height={l2} fill="black" />
        <rect x={50 + side1 - thickness + 100 - a} y={150 - side4 + outerRadius2/Math.tan(aa*angle4/2) + 100 - b} width={thickness} height={side4 - outerRadius1 - outerRadius2/Math.tan(aa*angle4/2)} fill="black" />
        <rect x={50 + 100 - a} y={150 - side2 + outerRadius1 + 100 - b} width={thickness} height={side5 - outerRadius1 - outerRadius3/Math.tan(aa*angle1/2)} fill="black" />

        <LineAtTheta x={50 + outerRadius3 + (outerRadius3 - thickness)*Math.cos(aa*angle1) + 100 - a} y={150 - side2 + side5 - outerRadius3/Math.tan(aa*angle1/2) + (outerRadius3 - thickness)*Math.sin(aa*angle1) + 100 - b} w={l1} h={thickness} angle={angle1 - 90}/>
        <LineAtTheta x={50 + side1 - outerRadius2 - (outerRadius2 - thickness)*Math.cos(aa*angle4) + 100 - a} y={150 - side4 + outerRadius2/Math.tan(aa*angle4/2) - (outerRadius2 - thickness)*Math.sin(aa*angle4) + 100 - b} w={l3} h={thickness} angle={angle4 + 90}/>
        <LineAtTheta x={50 + outerRadius1 + outerRadius1*Math.cos(aa*angle2) + 100 - a} y={150 - side2 + outerRadius1 - outerRadius1*Math.sin(aa*angle2) + 100 - b} w={l4} h={thickness} angle={90 - angle2}/>

        <CircleSector radius={outerRadius2} centerX={50 + side1 - side3 + outerRadius2 + 100 - a} centerY={150 - outerRadius2 + 100 - b} angle={90} rotation={90} thickness={thickness}/>
        <CircleSector radius={outerRadius1} centerX={50 + side1 - outerRadius1 + 100 - a} centerY={150 - outerRadius1 + 100 - b} angle={90} rotation={0} thickness={thickness}/>
        <CircleSector radius={outerRadius4} centerX={50 + side1 - side3 + thickness - outerRadius4 + 100 - a} centerY={150 - outerRadius2 - l2 + 100 - b} angle={180 - angle1} rotation={angle1 - 180} thickness={thickness}/>
        <CircleSector radius={outerRadius2} centerX={50 + side1 - outerRadius2 + 100 - a} centerY={150 - side4 + outerRadius2/Math.tan(aa*angle4/2) + 100 - b} angle={180 - angle4} rotation={angle4 - 180} thickness={thickness}/>
        <CircleSector radius={outerRadius1} centerX={50 + outerRadius1 + 100 - a} centerY={150 - side2 + outerRadius1 + 100 - b} angle={180 - angle2} rotation={180} thickness={thickness}/>
        <CircleSector radius={outerRadius3} centerX={50 + outerRadius3 + 100 - a} centerY={150 - side2 + side5 - outerRadius3/Math.tan(aa*angle1/2) + 100 - b} angle={180 - angle1} rotation={angle1} thickness={thickness}/>
        <CircleSector radius={outerRadius2} centerX={x + 100 - a} centerY={y + 100 - b} angle={180 - angle3} rotation={angle3 + angle4 - 360} thickness={thickness}/>

       

        {/* Horizontal Arrow for A */}
        <Linex x1={50 + 100 - a} x2={50 + side1 + 100 - a} y1={45 + 100 - b} y2={45 + 100 - b} text={'A'} val={side11} textHeight={-5}/>

        <Liney x1={10 + 100 - a} x2={10 + 100 - a} y1={150 - side2 + 100 - b} y2={150 + 100 - b} text={'B'} val={side22} textHeight={17}/>

        <Liney x1={45 + 100 - a} x2={45 + 100 - a} y1={150 - side2 + 100 - b} y2={150 - side2 + side5 + 100 - b} text={'E'} val={side55} textHeight={-17}/>

        <Liney x1={55 + side1 + 100 - a} x2={55 + side1 + 100 - a} y1={150 - side4 + 100 - b} y2={150 + 100 - b} text={'D'} val={side44} textHeight={17}/>

        <Linex x1={50 + side1 - side3 + 100 - a} x2={50 + side1 + 100 - a} y1={155 + 100 - b} y2={155 + 100 - b} text={'C'} val={side33} textHeight={5}/>

        <Liney x1={55 + side1 + 100 - a} x2={55 + side1 + 100 - a} y1={155 + 100 - b} y2={155 + 100 - b} text={'R1'} val={outerRadius11} textHeight={17}/>

        <Liney x1={45 + 100 - a} x2={45 + 100 - a} y1={145 - side2 + 100 - b} y2={145 - side2 + 100 - b} text={'R1'} val={outerRadius11} textHeight={-17}/>

        <Liney x1={55 + side1 + 100 - a} x2={55 + side1 + 100 - a} y1={145 - side4 + 100 - b} y2={145 - side4 + 100 - b} text={'R2'} val={outerRadius22} textHeight={17}/>

        <Liney x1={55 + l4 + outerRadius1 + outerRadius2 + 100 - a} x2={55 + l4 + outerRadius1 + outerRadius2 + 100 - a} y1={150 - side4 - l3 + 100 - b} y2={150 - side4 - l3 + 100 - b} text={'R2'} val={outerRadius22} textHeight={17}/>

        <Liney x1={45 + side1 - side3 + 100 - a} x2={45 + side1 - side3 + 100 - a} y1={145 + 100 - b} y2={145 + 100 - b} text={'R2'} val={outerRadius22} textHeight={-17}/>

        <Liney x1={45 + 100 - a} x2={45 + 100 - a} y1={155 - side2 + side5 + 100 - b} y2={155 - side2 + side5 + 100 - b} text={'R3'} val={outerRadius33} textHeight={-17}/>

        <Liney x1={45 + side1 - side3 + 100 - a} x2={45 + side1 - side3 + 100 - a} y1={150 - l2 + 100 - b} y2={150 - l2 + 100 - b} text={'R4'} val={outerRadius44} textHeight={-17}/>

        <Linex x1={60 + thickness + 100 - a} x2={60 + thickness + 100 - a} y1={145 - side2 + side5 + 100 - b} y2={145 - side2 + side5 + 100 - b} text={'θ1'} val={angle1} textHeight={-5} unit={" "}/>

        <Linex x1={60 + thickness + 100 - a} x2={60 + thickness + 100 - a} y1={155 - side2 + outerRadius1 + 100 - b} y2={155 - side2 + outerRadius1 + 100 - b} text={'θ2'} val={angle2} textHeight={5} unit={" "}/>

        <Linex x1={40 + l4 + outerRadius1 + outerRadius2 + 100 - a} x2={40 + l4 + outerRadius1 + outerRadius2 + 100 - a} y1={155 - side4 - l3 + 100 - b} y2={155 - side4 - l3 + 100 - b} text={'θ3'} val={angle3} textHeight={5} unit={" "}/>


      </svg>
      <button title={Props.title3} className='btn btn mx-2 my-2' onClick={zoomIn} style={{color: 'white', backgroundColor: '#1b065c'}}><i className="fa-solid fa-magnifying-glass-plus"></i></button>
      <button title={Props.title6} className='btn btn mx-2 my-2' onClick={resetZoom} style={{color: 'white', backgroundColor: '#1b065c'}}><i className="fa-solid fa-maximize"></i> </button>
      <button title={Props.title4} className='btn btn mx-2 my-2' onClick={zoomOut} style={{color: 'white', backgroundColor: '#1b065c'}}> <i className="fa-solid fa-magnifying-glass-minus"></i> </button>
    </div>
  );
}

export default Trip_tube_graph;
