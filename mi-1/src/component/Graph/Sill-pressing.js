import React, { useState, useCallback, useEffect } from 'react';
import CircleSector from './Shap/Circle';
import * as Props from '../constant';
import Linex from './Shap/Linex';
import Liney from './Shap/Liney';
import LineAtTheta from './Shap/LineAtθ';

function Sill_pressing_graph({ side11, side22, side33, side44, side55, angle11, angle22, angle33, thickness1, outerRadius1}) {
  const mx = Math.max(side11,side22 + side55);
  const thickness = (thickness1/mx)*Props.ratio
  const side1 = (side11/mx)*Props.ratio
  const side2 = (side22/mx)*Props.ratio
  const side3 = (side33/mx)*Props.ratio
  const side4 = (side44/mx)*Props.ratio
  const side5 = (side55/mx)*Props.ratio
  const angle1 = angle11
  const angle2 = angle22
  const angle3 = angle33
  const outerRadius = (outerRadius1/mx)*Props.ratio
  const aa = Math.PI/180;


  const l1 = (side2 + thickness - 2*outerRadius + (2*outerRadius - thickness)*Math.cos(aa*angle1))/(Math.sin(aa*angle1))
  const l2 = (side2 + thickness - 2*outerRadius - (2*outerRadius - thickness)*Math.cos(aa*angle2))/(Math.sin(aa*angle2))
  const l3 = (side5 - outerRadius - outerRadius*Math.cos(angle3*aa))/Math.sin(aa*angle3)

  const x1 = 50  + side3 - outerRadius*Math.tan(aa*angle1/2);

  const x2 = x1 + outerRadius*Math.sin(aa*angle1) + l1*Math.cos(aa*angle1) + (outerRadius - thickness)*Math.sin(aa*angle1)
  
  const x3 = x2 + side4 - outerRadius*(Math.tan(aa*angle1/2) + 1/Math.tan(aa*angle2/2))

  const x4 = x3 + (2*outerRadius - thickness)*Math.sin(aa*angle2) - l2*Math.cos(aa*angle2)

  const x5 = 50 + side1 - outerRadius*Math.tan(aa*(90 - angle3/2))

  const [viewBox, setViewBox] = useState(Props.title7);
  const [isDragging, setIsDragging] = useState(false);
  const [startCoords, setStartCoords] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const arrowSize = 2; // Arrowhead size relative to the shape
  const textOffset = 1; // Distance between the arrow and text

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
            <input title={Props.title1} className="form-check-input" onClick={clickOndimensioning} type="checkbox" role="switch" id="flexSwitchCheckDefault" style={{color: '#1b065c', transform: 'translateY(0px) translateX(4px)'}}/>
            <label className="form-check-label" htmlFor="flexSwitchCheckDefault">DIMENSIONING FUNCTION</label>
          </div>
      <svg
        viewBox={viewBox}
        style={{ width: '100%', height: '61vh', backgroundColor: '#f9f9f9', border: '1px solid #ccc' }}
        onMouseDown={handleMouseDown} onClick={handleSVGClick}
        onTouchStart={handleTouchStart}
      >
        {points.map((point, index) => (
              <circle key={index} cx={point.x} cy={point.y} r={2} fill={index === 0 ? "blue" : "red"} />
            ))}

            {points.length === 2 && (<line x1={points[0].x} y1={points[0].y} x2={points[1].x} y2={points[1].y} stroke="black"/>)}

            {points.length === 2 && <text  x={(points[0].x + points[1].x)/2 + 3} y={(points[0].y + points[1].y)/2 - 3} fontSize="5"> {(distance*mx/100).toFixed(3)} mm</text>}
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



        {/* rectangle Shape */}
        <rect x={50} y={150 - side2 - thickness} width={side3 - outerRadius*Math.tan(aa*angle1/2)} height={thickness} fill="black" />

        <LineAtTheta x={50  + side3 - outerRadius*Math.tan(aa*angle1/2) + outerRadius*Math.sin(aa*angle1)} y={150 - side2 - thickness + outerRadius - outerRadius*Math.cos(aa*angle1)} w={l1} h={thickness} angle={angle1} fill="black" />

        <rect x={x2} y={150 - thickness} width={side4 - outerRadius*(Math.tan(aa*angle1/2) + 1/Math.tan(aa*angle2/2))} height={thickness} fill="black" />

        <LineAtTheta x={x4 - (outerRadius - thickness)*Math.sin(aa*angle2)} y={150 - side2 - thickness + outerRadius + (outerRadius - thickness)*Math.cos(aa*angle2)} w={l2} h={thickness} angle={angle2} fill="black" />

        <rect x={x4} y={150 - side2 - thickness} width={x5 - x4} height={thickness} fill="black" />

        <LineAtTheta x={x5 + (outerRadius - thickness)*Math.sin(aa*angle3)} y={150 - side2 - outerRadius - (outerRadius - thickness)*Math.cos(aa*angle3)} w={l3} h={thickness} angle={angle3 + 180} fill="black" />
        
        {/* outer radius */}
        <CircleSector radius={outerRadius} centerX={x1} centerY={150 - side2 + outerRadius - thickness} angle={angle1} rotation={270} thickness={thickness}/>

        <CircleSector radius={outerRadius} centerX={x2} centerY={150 - outerRadius} angle={angle1} rotation={90} thickness={thickness}/>

        <CircleSector radius={outerRadius} centerX={x3} centerY={150 - outerRadius} angle={180 - angle2} rotation={angle2 - 90} thickness={thickness}/>

        <CircleSector radius={outerRadius} centerX={x4} centerY={150 - side2 + outerRadius - thickness} angle={180 - angle2} rotation={angle2 + 90} thickness={thickness}/>

        <CircleSector radius={outerRadius} centerX={x5} centerY={150 - side2 - outerRadius} angle={180 - angle3} rotation={angle3 - 90} thickness={thickness}/>


         {/* Horizontal Arrow for side1 */}
         <Linex x1={50} x2={50 + side1} y1={165} y2={165} text={'A'} val={side11} textHeight={5}/>

        {/* Horizontal Arrow for side2 */}
        <Linex x1={x2 - outerRadius*(Math.tan(aa*angle1/2))} x2={x3 + outerRadius*(1/Math.tan(aa*angle1/2))} y1={155} y2={155} text={'D'} val={side22} textHeight={5}/>

        {/* Vertical Arrow for side2 */}
        <Liney x1={45} x2={45} y1={150 - side2} y2={150} text={'B'} val={side22} textHeight={-17}/>

        {/* Vertical Arrow for side3 */}
        <Linex x1={50} x2={50 + side3} y1={145 - side2 - thickness} y2={145 - side2 - thickness} text={'C'} val={side33} textHeight={-5}/>

        {/* Horizontal Arrow for side5 */}
        <Liney x1={55 + side1} x2={55 + side1} y1={150 - side2 - side5} y2={150 - side2} text={'E'} val={side55} textHeight={17}/>
        
      
       
      </svg>
      <button title={Props.title3} className='btn btn mx-2 my-2' onClick={zoomIn} style={{color: 'white', backgroundColor: '#1b065c'}}><i className="fa-solid fa-magnifying-glass-plus"></i></button>
      <button title={Props.title6} className='btn btn mx-2 my-2' onClick={resetZoom} style={{color: 'white', backgroundColor: '#1b065c'}}><i className="fa-solid fa-maximize"></i> </button>
      <button title={Props.title4} className='btn btn mx-2 my-2' onClick={zoomOut} style={{color: 'white', backgroundColor: '#1b065c'}}> <i className="fa-solid fa-magnifying-glass-minus"></i> </button>
    </div>
  );
}

export default Sill_pressing_graph;
