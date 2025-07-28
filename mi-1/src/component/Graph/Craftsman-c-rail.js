import { useState, useCallback, useEffect } from 'react';
import CircleSector from './Shap/Circle';
import * as Props from '../constant';
import Linex from './Shap/Linex';
import Liney from './Shap/Liney';
import LineAtTheta from './Shap/LineAtθ';
import Linez from './Shap/Linez';

function Craftsman_c_rail_graph({ side11, side22, side33, side44, side55, side66, side77, angle1, thickness1, outerRadius1}) {
  const aa = Math.PI/180;
  const angle2 = (180/Math.PI)*Math.acos((2*outerRadius1 - side33)/(2*outerRadius1 - thickness1))
  const l1 = (side55 - 2*outerRadius1 - (2*outerRadius1 - thickness1)*Math.cos(aa*angle1))/Math.sin(aa*angle1)
  const mx = Math.max(side11,(side22 + 2*(2*outerRadius1 - thickness1)*Math.sin(aa*angle2) - 2*outerRadius1*Math.tan(aa*angle2/2) + side44 + (2*outerRadius1 - thickness1)*Math.sin(aa*angle1) - l1*Math.cos(aa*angle1) - 2*outerRadius1/Math.tan(aa*angle1/2) + side66));
  const thickness = (thickness1/mx)*Props.ratio
  const side1 = (side11/mx)*Props.ratio
  const side2 = (side22/mx)*Props.ratio
  const side3 = (side33/mx)*Props.ratio
  const side4 = (side44/mx)*Props.ratio
  const side5 = (side55/mx)*Props.ratio
  const side6 = (side66/mx)*Props.ratio
  const side7 = (side77/mx)*Props.ratio
  const l = l1*Props.ratio/mx
  const outerRadius = (outerRadius1/mx)*Props.ratio

  const h = side2 + 2*(2*outerRadius - thickness)*Math.sin(aa*angle2) - 2*outerRadius*Math.tan(aa*angle2/2) + side4 + (2*outerRadius - thickness)*Math.sin(aa*angle1) - l*Math.cos(aa*angle1) - 2*outerRadius/Math.tan(aa*angle1/2) + side6

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
        <rect x={100 - side1/2 + outerRadius} y={150 - thickness} width={side1 - 2*outerRadius} height={thickness} fill="black" />
        <rect x={100 - side1/2} y={150 - side2 + outerRadius*Math.tan(aa*angle2/2)} width={thickness} height={side2 - outerRadius*(1 + Math.tan(aa*angle2/2))} fill="black" />
        <rect x={100 + side1/2 - thickness} y={150 - side2 + outerRadius*Math.tan(aa*angle2/2)} width={thickness} height={side2 - outerRadius*(1 + Math.tan(aa*angle2/2))} fill="black" />
        <rect x={100 + side1/2 - thickness} y={150 - side2 + outerRadius*Math.tan(aa*angle2/2) - 2*(2*outerRadius - thickness)*Math.sin(aa*angle2) - side4 + outerRadius*(Math.tan(aa*angle2/2) + 1/Math.tan(aa*angle1/2))} width={thickness} height={side4 - outerRadius*(Math.tan(aa*angle2/2) + 1/Math.tan(aa*angle1/2))} fill="black" />
        <rect x={100 - side1/2} y={150 - side2 + outerRadius*Math.tan(aa*angle2/2) - 2*(2*outerRadius - thickness)*Math.sin(aa*angle2) - side4 + outerRadius*(Math.tan(aa*angle2/2) + 1/Math.tan(aa*angle1/2))} width={thickness} height={side4 - outerRadius*(Math.tan(aa*angle2/2) + 1/Math.tan(aa*angle1/2))} fill="black" />
        <rect x={100 - side1/2 + side5 + outerRadius - thickness} y={150 - h} width={side7 - outerRadius} height={thickness} fill="black" />
        <rect x={100 + side1/2 - side5 + thickness - side7} y={150 - h} width={side7 - outerRadius} height={thickness} fill="black" />
        <rect x={100 - side1/2 + side5 - thickness} y={150 - h + outerRadius} width={thickness} height={side6 - outerRadius*(1 + 1/Math.tan(aa*angle1/2))} fill="black"/>
        <rect x={100 + side1/2 - side5 } y={150 - h + outerRadius} width={thickness} height={side6 - outerRadius*(1 + 1/Math.tan(aa*angle1/2))} fill="black"/>

        <LineAtTheta x={100 - side1/2 + side5 - outerRadius - outerRadius*Math.cos(aa*angle1)} y={150 - h + side6 - outerRadius/Math.tan(aa*angle1/2) + outerRadius*Math.sin(aa*angle1)} w={l} h={thickness} angle={270 - angle1}/> 
        <LineAtTheta x={100 + side1/2 - side5 + outerRadius + (outerRadius - thickness)*Math.cos(aa*angle1)} y={150 - h + side6 - outerRadius/Math.tan(aa*angle1/2) + (outerRadius - thickness)*Math.sin(aa*angle1)} w={l} h={thickness} angle={angle1 - 90}/>   

        {/* outer radius */}
        <CircleSector radius={outerRadius} centerX={100 - side1/2 + outerRadius} centerY={150 - outerRadius} angle={90} rotation={90} thickness={thickness}/>      
        <CircleSector radius={outerRadius} centerX={100 + side1/2 - outerRadius} centerY={150 - outerRadius} angle={90} rotation={0} thickness={thickness}/> 
        <CircleSector radius={outerRadius} centerX={100 + side1/2 - outerRadius} centerY={150 - side2 + outerRadius*Math.tan(aa*angle2/2)} angle={angle2} rotation={-angle2} thickness={thickness}/>   
        <CircleSector radius={outerRadius} centerX={100 - side1/2 + outerRadius} centerY={150 - side2 + outerRadius*Math.tan(aa*angle2/2)} angle={angle2} rotation={180} thickness={thickness}/>   
        <CircleSector radius={outerRadius} centerX={100 - side1/2 + side3 - outerRadius} centerY={150 - side2 + outerRadius*Math.tan(aa*angle2/2) - (2*outerRadius - thickness)*Math.sin(aa*angle2)} angle={2*angle2} rotation={-angle2} thickness={thickness}/> 
        <CircleSector radius={outerRadius} centerX={100 + side1/2 - side3 + outerRadius} centerY={150 - side2 + outerRadius*Math.tan(aa*angle2/2) - (2*outerRadius - thickness)*Math.sin(aa*angle2)} angle={2*angle2} rotation={180-angle2} thickness={thickness}/> 
        <CircleSector radius={outerRadius} centerX={100 - side1/2 + outerRadius} centerY={150 - side2 + outerRadius*Math.tan(aa*angle2/2) - 2*(2*outerRadius - thickness)*Math.sin(aa*angle2)} angle={angle2} rotation={180 - angle2} thickness={thickness}/> 
        <CircleSector radius={outerRadius} centerX={100 + side1/2 - outerRadius} centerY={150 - side2 + outerRadius*Math.tan(aa*angle2/2) - 2*(2*outerRadius - thickness)*Math.sin(aa*angle2)} angle={angle2} rotation={0} thickness={thickness}/> 
        <CircleSector radius={outerRadius} centerX={100 + side1/2 - side5 - outerRadius + thickness} centerY={150 - h + outerRadius} angle={90} rotation={270} thickness={thickness}/> 
        <CircleSector radius={outerRadius} centerX={100 - side1/2 + side5 + outerRadius - thickness} centerY={150 - h + outerRadius} angle={90} rotation={180} thickness={thickness}/> 
        <CircleSector radius={outerRadius} centerX={100 - side1/2 + side5 - outerRadius} centerY={150 - h + side6 - outerRadius/Math.tan(aa*angle1/2)} angle={180 - angle1} rotation={0} thickness={thickness}/> 
        <CircleSector radius={outerRadius} centerX={100 - side1/2 + outerRadius} centerY={150 - side2 + outerRadius*Math.tan(aa*angle2/2) - 2*(2*outerRadius - thickness)*Math.sin(aa*angle2) -  side4 + outerRadius*(Math.tan(aa*angle2/2) + 1/Math.tan(aa*angle1/2))} angle={180 - angle1} rotation={180} thickness={thickness}/> 
        <CircleSector radius={outerRadius} centerX={100 + side1/2 - outerRadius} centerY={150 - side2 + outerRadius*Math.tan(aa*angle2/2) - 2*(2*outerRadius - thickness)*Math.sin(aa*angle2) -  side4 + outerRadius*(Math.tan(aa*angle2/2) + 1/Math.tan(aa*angle1/2))} angle={180 - angle1} rotation={angle1 - 180} thickness={thickness}/> 
        <CircleSector radius={outerRadius} centerX={100 + side1/2 - side5 + outerRadius} centerY={150 - h + side6 - outerRadius/Math.tan(aa*angle1/2)} angle={180 - angle1} rotation={angle1} thickness={thickness}/> 

        {/* Vertical Arrow for B */}
        <Liney x1={95 - side1/2} x2={95 - side1/2} y1={150 - side2} y2={150} text={'B'} val={side22} textHeight={-17}/>

        {/* Vertical Arrow for F */}
        <Liney x1={95 - side1/2} x2={95 - side1/2} y1={150 - h} y2={150 - h + side6} text={'F'} val={side66} textHeight={-17}/>

        {/* Vertical Arrow for F */}
        <Liney x1={105 + side1/2} x2={105 + side1/2} y1={150 - side2 + 2*outerRadius*Math.tan(aa*angle2/2) - 2*(2*outerRadius - thickness)*Math.sin(aa*angle2) - side4} y2={150 - side2 + 2*outerRadius*Math.tan(aa*angle2/2) - 2*(2*outerRadius - thickness)*Math.sin(aa*angle2)} text={'D'} val={side44} textHeight={17}/>

        {/* Vertical Arrow for A */}
        <Linex x1={100 - side1/2} x2={100 + side1/2} y1={155} y2={155} text={'A'} val={side11} textHeight={5}/>

        {/* Vertical Arrow for G */}
        <Linex x1={100 + side1/2 - side5 + thickness - side7} x2={100 + side1/2 - side5 + thickness} y1={145 - h} y2={145 - h} text={'G'} val={side77} textHeight={-5}/>

        <Linez x1={100 - side1/2} y1={150 - side2 - 2*(2*outerRadius - thickness)*Math.sin(aa*angle2)} thickness={side3} text={'C'} val={side33} textHeight={-5}/>

        <Linez x1={100 - side1/2} y1={155 - side2 - 2*(2*outerRadius - thickness)*Math.sin(aa*angle2)  - side4 + 2*outerRadius*Math.tan(aa*angle2/2) + outerRadius/Math.tan(aa*angle1/2)} thickness={side5} text={'E'} val={side55} textHeight={5}/>

      </svg>
      <button title={Props.title3} className='btn btn mx-2 my-2' onClick={zoomIn} style={{color: 'white', backgroundColor: '#1b065c'}}><i className="fa-solid fa-magnifying-glass-plus"></i></button>
      <button title={Props.title6} className='btn btn mx-2 my-2' onClick={resetZoom} style={{color: 'white', backgroundColor: '#1b065c'}}><i className="fa-solid fa-maximize"></i> </button>
      <button title={Props.title4} className='btn btn mx-2 my-2' onClick={zoomOut} style={{color: 'white', backgroundColor: '#1b065c'}}> <i className="fa-solid fa-magnifying-glass-minus"></i> </button>
    </div>
  );
}

export default Craftsman_c_rail_graph;
