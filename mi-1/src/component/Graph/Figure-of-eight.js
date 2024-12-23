import React, { useState, useCallback, useEffect } from 'react';
import CircleSector from './Shap/Circle';
import Linex from './Shap/Linex';
import Liney from './Shap/Liney';
import LineAtTheta from './Shap/LineAtθ';

function Figure_of_eight_graph({ side11, side22, side33, angle1, r11, r22, thickness1, outerRadius1, sendValuey}) {
  const aa = Math.PI/180
  const len1 = ((1-Math.cos(aa*angle1))*(side11 + side33 - r22 - r11*Math.sin(Math.max(Math.PI/2, (aa)*angle1)) + (Math.sin(aa*angle1))*(r11 - side22 - outerRadius1)))/(Math.sin(aa*angle1));

  const a1 = side11  + side33 - (side33 - r11*Math.sin(Math.max(Math.PI/2, (aa)*angle1)))*Math.cos(Math.max(Math.PI/2, (aa)*angle1));
  const a2 = a1 - side22*Math.sin((aa)*(angle1)) - side11*Math.cos((aa)*angle1);
  const a3 = side22 + len1 + (len1 - r22*Math.sin(Math.max(Math.PI/2, (aa)*(angle1))))*Math.cos(Math.max(Math.PI/2, (aa)*(angle1)));
  const a4 = a2 + side11*Math.cos((aa)*(90 - (angle1))) + side22*Math.cos((aa)*(angle1));
  const mx = Math.max(a1,Math.max(a2,Math.max(a3,a4)));
  const thickness = (thickness1/mx)*100;
  const side1 = (side11/mx)*100;
  const side2 = (side22/mx)*100;
  const side3 = (side33/mx)*100;
  const angle = 180 - angle1;
  const r1 = (r11/mx)*100;
  const r2 = (r22/mx)*100;
  const outerRadius = (outerRadius1/mx)*100;
  

  const x1 = 50 + side1  + side3 - r1*Math.sin(Math.min(Math.PI/2, (aa)*angle)) + r1*Math.sin((aa)*angle);
  const y1 = 50 + r1 -  r1*Math.cos((aa)*angle);

  const x2 = x1 + (side3 - r1*Math.sin(Math.min(Math.PI/2, (aa)*angle)) - outerRadius)*Math.cos((aa)*angle) - outerRadius*Math.sin((aa)*angle);
  const y2 = y1 + (side3 - r1*Math.sin(Math.min(Math.PI/2, (aa)*angle)) - outerRadius)*Math.sin((aa)*angle) + outerRadius*Math.cos((aa)*angle)

  const x3 = x2 + outerRadius*Math.cos(aa*angle);
  const y3 = y2 + outerRadius*Math.sin(aa*angle);

  const x4 = x3 - (side2 - 2*outerRadius + thickness)*Math.sin(aa*angle) + (outerRadius - thickness)*Math.cos(aa*angle);
  const y4 = y3 + (side2 - 2*outerRadius + thickness)*Math.cos(aa*angle) + (outerRadius - thickness)*Math.sin(aa*angle);

  const x5 = x4 - (outerRadius - thickness)*Math.sin(aa*angle);
  const y5 = y4 + (outerRadius - thickness)*Math.cos(aa*angle);

  const x6 = x5 + (side1 - 2*outerRadius + thickness)*Math.cos(aa*angle)  - outerRadius*Math.sin((aa)*angle);
  const y6 = y5 + (side1 - 2*outerRadius + thickness)*Math.sin(aa*angle)  + outerRadius*Math.cos((aa)*angle);

  const x7 = x6 + outerRadius*Math.cos(aa*angle);
  const y7 = y6 + outerRadius*Math.sin(aa*angle);

  const len = (x7 - 50 - r2 - r2*Math.cos(aa*angle))/(Math.sin(aa*angle))

  const x8 = x7 - (len)*Math.sin(aa*angle) - r2*Math.cos(aa*angle);
  const y8 = y7 + (len)*Math.cos(aa*angle) - r2*Math.sin(aa*angle);

  const x9 = x8 - r2;
  const y9 = y8 - (len);

  const  comy = parseFloat(((1)/(1)).toFixed(2))

  React.useEffect(() => {
    sendValuey((comy/100)*mx);
  }, [sendValuey]);

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
      <div className="form-check form-switch">
            <input className="form-check-input" onClick={clickOndimensioning} type="checkbox" role="switch" id="flexSwitchCheckDefault"/>
            <label className="form-check-label" htmlFor="flexSwitchCheckDefault">DIMENSIONING FUNCTION</label>
          </div>
      <svg
        viewBox={viewBox}
        style={{ width: '100%', height: 'auto', backgroundColor: '#f9f9f9', border: '1px solid #ccc' }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart} onClick={handleSVGClick}
      >
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
        <rect x={50 + outerRadius} y={50 + side2} width={side1 - 2*outerRadius + thickness} height={thickness} fill="black" />
        <rect x={50 + side1} y={50 + outerRadius} width={thickness} height={side2 - 2*outerRadius + thickness} fill="black" />
        <rect x={50 + side1 + outerRadius} y={50} width={side3 - r1*Math.sin(Math.min(Math.PI/2, (aa)*angle)) - outerRadius} height={thickness} fill="black" />
        <LineAtTheta x = {x1} y = {y1} w = {side3 - r1*Math.sin(Math.min(Math.PI/2, (aa)*angle)) - outerRadius} h = {thickness} angle={angle}/>
        <LineAtTheta x = {x3} y = {y3} w = {side2 - 2*outerRadius + thickness} h = {thickness} angle={90 + angle}/>
        <LineAtTheta x = {x5} y = {y5} w = {side1 - 2*outerRadius + thickness} h = {thickness} angle={angle}/>
        <LineAtTheta x = {x7} y = {y7} w = {len} h = {thickness} angle={angle + 90}/>
        <rect x={x9} y={y9} width={thickness} height={len} fill="black" />



        

        {/* outer radius */}
        <CircleSector radius={outerRadius} centerX={50 + side1 + outerRadius} centerY={50 +  outerRadius} angle={90} rotation={180} thickness={thickness}/>
        <CircleSector radius={outerRadius} centerX={50 + side1 - outerRadius + thickness} centerY={50 + side2 - outerRadius + thickness} angle={90} rotation={0} thickness={thickness}/>
        <CircleSector radius={outerRadius} centerX={50 + outerRadius} centerY={50 + side2 + outerRadius} angle={90} rotation={180} thickness={thickness}/>
        <CircleSector radius={outerRadius} centerX={x2} centerY={y2} angle={90} rotation={angle - 90} thickness={thickness}/>
        <CircleSector radius={outerRadius} centerX={x4} centerY={y4} angle={90} rotation={angle + 90} thickness={thickness}/>
        <CircleSector radius={outerRadius} centerX={x6} centerY={y6} angle={90} rotation={angle - 90} thickness={thickness}/>
        <CircleSector radius={r2} centerX={x8} centerY={y8} angle={180 - angle} rotation={angle} thickness={thickness}/>
        <CircleSector radius={r1} centerX={50 + side1 + (side3 - r1*Math.sin(Math.min(Math.PI/2, (aa)*angle)))} centerY={50 + r1} angle={angle} rotation={270} thickness={thickness}/>

        {/*  Horizontal Arrow for side1*/}
        <Linex x1={50 + side1} x2={50 + side1 + side3} y1={45} y2={45} text={'C'} val={side33} textHeight={-10}/>

        {/* Horizontal Arrow for side1 */}
        <Linex x1={50} x2={50 + side1} y1={45 + side2} y2={45 + side2} text={'A'} val={side11} textHeight={-10}/>

        {/* Vertical Arrow for side2 */}
        <Liney x1={57 + side1} x2={57+side1} y1={50} y2={50 + side2} text={'B'} val={side22} textHeight={17}/>

        {/*Vertical Arrow for r2 */}
        <Linex x1={50} x2={50 + r2} y1={55 + side2 + outerRadius + len + r2} y2={55 + side2 + outerRadius + len + r2} text={'R2'} val={r22} textHeight={10}/>

        {/*Horizontal Arrow for r1 */}
        <Liney x1={55 + side1 + side3} x2={55 + side1 + side3} y1={50} y2={50 + r1} text={'R1'} val={r22} textHeight={17}/>


      
      </svg>
      <button className='mx-2 my-2' onClick={zoomIn}><i className="fa-solid fa-magnifying-glass-plus"></i></button>
      <button className='mx-2 my-2' onClick={resetZoom}><i className="fa-solid fa-maximize"></i> </button>
      <button className='mx-2 my-2' onClick={zoomOut}> <i className="fa-solid fa-magnifying-glass-minus"></i> </button>
    </div>
  );
}

export default Figure_of_eight_graph;

