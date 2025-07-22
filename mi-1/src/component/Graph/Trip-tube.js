import React, { useState, useCallback, useEffect } from 'react';
import CircleSector from './Shap/Circle';
import * as Props from '../constant';
import Linex from './Shap/Linex';
import Liney from './Shap/Liney';
import LineAtTheta from './Shap/LineAtθ';
import Linez from './Shap/Linez';

function Trip_tube_graph({ side11, side22, side33, side44, side55, thickness1, outerRadius11, outerRadius22, outerRadius33, outerRadius44, angle1, angle2, angle3, sendValuey}) {
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
        <rect x={50 + side1 - side3 + outerRadius2} y={150 - thickness} width={side3 - outerRadius1 - outerRadius2} height={thickness} fill="black" />
        <rect x={50 + side1 - side3} y={150 - outerRadius2 - l2} width={thickness} height={l2} fill="black" />
        <rect x={50 + side1 - thickness} y={150 - side4 + outerRadius2/Math.tan(aa*angle4/2)} width={thickness} height={side4 - outerRadius1 - outerRadius2/Math.tan(aa*angle4/2)} fill="black" />
        <rect x={50} y={150 - side2 + outerRadius1} width={thickness} height={side5 - outerRadius1 - outerRadius3/Math.tan(aa*angle1/2)} fill="black" />
       
       
        <LineAtTheta x={50 + outerRadius3 + (outerRadius3 - thickness)*Math.cos(aa*angle1)} y = {150 - side2 + side5 - outerRadius3/Math.tan(aa*angle1/2) + (outerRadius3 - thickness)*Math.sin(aa*angle1)} w={l1} h={thickness} angle={angle1 - 90}/>

        <LineAtTheta x={50 + side1 - outerRadius2 - (outerRadius2 - thickness)*Math.cos(aa*angle4)} y = {150 - side4 + outerRadius2/Math.tan(aa*angle4/2) - (outerRadius2 - thickness)*Math.sin(aa*angle4)} w={l3} h={thickness} angle={angle4 + 90}/>

        <LineAtTheta x={50 + outerRadius1 + outerRadius1*Math.cos(aa*angle2)} y = {150 - side2 + outerRadius1 - outerRadius1*Math.sin(aa*angle2)} w={l4} h={thickness} angle={90 - angle2}/>
        

        {/* outer radius */}
        <CircleSector radius={outerRadius2} centerX={50 + side1 - side3 + outerRadius2} centerY={150 - outerRadius2} angle={90} rotation={90} thickness={thickness}/>
        <CircleSector radius={outerRadius1} centerX={50 + side1 - outerRadius1} centerY={150 - outerRadius1} angle={90} rotation={0} thickness={thickness}/>
        <CircleSector radius={outerRadius4} centerX={50 + side1 - side3 + thickness - outerRadius4} centerY={150 - outerRadius2 - l2} angle={180 - angle1} rotation={angle1 - 180} thickness={thickness}/>
        <CircleSector radius={outerRadius2} centerX={50 + side1 - outerRadius2} centerY={150 - side4 + outerRadius2/Math.tan(aa*angle4/2)} angle={180 - angle4} rotation={angle4 - 180} thickness={thickness}/>
       <CircleSector radius={outerRadius1} centerX={50 + outerRadius1} centerY={150 - side2 + outerRadius1} angle={180 - angle2} rotation={180} thickness={thickness}/>
       <CircleSector radius={outerRadius3} centerX={50 + outerRadius3} centerY={150 - side2 + side5 - outerRadius3/Math.tan(aa*angle1/2)} angle={180 - angle1} rotation={angle1} thickness={thickness}/>
       <CircleSector radius={outerRadius2} centerX={x} centerY={y} angle={180 - angle3} rotation={angle3 + angle4 - 360} thickness={thickness}/>
       

        {/* Horizontal Arrow for A */}
        <Linex x1={50} x2={50 + side1} y1={45} y2={45} text={'A'} val={side11} textHeight={-5}/>

        {/* Vertical Arrow for B */}
        <Liney x1={10} x2={10} y1={150 - side2} y2={150} text={'B'} val={side22} textHeight={17}/>

        {/* Vertical Arrow for E */}
        <Liney x1={45} x2={45} y1={150 - side2} y2={150 - side2 + side5} text={'E'} val={side55} textHeight={-17}/>

         {/* Vertical Arrow for D */}
        <Liney x1={55 + side1} x2={55 + side1} y1={150 - side4} y2={150} text={'D'} val={side44} textHeight={17}/>

        {/* Vertical Arrow for C */}
        <Linex x1={50 + side1 - side3} x2={50 + side1} y1={155} y2={155} text={'C'} val={side33} textHeight={5}/>

        {/* Vertical Arrow for r1 */}
        <Liney x1={55 + side1} x2={55 + side1} y1={155} y2={155} text={'R1'} val={outerRadius11} textHeight={17}/>

        {/* Vertical Arrow for r1 */}
        <Liney x1={45} x2={45} y1={145 - side2} y2={145 - side2} text={'R1'} val={outerRadius11} textHeight={-17}/>

        {/* Vertical Arrow for r2 */}
        <Liney x1={55 + side1} x2={55 + side1} y1={145 - side4} y2={145 - side4} text={'R2'} val={outerRadius22} textHeight={17}/>

        {/* Vertical Arrow for r2 */}
        <Liney x1={55 + l4 + outerRadius1 + outerRadius2} x2={55 + l4 + outerRadius1 + outerRadius2} y1={150 - side4 - l3} y2={150 - side4 - l3} text={'R2'} val={outerRadius22} textHeight={17}/>

        {/* Vertical Arrow for r2 */}
        <Liney x1={45 + side1 - side3} x2={45 + side1 - side3} y1={145} y2={145} text={'R2'} val={outerRadius22} textHeight={-17}/>

        {/* Vertical Arrow for r3 */}
        <Liney x1={45} x2={45 } y1={155 - side2 + side5} y2={155 - side2 + side5} text={'R3'} val={outerRadius33} textHeight={-17}/>

         {/* Vertical Arrow for r4 */}
        <Liney x1={45 + side1 - side3} x2={45 + side1 - side3} y1={150 - l2} y2={150 - l2} text={'R4'} val={outerRadius44} textHeight={-17}/>

        {/* Vertical Arrow for angle1 */}
        <Linex x1={60 + thickness} x2={60 + thickness} y1={145 - side2 + side5} y2={145 - side2 + side5} text={'θ1'} val={angle1} textHeight={-5} unit={" "}/>

        {/* Vertical Arrow for r1 */}
        <Linex x1={60 + thickness} x2={60 + thickness} y1={155 - side2 + outerRadius1} y2={155 - side2 + outerRadius1} text={'θ2'} val={angle2} textHeight={5} unit={" "}/>

        {/* Vertical Arrow for r1 */}
        <Linex x1={40 + l4 + outerRadius1 + outerRadius2} x2={40 + l4 + outerRadius1 + outerRadius2} y1={155 - side4 - l3} y2={155 - side4 - l3} text={'θ3'} val={angle3} textHeight={5} unit={" "}/>

      </svg>
      <button title={Props.title3} className='btn btn mx-2 my-2' onClick={zoomIn} style={{color: 'white', backgroundColor: '#1b065c'}}><i className="fa-solid fa-magnifying-glass-plus"></i></button>
      <button title={Props.title6} className='btn btn mx-2 my-2' onClick={resetZoom} style={{color: 'white', backgroundColor: '#1b065c'}}><i className="fa-solid fa-maximize"></i> </button>
      <button title={Props.title4} className='btn btn mx-2 my-2' onClick={zoomOut} style={{color: 'white', backgroundColor: '#1b065c'}}> <i className="fa-solid fa-magnifying-glass-minus"></i> </button>
    </div>
  );
}

export default Trip_tube_graph;
