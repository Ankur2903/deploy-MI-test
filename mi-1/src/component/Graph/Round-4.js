import React, { useState, useCallback, useEffect } from 'react';
import Linex from './Shap/Linex';
import Linez from './Shap/Linez';
import CircleSector from './Shap/Circle';
import * as Props from '../constant';
import { asin } from 'three/webgpu';
import Liney from './Shap/Liney';

function Round_graph_4({side1, radius1, thickness1, outerRadius1 }) {
const mx = 2*radius1;
  const radius = 50;
  const thickness = (thickness1 / (2 * radius1)) * Props.ratio
  const outerRadius = (outerRadius1*Props.ratio)/mx;
  const side = (side1*Props.ratio)/mx;
  const aa = 180/Math.PI
  const angle2 = Math.PI/2 - Math.asin((side - radius - outerRadius)/(radius - outerRadius))
  const angle1 = 2*Math.PI - 2*angle2;

  const [viewBox, setViewBox] = useState(Props.title7);
  const [isDragging, setIsDragging] = useState(false);
  const [startCoords, setStartCoords] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);

  const svgWidth = 200 * (radius / 50);
  const svgHeight = 200 * (radius / 50);

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
        <input title={Props.title1} className="form-check-input" onClick={clickOndimensioning}  type="checkbox" role="switch" id="flexSwitchCheckDefault" style={{color: '#1b065c', transform: 'translateY(0px) translateX(4px)'}}/>
        <label className="form-check-label" htmlFor="flexSwitchCheckDefault" >DIMENSIONING FUNCTION</label>
      </div>
      <svg viewBox={viewBox} style={{ width: '100%', height: '61vh', backgroundColor: '#f9f9f9', border: '1px solid #ccc' }} onMouseDown={handleMouseDown} onTouchStart={handleTouchStart} onClick={handleSVGClick}>
        {points.map((point, index) => (
          <circle key={index} cx={point.x} cy={point.y} r={2} fill={index === 0 ? "blue" : "red"} />))}
        {points.length === 2 && (<line x1={points[0].x} y1={points[0].y} x2={points[1].x} y2={points[1].y} stroke="black"/>)}
        {points.length === 2 && <text  x={(points[0].x + points[1].x)/2 + 3} y={(points[0].y + points[1].y)/2 - 3} fontSize="5"> {(distance*mx/100).toFixed(3)} mm</text>}
        <defs>{/* Define grid pattern */}
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="gray" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect x='-1000' y='-1000' width="2000" height="2000" fill="url(#grid)"/>
        {/* Draw X and Y axes */}
        <line x1="-1000" y1={50 + radius} x2={svgWidth + 1000} y2={50 + radius} stroke="gray" strokeWidth="1" />
        <line x1={50 + radius} y1="-1000" x2={50 + radius} y2={svgHeight + 1000} stroke="gray" strokeWidth="1" />

        <CircleSector radius={radius} centerX={100} centerY={100} angle={angle1*aa} rotation={angle2*aa - 90} thickness={thickness}/>
        <CircleSector radius={outerRadius} centerX={100 + (radius - outerRadius)*Math.sin(angle2)} centerY={100 - (radius - outerRadius)*Math.cos(angle2)} angle={angle2*aa} rotation={-90} thickness={thickness}/>
        <CircleSector radius={outerRadius} centerX={100 - (radius - outerRadius)*Math.sin(angle2)} centerY={100 - (radius - outerRadius)*Math.cos(angle2)} angle={angle2*aa} rotation={-90 - aa*angle2} thickness={thickness}/>

        <rect x={100 - (radius - outerRadius)*Math.sin(angle2)} y={100 - (radius - outerRadius)*Math.cos(angle2) - outerRadius} width={2*((radius - outerRadius)*Math.sin(angle2))} height={thickness} fill="black" />

         {/* Horizontal Arrow for side1 */}
         <Linex x1={50} x2={150} y1={160} y2={160} text={'D'} val={2*radius} textHeight={10}/>

        {/* Vertical Arrow for side2 */}
        <Liney x1={160} x2={160} y1={100 - (radius - outerRadius)*Math.cos(angle2) - outerRadius} y2={150} text={'A'} val={side1} textHeight={17}/>

      </svg>
      <button title={Props.title3} className='btn btn mx-2 my-2' onClick={zoomIn} style={{color: 'white', backgroundColor: '#1b065c'}}><i className="fa-solid fa-magnifying-glass-plus"></i></button>
      <button title={Props.title6} className='btn btn mx-2 my-2' onClick={resetZoom} style={{color: 'white', backgroundColor: '#1b065c'}}><i className="fa-solid fa-maximize"></i> </button>
      <button title={Props.title4} className='btn btn mx-2 my-2' onClick={zoomOut} style={{color: 'white', backgroundColor: '#1b065c'}}> <i className="fa-solid fa-magnifying-glass-minus"></i> </button>
    </div>
  );
}

export default Round_graph_4;
