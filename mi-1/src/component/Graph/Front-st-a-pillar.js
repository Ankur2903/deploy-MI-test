import React, { useState, useCallback, useEffect } from 'react';
import CircleSector from './Shap/Circle';
import Linex from './Shap/Linex';
import Liney from './Shap/Liney';
import LineAtTheta from './Shap/LineAtθ';

function Front_st_a_pillar_graph({radius11, radius22, angle1, angle2, thickness1, outerRadius1}) {
  const aa = Math.PI/180
  const x1 = outerRadius1 - (radius11 + outerRadius1)*Math.cos(aa*angle1)
  const xmx = radius22 + x1
  const ymx = 2*outerRadius1 + (radius22 - outerRadius1)*Math.sin(aa*angle2)

  const mx = Math.max(xmx, ymx);
  const radius1 = (radius11/mx)*100;
  const radius2 = (radius22/mx)*100;
  const thickness = (thickness1/mx)*100;
  const outerRadius = (outerRadius1/mx)*100;
  const x = 50 + x1*100/mx

  const angle3 = (180/Math.PI)*Math.atan(((radius2 - outerRadius)*Math.sin(aa*angle2) - (radius1 + outerRadius)*Math.sin(aa*angle1))/((radius2 - outerRadius)*Math.cos(aa*angle2) - (radius1 + outerRadius)*Math.cos(aa*angle1)))

  console.log({angle1, angle2, angle3})

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
        {points.map((point, index) => (
          <circle key={index} cx={point.x} cy={point.y} r={2} fill={index === 0 ? "blue" : "red"}/>))
        }
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

        <rect x={x + radius1 + outerRadius} y={150 - thickness} width={radius2 - radius1 - 2*outerRadius} height={thickness} fill="black"/>

        {/* L Shape */}
        <LineAtTheta x = {x + (radius1 + outerRadius)*Math.cos(aa*angle1) - outerRadius*Math.sin(aa*angle3)} y = {150 - outerRadius - (radius1 + outerRadius)*Math.sin(aa*angle1) - outerRadius*Math.cos(aa*angle3)} w = {((radius2 - outerRadius)*Math.cos(aa*angle2) - (radius1 + outerRadius)*Math.cos(aa*angle1))/Math.cos(aa*angle3)} h = {thickness} angle={-angle3}/>

       
        {/* outer radius */}
        <CircleSector radius={radius1 + thickness} centerX={x} centerY={150 - outerRadius} angle={angle1} rotation={0 - angle1} thickness={thickness}/>
        <CircleSector radius={radius2} centerX={x} centerY={150 - outerRadius} angle={angle2} rotation={0 - angle2} thickness={thickness}/>
        <CircleSector radius={outerRadius} centerX={x + radius1 + outerRadius} centerY={150 - outerRadius} angle={90} rotation={90} thickness={thickness}/>
        <CircleSector radius={outerRadius} centerX={x + radius2 - outerRadius} centerY={150 - outerRadius} angle={90} rotation={0} thickness={thickness}/>
        <CircleSector radius={outerRadius} centerX={x + (radius1 + outerRadius)*Math.cos(aa*angle1)} centerY={150 - outerRadius - (radius1 + outerRadius)*Math.sin(aa*angle1)} angle={90 + angle1 - angle3} rotation={180 - angle1} thickness={thickness}/>
        <CircleSector radius={outerRadius} centerX={x + (radius2 - outerRadius)*Math.cos(aa*angle2)} centerY={150 - outerRadius - (radius2 - outerRadius)*Math.sin(aa*angle2)} angle={90 - angle2 + angle3} rotation={270 - angle3} thickness={thickness}/>
       
       
       
        {/*  Horizontal Arrow for side2*/}
        <Linex x1={35} x2={35} y1={150} y2={150} text={'R1'} val={radius11} textHeight={-7}/>

        {/*  Horizontal Arrow for side2*/}
        <Linex x1={35} x2={35} y1={155} y2={155} text={'θ1'} val={angle1} textHeight={7}/>

        
        {/*  Horizontal Arrow for side2*/}
        <Linex x1={x + radius2 + 15} x2={x + radius2 + 15} y1={150} y2={150} text={'R2'} val={radius22} textHeight={-7}/>

        {/*  Horizontal Arrow for side2*/}
        <Linex x1={x + radius2 + 15} x2={x + radius2 + 15} y1={155} y2={155} text={'θ2'} val={angle2} textHeight={7}/>


      </svg>
      <button className='btn btn mx-2 my-2' onClick={zoomIn} style={{color: 'white', backgroundColor: '#1b065c'}}><i className="fa-solid fa-magnifying-glass-plus"></i></button>
      <button className='btn btn mx-2 my-2' onClick={resetZoom} style={{color: 'white', backgroundColor: '#1b065c'}}><i className="fa-solid fa-maximize"></i> </button>
      <button className='btn btn mx-2 my-2' onClick={zoomOut} style={{color: 'white', backgroundColor: '#1b065c'}}> <i className="fa-solid fa-magnifying-glass-minus"></i> </button>
    </div>
  );
}

export default Front_st_a_pillar_graph;
