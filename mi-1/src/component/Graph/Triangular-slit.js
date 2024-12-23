import React, { useState, useCallback, useEffect } from 'react';
import CircleSector from './Shap/Circle';
import Linex from './Shap/Linex';
import Linez from './Shap/Linez';

function Triangular_slit_graph({side11, side22, thickness1, outerRadius1, sendValuey}){
  const mx = Math.max(side11,side11);
  const thickness = (thickness1/mx)*100;
  const side1 = (side11/mx)*100;
  const side2 = (side22/mx)*100;
  const outerRadius = (outerRadius1/mx)*100;

  const comy = parseFloat(((2*(side2 - outerRadius)*Math.pow(thickness,2)/2 + 2*(side1 - 2*outerRadius)*thickness*(outerRadius + (outerRadius - thickness)/2 + (side1 - 2*outerRadius)*Math.sqrt(3)/4)  + Math.PI*(Math.pow(outerRadius,2) - Math.pow(outerRadius - thickness,2))*(outerRadius + (side1 - 2*outerRadius)*Math.sqrt(3)/6))/(thickness*(side1 - 2*outerRadius)*3  +  Math.PI*(Math.pow(outerRadius,2) - Math.pow(outerRadius - thickness,2)))).toFixed(2))


  const [viewBox, setViewBox] = useState('0 0 200 200');
  const [isDragging, setIsDragging] = useState(false);
  const [startCoords, setStartCoords] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);

  const svgWidth = 200;
  const svgHeight = 200;

  React.useEffect(() => {
    sendValuey((comy/100)*mx);
  }, [sendValuey]);

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
          Define grid pattern
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

   
       
        <rect x={50 + outerRadius} y={100-comy} width={side2- outerRadius} height={thickness} fill="black" />
        <rect x={50 + outerRadius + side1-2*outerRadius - side2 + outerRadius} y={100-comy} width={side2 - outerRadius} height={thickness} fill="black" />
        <rect
        x={50 + outerRadius - (outerRadius-thickness)*((Math.sqrt(3))/2)}
        y={100-comy + outerRadius + (outerRadius-thickness)*(1/2)}
        width={side1 - 2*outerRadius}
        height={thickness}
        fill="black"
        transform={`rotate(${60}, ${50 + outerRadius - (outerRadius-thickness)*((Math.sqrt(3))/2)}, ${100-comy + outerRadius + (outerRadius-thickness)*(1/2)})`} // Rotate around (rotateX, rotateY)
        />
        <rect
        x={50 + outerRadius + (side1 - 2*outerRadius) + outerRadius*(2/(Math.sqrt(2.4)))}
        y={100-comy + outerRadius + outerRadius*(1/1.34)}
        width={side1 - 2*outerRadius}
        height={thickness}
        fill="black"
        transform={`rotate(${120}, ${50 + outerRadius + (side1 - 2*outerRadius) + outerRadius*(2/(Math.sqrt(3)))}, ${100-comy + outerRadius + outerRadius*(1/2)})`} // Rotate around (rotateX, rotateY)
        />

        <CircleSector radius={outerRadius} centerX={50 + outerRadius} centerY={100-comy + outerRadius} angle={120} rotation={150} thickness={thickness}/>
        <CircleSector radius={outerRadius} centerX={50 + side1 - outerRadius} centerY={100-comy + outerRadius} angle={120} rotation={270} thickness={thickness}/>
        <CircleSector radius={outerRadius} centerX={50 + outerRadius + (side1 - 2*outerRadius)/2} centerY={100-comy + side1*(Math.sqrt(3)/2) -  0.76*outerRadius} angle={120} rotation={30} thickness = {thickness}/>
      

         {/* Horizontal Arrow for width */}
         <Linex  x1={50} x2={side1 + 50} y1={100-comy-15} y2={100-comy-15} text={'A'} val={side11} textHeight={-5}/>

         {/* Horizontal Arrow for lip */}
         <Linex  x1={50} x2={side2 + 50} y1={100-comy-5} y2={100-comy-5} text={'l'} val={side22} textHeight={-5}/>
       
         {/* Horizontal Arrow for thickness */}
         <Linez x1 = {side1 + 50 - outerRadius+thickness} y1={100-comy + outerRadius} thickness={thickness} text={'t'} val={thickness1} textHeight={side1}/>

        

      </svg>
      <button className='mx-2 my-2' onClick={zoomIn}><i className="fa-solid fa-magnifying-glass-plus"></i></button>
      <button className='mx-2 my-2' onClick={resetZoom}><i className="fa-solid fa-maximize"></i> </button>
      <button className='mx-2 my-2' onClick={zoomOut}> <i className="fa-solid fa-magnifying-glass-minus"></i> </button>
    </div>
  );
}

export default Triangular_slit_graph;

