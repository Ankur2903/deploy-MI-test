import React, { useState, useCallback, useEffect } from 'react';
import CircleSector from './Shap/Circle';
import Linex from './Shap/Linex';
import Liney from './Shap/Liney';

function Door_channel_graph({ side11, side22, side33, side44, lip11, thickness1, outerRadius1, sendValuex, sendValuey}) {
  const mx = Math.max(side22,(side11 + side33));
  const thickness = (thickness1/mx)*100;
  const side1 = (side11/mx)*100;
  const side2 = (side22/mx)*100;
  const side3 = (side33/mx)*100;
  const side4 = (side44/mx)*100;
  const lip = (lip11/mx)*100;
  const outerRadius = (outerRadius1/mx)*100;
  const comx = parseFloat((((2*Math.PI*(outerRadius-thickness/2))*((side1 + side3)/2) + (side2 - 2*outerRadius)*(thickness/2) + (side1-2*outerRadius)*(side1/2) + (side2-side4 - 2*outerRadius  + thickness)*(side1 -thickness/2) + (Math.PI*(outerRadius - thickness/2))*(side1 - thickness/2) + (side3-2*outerRadius+ thickness)*(side1 + (side3-2*outerRadius + thickness)/2) + (side4 - 2*outerRadius)*(side1+ side3-thickness/2) + (lip-outerRadius)*((lip+outerRadius)/2) + (lip-outerRadius)*(side1 + side3 - outerRadius - (lip-outerRadius)/2))/(((66/7)*(outerRadius-(thickness/2))) + (side2-2*outerRadius) + (side1 - 2*outerRadius) + (side3-2*outerRadius + thickness) + (side2-4*outerRadius+thickness) +  2*(lip - outerRadius))).toFixed(2))

  const  comy = parseFloat(((2*(lip-outerRadius)*(thickness/2) + (side4 - 2*outerRadius)*(side4/2) + (Math.PI*(outerRadius-thickness/2))*(side4 - thickness/2) + (side3 - 2*outerRadius + thickness)*(side4 - thickness/2) + (side2 - side4 - 2*outerRadius + thickness)*(side4 + outerRadius - thickness + (side2 - side4 -2*outerRadius + thickness)/2) + (side2-2*outerRadius)*(side2/2) + (side1 - 2*outerRadius)*(side2 - thickness/2))/(((66/7)*(outerRadius-(thickness/2))) + (side2-2*outerRadius) + (side1 - 2*outerRadius) + (side3-2*outerRadius + thickness) + (side2-4*outerRadius+thickness) +  2*(lip - outerRadius))).toFixed(2))

  React.useEffect(() => {
    sendValuex((comx/100)*mx);
  }, [sendValuex]);

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
            <label className="form-check-label" for="flexSwitchCheckDefault">DIMENSIONING FUNCTION</label>
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
        <rect x={100 - comx} y={100 - comy + outerRadius} width={thickness} height={side2-2*outerRadius} fill="black" />
        <rect x={100 - comx + side1 + side3 - thickness} y={100 - comy + outerRadius} width={thickness} height={side4-2*outerRadius} fill="black" />
        <rect x={100 - comx+outerRadius} y={side2 - thickness + 100 - comy} width={side1-2*outerRadius} height={thickness} fill="black" />
        <rect x={100 - comx + side1 + outerRadius-thickness} y={100 - comy + side4 - thickness} width={side3-2*outerRadius + thickness} height={thickness} fill="black" />
        <rect x={100 - comx + side1  - thickness} y={100 - comy + side4 + outerRadius - thickness} width={thickness} height={side2 - side4 - 2*outerRadius + thickness} fill="black" />
        <rect x={100 - comx+outerRadius} y={100 - comy} width={lip-outerRadius} height={thickness} fill="black" />
        <rect x={100 - comx+side1 + side3-lip} y={100 - comy} width={lip-outerRadius} height={thickness} fill="black" />
        {/* outer radius */}
        <CircleSector radius={outerRadius} centerX={100 - comx + outerRadius} centerY={100 - comy + side2 - outerRadius} angle={90} rotation={90} thickness={thickness}/>

        <CircleSector radius={outerRadius} centerX={100 - comx + outerRadius + side1 - thickness} centerY={100 - comy + outerRadius + side4 - thickness} angle={90} rotation={180} thickness={thickness}/>

        <CircleSector radius={outerRadius} centerX={100 - comx + outerRadius} centerY={100 - comy + outerRadius} angle={90} rotation={180} thickness={thickness}/>

        
        <CircleSector radius={outerRadius} centerX={100 - comx + side1 + side3 - outerRadius} centerY={100 - comy + outerRadius} angle={90} rotation={270} thickness={thickness}/>

        <CircleSector radius={outerRadius} centerX={100 - comx + side1 - outerRadius} centerY={100 - comy + side2 - outerRadius} angle={90} rotation={0} thickness={thickness}/>

        <CircleSector radius={outerRadius} centerX={100 - comx + side1 + side3 - outerRadius} centerY={100 - comy + side4 - outerRadius} angle={90} rotation={0} thickness={thickness}/>

        {/* Horizontal Arrow for Lip */}
        <Linex x1={100 - comx + side1 - lip + side3} x2={100 - comx + side1 + side3} y1={100 - comy - 5} y2={100 - comy - 5} text={'l'} val={lip11} textHeight={-5}/>

        {/* Horizontal Arrow for side3 */}
        <Linex x1={100 - comx + side1} x2={100 - comx + side1 + side3} y1={100 - comy + 5 + side2} y2={100 - comy + 5 + side2} text={'C'} val={side33} textHeight={5}/>


         {/* Horizontal Arrow for width */}
         <Linex x1={100 - comx} x2={side1 + 100 - comx} y1={side2 + 100 - comy + 5} y2={side2 + 100 - comy + 5} text={'B'} val={side11} textHeight={5}/>


        {/* Vertical Arrow for A */}
        <Liney x1={100 - comx -5} x2={100 - comx-5} y1={100 - comy} y2={100 - comy + side2} text={'A'} val={side22} textHeight={-17}/>

        {/* Vertical Arrow for D */}
        <Liney x1={100 - comx + 5 + side1 + side3} x2={100 - comx + 5 + side1 + side3} y1={100 - comy} y2={100 - comy + side4} text={'D'} val={side44} textHeight={17}/>

        {/* Horizontal Arrow for Thickness */}
        <Linex x1={100 - comx} x2={thickness + 100 - comx} y1={100 - comy - 5} y2={100 - comy - 5} text={'t'} val={thickness1} textHeight={-5}/>
      
      </svg>
      <button className='mx-2 my-2' onClick={zoomIn}><i className="fa-solid fa-magnifying-glass-plus"></i></button>
      <button className='mx-2 my-2' onClick={resetZoom}><i className="fa-solid fa-maximize"></i> </button>
      <button className='mx-2 my-2' onClick={zoomOut}> <i className="fa-solid fa-magnifying-glass-minus"></i> </button>
    </div>
  );
}

export default Door_channel_graph;