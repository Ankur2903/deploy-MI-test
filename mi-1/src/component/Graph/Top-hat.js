import React, { useState, useCallback, useEffect } from 'react';
import CircleSector from './Shap/Circle';
import * as Props from '../constant';
import Linex from './Shap/Linex';
import Liney from './Shap/Liney';

function Top_hat_graph({ side11, side22, side33, thickness1, outerRadius1,  sendValuey}) {
  const mx = Math.max(2*side11 + side33 -2*thickness1,side22);
  const thickness = (thickness1/mx)*Props.ratio
  const side1 = (side11/mx)*Props.ratio
  const side2 = (side22/mx)*Props.ratio
  const side3 = (side33/mx)*Props.ratio
  const outerRadius = (outerRadius1/mx)*Props.ratio
  const comy = parseFloat((((((((44/7)*(outerRadius - (thickness/2))) + 2*(side2 - 2*outerRadius) + 2*(side3 - 2*outerRadius)))*(side2/2) - (side3 - 2*side1)*(thickness/2))/(((44/7)*(outerRadius - (thickness/2))) + 2*(side2 - 2*outerRadius) + 2*(side3 - 2*outerRadius) -(side3-2*side1)))).toFixed(2));

  React.useEffect(() => {
    sendValuey((comy/100)*mx);
  }, [sendValuey]);


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
    setViewBox(`${Props.x1} ${Props.y1} ${Props.x2} ${Props.y2}`);
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
            <input title={Props.title1} className="form-check-input" onClick={clickOndimensioning} type="checkbox" role="switch" id="flexSwitchCheckDefault" style={{color: '#1b065c', transform: 'translateY(0px) translateX(4px)'}}/>
            <label className="form-check-label" htmlFor="flexSwitchCheckDefault">DIMENSIONING FUNCTION</label>
          </div>
      <svg
        viewBox={viewBox}
        style={{ width: '100%', height: '61vh', backgroundColor: '#f9f9f9', border: '1px solid #ccc' }}
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

        
        {/* Top hat Shape */}
        <rect x={50 + (100 - (2*side1 + side3 -2*thickness))/2} y={100 - comy} width={side1-outerRadius} height={thickness} fill="black" />
        <rect x={50  + side1 - thickness + (100 - (2*side1 + side3 -2*thickness))/2} y={100 - comy + outerRadius} width={thickness} height={side2-2*outerRadius} fill="black" />
        <rect x={50 + side1 + outerRadius-thickness + (100 - (2*side1 + side3 -2*thickness))/2} y={side2 - thickness + 100 - comy} width={side3-2*outerRadius} height={thickness} fill="black" />
        <rect x={50 + side1 + side3-2*thickness + (100 - (2*side1 + side3 -2*thickness))/2} y={100 - comy + outerRadius} width={thickness} height={side2-2*outerRadius} fill="black" />
        <rect x={50 +side1 + side3 -2*thickness + outerRadius + (100 - (2*side1 + side3 -2*thickness))/2} y={100 - comy} width={side1-outerRadius} height={thickness} fill="black" />

        {/* outer radius */}
        <CircleSector radius={outerRadius} centerX={50 + side1 + outerRadius-thickness + (100 - (2*side1 + side3 -2*thickness))/2} centerY={100 - comy + side2 - outerRadius} angle={90} rotation={90} thickness={thickness}/>

        <CircleSector radius={outerRadius} centerX={50 + side1 -outerRadius + (100 - (2*side1 + side3 -2*thickness))/2} centerY={100 - comy + outerRadius} angle={90} rotation={270} thickness={thickness}/>

        <CircleSector radius={outerRadius} centerX={50  + side1 + side3 + outerRadius-2*thickness + (100 - (2*side1 + side3 -2*thickness))/2} centerY={100 - comy + outerRadius} angle={90} rotation={180} thickness={thickness}/>

        <CircleSector radius={outerRadius} centerX={50 + side1 + side3 -outerRadius-thickness + (100 - (2*side1 + side3 -2*thickness))/2} centerY={100 - comy + side2 - outerRadius} angle={90} rotation={0} thickness={thickness}/>
       

         {/* Horizontal Arrow for B */}
         <Linex x1={50 + side1 - thickness + (100 - (2*side1 + side3 -2*thickness))/2} x2={50 + side1 + side3 -thickness + (100 - (2*side1 + side3 -2*thickness))/2} y1={side2 + 100 - comy + 5} y2={side2 + 100 - comy + 5} text={'w'} val={side33} textHeight={5}/>

        {/* Vertical Arrow for Height */}
        <Liney x1={45 + (100 - (2*side1 + side3 -2*thickness))/2} x2={45 + (100 - (2*side1 + side3 -2*thickness))/2} y1={100 - comy} y2={100 - comy + side2} text={'h'} val={side22} textHeight={-17}/>

        {/* Vertical Arrow for thickness */}
        <Liney x1={55 + side1 + (100 - (2*side1 + side3 -2*thickness))/2} x2={55 + side1 + (100 - (2*side1 + side3 -2*thickness))/2} y1={100 - comy} y2={100 - comy + thickness} text={'t'} val={thickness1} textHeight={15}/>

        {/* Horizontal Arrow for side1 */}
        <Linex x1={50 + (100 - (2*side1 + side3 -2*thickness))/2} x2={50+ side1 + (100 - (2*side1 + side3 -2*thickness))/2} y1={100 - comy-5} y2={100 - comy-5} text={'l'} val={side11} textHeight={-5}/>

      </svg>
      <button title={Props.title3} className='btn btn mx-2 my-2' onClick={zoomIn} style={{color: 'white', backgroundColor: '#1b065c'}}><i className="fa-solid fa-magnifying-glass-plus"></i></button>
      <button title={Props.title6} className='btn btn mx-2 my-2' onClick={resetZoom} style={{color: 'white', backgroundColor: '#1b065c'}}><i className="fa-solid fa-maximize"></i> </button>
      <button title={Props.title4} className='btn btn mx-2 my-2' onClick={zoomOut} style={{color: 'white', backgroundColor: '#1b065c'}}> <i className="fa-solid fa-magnifying-glass-minus"></i> </button>
    </div>
  );
}

export default Top_hat_graph;
