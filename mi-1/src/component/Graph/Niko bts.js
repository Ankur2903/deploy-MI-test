import React, { useState, useCallback, useEffect } from 'react';
import CircleSector from './Shap/Circle';
import * as Props from '../constant';
import Linex from './Shap/Linex';
import Liney from './Shap/Liney';
import LineAtTheta from './Shap/LineAtθ';
import { COM } from '../AdvanceOutput/COM';

function Niko_bts_graph({ side11, side22, side33, side44, angle, thickness1, outerRadius1}) {
  const mx = Math.max(side22 + side33,side11);
  const thickness = (thickness1/mx)*Props.ratio
  const side1 = (side11/mx)*Props.ratio
  const side2 = (side22/mx)*Props.ratio
  const side3 = (side33/mx)*Props.ratio
  const side4 = (side44/mx)*Props.ratio
  const outerRadius = (outerRadius1/mx)*Props.ratio
  const angle1 = 270 - angle

  const aa = Math.PI/180;
  const l =  - outerRadius/Math.tan(aa*angle1/2) - outerRadius/Math.tan(aa*angle/2) - side3/Math.cos(aa*angle)

  const x1 = 50 +  outerRadius
  const y1 = 150 - side2 + outerRadius/Math.tan(aa*angle/2)

  const x2 = x1 + l*Math.sin(aa*angle)
  const y2 = y1 + l*Math.cos(aa*angle)

  const x3 = 50 + side1 - outerRadius
  const y3 = 150 - side2 + outerRadius/Math.tan(aa*angle/2)

  const x4 = x3 - l*Math.sin(aa*angle)
  const y4 = y3 + l*Math.cos(aa*angle)

  const predefinedPoints = [
    { id: 1, type: 'line', x: 50 + outerRadius, y: 150 - thickness, w: side1 - 2*outerRadius, h: thickness, angle: 0 },
    { id: 2, type: 'line', x: 50, y: 150 - side2 + outerRadius/Math.tan(aa*angle/2), w: thickness, h: side2 - outerRadius - outerRadius/Math.tan(aa*angle/2), angle: 0 },
    { id: 3, type: 'line', x: 50 + side1 - thickness, y: 150 - side2 + outerRadius/Math.tan(aa*angle/2), w: thickness, h: side2 - outerRadius - outerRadius/Math.tan(aa*angle/2), angle: 0 },
    { id: 4, type: 'line', x: x2, y: 150 - side2 - side3, w: side4 - outerRadius/Math.tan(aa*angle1/2), h: thickness, angle: 0 },
    { id: 5, type: 'line', x: x4 - side4 + outerRadius/Math.tan(aa*angle1/2), y: 150 - side2 - side3, w: side4 - outerRadius/Math.tan(aa*angle1/2), h: thickness, angle: 0 },
    { id: 6, type: 'line', x: 50 + (outerRadius/Math.tan(aa*angle/2))*Math.sin(aa*angle), y: 150 - side2 + (outerRadius/Math.tan(aa*angle/2))*Math.cos(aa*angle), w: l, h: thickness, angle: 90 - angle },
    { id: 7, type: 'line', x: 50 + side1 + (l + outerRadius/Math.tan(aa*angle/2))*Math.cos(aa*angle1), y: 150 - side2 - side3 + outerRadius + outerRadius*Math.cos(aa*angle1), w: l, h: thickness, angle: angle - 90 },
    { id: 8, type: 'circle', x: 50 + outerRadius, y: 150 - outerRadius, r: outerRadius, angle: 90, rotation: 90, t: thickness },
    { id: 9, type: 'circle', x: 50 + side1 - outerRadius, y: 150 - outerRadius, r: outerRadius, angle: 90, rotation: 0, t: thickness },
    { id: 10, type: 'circle', x: 50 + outerRadius, y: 150 - side2 + outerRadius/Math.tan(aa*angle/2), r: outerRadius, angle: 180 - angle, rotation: 180, t: thickness },
    { id: 11, type: 'circle', x: 50 + side1 - outerRadius, y: 150 - side2 + outerRadius/Math.tan(aa*angle/2), r: outerRadius, angle: 180 - angle, rotation: angle - 180, t: thickness },
    { id: 12, type: 'circle', x: x2, y: y2, r: outerRadius, angle: 180 - angle1, rotation: 360 - angle, t: thickness },
    { id: 13, type: 'circle', x: x4, y: y4, r: outerRadius, angle: 180 - angle1, rotation: 270, t: thickness },
  ];


  const {a, b} = COM(predefinedPoints)

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

  const handleSVGClick = (event) => {
    if(!dimensioning) return;
    const svg = event.target.closest('svg');
    const { left, top, width, height } = svg.getBoundingClientRect();

    const viewBox = svg.viewBox.baseVal;
    const ratio = width/height;
    let scale = 0;
    let startX = 0;
    let startY = 0;
    if(ratio >200/160){
      scale = viewBox.height / height;
      startY = viewBox.y;
      startX = viewBox.x - (width*scale - viewBox.width)/2;
    }  
    else{
     scale = viewBox.width / width;
     startX = viewBox.x;
     startY = viewBox.y - (height*scale - viewBox.height)/2;
    }

    const newPoint = {
      x: (event.clientX - left)*scale + startX,
      y: (event.clientY - top)*scale + startY,
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
            <input title={Props.title1} onClick={clickOndimensioning} className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" style={{color: '#1b065c', transform: 'translateY(0px) translateX(4px)'}}/>
            <label className="form-check-label" htmlFor="flexSwitchCheckDefault" >DIMENSIONING FUNCTION</label>
          </div>
      <svg viewBox={viewBox} style={{ width: '100%', height: '61vh', backgroundColor: '#f9f9f9', border: '1px solid #ccc' }} onMouseDown={handleMouseDown} onTouchStart={handleTouchStart} onClick={handleSVGClick}>
      {points.map((point, index) => (
              <circle key={index} cx={point.x} cy={point.y} r={2} fill={index === 0 ? "blue" : "red"} />
            ))}
            {points.length === 2 && (<line x1={points[0].x} y1={points[0].y} x2={points[1].x} y2={points[1].y} stroke="black"/>)}
            {points.length === 2 && <text  x={(points[0].x + points[1].x)/2 + 3} y={(points[0].y + points[1].y)/2 - 3} fontSize="5"> {(distance*mx/100).toFixed(3)} mm</text>}
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

        {/* L Shape */}
        <rect x={50 + outerRadius + 100 - a} y={150 - thickness + 100 - b} width={side1 - 2*outerRadius} height={thickness} fill="black" />
        <rect x={50 + 100 - a} y={150 - side2 + outerRadius/Math.tan(aa*angle/2) + 100 - b} width={thickness} height={side2 - outerRadius - outerRadius/Math.tan(aa*angle/2)} fill="black" />
        <rect x={50 + side1 - thickness + 100 - a} y={150 - side2 + outerRadius/Math.tan(aa*angle/2) + 100 - b} width={thickness} height={side2 - outerRadius - outerRadius/Math.tan(aa*angle/2)} fill="black" />
        <rect x={x2 + 100 - a} y={150 - side2 - side3 + 100 - b} width={side4 - outerRadius/Math.tan(aa*angle1/2)} height={thickness} fill="black" />
        <rect x={x4 - side4 + outerRadius/Math.tan(aa*angle1/2) + 100 - a} y={150 - side2 - side3 + 100 - b} width={side4 - outerRadius/Math.tan(aa*angle1/2)} height={thickness} fill="black" />

        <LineAtTheta x={50 + (outerRadius/Math.tan(aa*angle/2))*Math.sin(aa*angle) + 100 - a} y={150 - side2 + (outerRadius/Math.tan(aa*angle/2))*Math.cos(aa*angle) + 100 - b} w={l} h={thickness} angle={90 - angle}/>
        <LineAtTheta x={50 + side1 + (l + outerRadius/Math.tan(aa*angle/2))*Math.cos(aa*angle1) + 100 - a} y={150 - side2 - side3 + outerRadius + outerRadius*Math.cos(aa*angle1) + 100 - b} w={l} h={thickness} angle={angle - 90}/>

        <CircleSector radius={outerRadius} centerX={50 + outerRadius + 100 - a} centerY={150 - outerRadius + 100 - b} angle={90} rotation={90} thickness={thickness}/>
        <CircleSector radius={outerRadius} centerX={50 + side1 - outerRadius + 100 - a} centerY={150 - outerRadius + 100 - b} angle={90} rotation={0} thickness={thickness}/>
        <CircleSector radius={outerRadius} centerX={50 +  outerRadius + 100 - a} centerY={150 - side2 + outerRadius/Math.tan(aa*angle/2) + 100 - b} angle={180 - angle} rotation={180} thickness={thickness}/>
        <CircleSector radius={outerRadius} centerX={50 + side1 - outerRadius + 100 - a} centerY={150 - side2 + outerRadius/Math.tan(aa*angle/2) + 100 - b} angle={180 - angle} rotation={angle - 180} thickness={thickness}/>
        <CircleSector radius={outerRadius} centerX={x2 + 100 - a} centerY={y2 + 100 - b} angle={180 - angle1} rotation={360 - angle} thickness={thickness}/>
        <CircleSector radius={outerRadius} centerX={x4 + 100 - a} centerY={y4 + 100 - b} angle={180 - angle1} rotation={270} thickness={thickness}/>

        <Liney x1={45 + 100 - a} x2={45 + 100 - a} y1={150 - side2 + 100 - b} y2={150 + 100 - b} text={'B'} val={side22} textHeight={-17}/>
        <Liney x1={45 + 100 - a} x2={45 + 100 - a} y1={150 - side3 - side2 + 100 - b} y2={150 - side2 + 100 - b} text={'C'} val={side33} textHeight={-17}/>
        <Linex x1={55 + side1 + 100 - a} x2={55 + side1 + 100 - a} y1={150 - side2 + 100 - b} y2={150 - side2 + 100 - b} text={'θ'} val={angle} textHeight={-10} unit={" "}/>
        <Linex x1={50 + 100 - a} x2={50 + side1 + 100 - a} y1={155 + 100 - b} y2={155 + 100 - b} text={'A'} val={side11} textHeight={5}/>
        <Linex x1={x2 - outerRadius/Math.tan(aa*angle1/2) + 100 - a} x2={x2 - outerRadius/Math.tan(aa*angle1/2) + side4 + 100 - a} y1={145 - side2 - side3 + 100 - b} y2={145 - side2 - side3 + 100 - b} text={'D'} val={side44} textHeight={-5}/>

      
      </svg>
      <button title={Props.title3} className='btn btn mx-2 my-2' onClick={zoomIn} style={{color: 'white', backgroundColor: '#1b065c'}}><i className="fa-solid fa-magnifying-glass-plus"></i></button>
      <button title={Props.title6} className='btn btn mx-2 my-2' onClick={resetZoom} style={{color: 'white', backgroundColor: '#1b065c'}}><i className="fa-solid fa-maximize"></i> </button>
      <button title={Props.title4} className='btn btn mx-2 my-2' onClick={zoomOut} style={{color: 'white', backgroundColor: '#1b065c'}}> <i className="fa-solid fa-magnifying-glass-minus"></i> </button>
    </div>
  );
}

export default Niko_bts_graph;
