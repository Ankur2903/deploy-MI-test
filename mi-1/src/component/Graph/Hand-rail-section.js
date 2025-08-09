import { useState, useCallback, useEffect } from 'react';
import CircleSector from './Shap/Circle';
import * as Props from '../constant';
import Linex from './Shap/Linex';
import Liney from './Shap/Liney';
import LineAtTheta from './Shap/LineAtθ';
import { COM } from '../AdvanceOutput/COM';
import { ComputeMomentOfInertia } from '../AdvanceOutput/MomentOfInertia';

function Hand_rail_section_graph({ side11, angle11, angle22, radius1, thickness1, outerRadius1, sendValue}) {
  const aa = Math.PI/180;
  const A1 = 2*(radius1*Math.sin(aa*angle22) + (outerRadius1 - thickness1)*( - Math.sin(aa*angle11) + Math.sin(aa*angle22)) + ((side11 - thickness1)/Math.sin(aa*angle11) - outerRadius1/Math.tan(aa*(angle11 + angle22)/2) + thickness1/Math.tan(aa*angle11/2))*Math.cos(aa*angle11))
  const B1 = radius1*Math.cos(aa*angle22) + (outerRadius1 - thickness1)*(Math.cos(aa*angle11) + Math.cos(aa*angle22)) + ((side11 - thickness1)/Math.sin(aa*angle11) - outerRadius1/Math.tan(aa*(angle11 + angle22)/2) + thickness1/Math.tan(aa*angle11/2))*Math.sin(aa*angle11)

  const mx = Math.max(2*radius1, A1, B1 + radius1);
  const thickness = (thickness1/mx)*Props.ratio
  const side1 = (side11/mx)*Props.ratio
  const angle1 = angle11
  const angle2 = angle22
  const radius = (radius1/mx)*Props.ratio
  const A = A1*Props.ratio/mx
  const B = B1*Props.ratio/mx
  const outerRadius = (outerRadius1/mx)*Props.ratio

  const l1 = (side1 - thickness)/Math.sin(aa*angle1) - outerRadius/Math.tan(aa*(angle1 + angle2)/2) - (outerRadius - thickness)/Math.tan(aa*angle1/2)

  const predefinedPoints = [
    { id: 1, type: 'line', x: 100 - A / 2 + outerRadius / Math.tan(aa * angle1 / 2), y: 150 - thickness, w: A - 2 * outerRadius / Math.tan(aa * angle1 / 2), h: thickness, angle: 0},
    { id: 2, type: 'line', x: 100 - A / 2 + outerRadius * Math.cos(aa * angle1) / Math.tan(aa * angle1 / 2), y: 150 - outerRadius * Math.sin(aa * angle1) / Math.tan(aa * angle1 / 2), w: l1, h: thickness, angle: -angle1},
    { id: 3, type: 'line', x: 100 + A / 2 - (outerRadius / Math.tan(aa * angle1 / 2) + l1) * Math.cos(aa * angle1), y: 150 - (outerRadius / Math.tan(aa * angle1 / 2) + l1) * Math.sin(aa * angle1), w: (side1 - thickness) / Math.sin(aa * angle1) - outerRadius / Math.tan(aa * (angle1 + angle2) / 2) - (outerRadius - thickness) / Math.tan(aa * angle1 / 2), h: thickness, angle: angle1},
    { id: 4, type: 'circle', x: 100 - A / 2 + outerRadius / Math.tan(aa * angle1 / 2), y: 150 - outerRadius, r: outerRadius, angle: 180 - angle1, rotation: 90, t: thickness},
    { id: 5, type: 'circle', x: 100 + A / 2 - outerRadius / Math.tan(aa * angle1 / 2), y: 150 - outerRadius, r: outerRadius, angle: 180 - angle1, rotation: angle1 - 90, t: thickness},
    { id: 6, type: 'circle', x: 100, y: 150 - B, r: radius, angle: 360 - 2 * angle2, rotation: 90 + angle2, t: thickness},
    { id: 7, type: 'circle', x: 100 + radius * Math.sin(aa * angle2) + (outerRadius - thickness) * Math.sin(aa * angle2), y: 150 - B + radius * Math.cos(aa * angle2) + (outerRadius - thickness) * Math.cos(aa * angle2), r: outerRadius, angle: 180 - angle2 - angle1, rotation: 90 + angle1, t: thickness},
    { id: 8, type: 'circle', x: 100 - radius * Math.sin(aa * angle2) - (outerRadius - thickness) * Math.sin(aa * angle2), y: 150 - B + radius * Math.cos(aa * angle2) + (outerRadius - thickness) * Math.cos(aa * angle2), r: outerRadius, angle: 180 - angle2 - angle1, rotation: angle2 - 90, t: thickness}
  ];

  const {a, b} = COM(predefinedPoints)

  const translatedPoints = predefinedPoints.map(point => ({
    ...point,
    x: point.x + 100 - a,
    y: point.y + 100 - b
  }));
  const {Ix, Iy} = ComputeMomentOfInertia(predefinedPoints, a, b, mx, Props.ratio);

  useEffect(() => {
    sendValue({ Ix, Iy });// Send all consts as an object when the component mounts
  }, [Ix, Iy]);


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
        <rect x={100 - A/2 + outerRadius/Math.tan(aa*angle1/2) + 100 - a} y={150 - thickness + 100 - b} width={A - 2*outerRadius/Math.tan(aa*angle1/2)} height={thickness} fill="black" />

        <LineAtTheta x={100 - A/2 + outerRadius*Math.cos(aa*angle1)/Math.tan(aa*angle1/2) + 100 - a} y={150 -  outerRadius*Math.sin(aa*angle1)/Math.tan(aa*angle1/2) + 100 - b} w={l1} h={thickness} angle={-angle1}/> 

        <LineAtTheta x={100 + A/2 - (outerRadius/Math.tan(aa*angle1/2) + l1)*Math.cos(aa*angle1) + 100 - a} y={150 - (outerRadius/Math.tan(aa*angle1/2) + l1)*Math.sin(aa*angle1) + 100 - b} w={(side1 - thickness)/Math.sin(aa*angle1) - outerRadius/Math.tan(aa*(angle1 + angle2)/2) - (outerRadius - thickness)/Math.tan(aa*angle1/2)} h={thickness} angle={angle1}/>   

        <CircleSector radius={outerRadius} centerX={100 - A/2 + outerRadius/Math.tan(aa*angle1/2) + 100 - a} centerY={150 - outerRadius + 100 - b} angle={180 - angle1} rotation={90} thickness={thickness}/>   

        <CircleSector radius={outerRadius} centerX={100 + A/2 - outerRadius/Math.tan(aa*angle1/2) + 100 - a} centerY={150 - outerRadius + 100 - b} angle={180 - angle1} rotation={angle1 - 90} thickness={thickness}/>         

        <CircleSector radius={radius} centerX={100 + 100 - a} centerY={150 - B + 100 - b} angle={360 - 2*angle2} rotation={90 + angle2} thickness={thickness}/>  

        <CircleSector radius={outerRadius} centerX={100 + radius*Math.sin(aa*angle2) + (outerRadius - thickness)*(Math.sin(aa*angle2)) + 100 - a} centerY={150 - B + radius*Math.cos(aa*angle2) + (outerRadius - thickness)*(Math.cos(aa*angle2)) + 100 - b} angle={180 - angle2 - angle1} rotation={90 + angle1} thickness={thickness}/>  

        <CircleSector radius={outerRadius} centerX={100 - radius*Math.sin(aa*angle2) - (outerRadius - thickness)*(Math.sin(aa*angle2)) + 100 - a} centerY={150 - B + radius*Math.cos(aa*angle2) + (outerRadius - thickness)*(Math.cos(aa*angle2)) + 100 - b} angle={180 - angle2 - angle1} rotation={angle2 - 90} thickness={thickness}/>  

        <Linex x1={100 - radius + 100 - a} x2={100 + 100 - a} y1={150 - B + 100 - b} y2={150 - B + 100 - b} text={'R'} val={radius1} textHeight={5}/>

        <Linex x1={100 + A/2 + 100 - a} x2={100 + A/2 + 100 - a} y1={150 + 100 - b} y2={150 + 100 - b} text={'θ1'} val={angle1} textHeight={5} unit={" "}/>

        <Liney x1={45 + 100 - a} x2={45 + 100 - a} y1={150 - side1 + 100 - b} y2={150 + 100 - b} text={'A'} val={side11} textHeight={-17}/>


      </svg>
      <button title={Props.title3} className='btn btn mx-2 my-2' onClick={zoomIn} style={{color: 'white', backgroundColor: '#1b065c'}}><i className="fa-solid fa-magnifying-glass-plus"></i></button>
      <button title={Props.title6} className='btn btn mx-2 my-2' onClick={resetZoom} style={{color: 'white', backgroundColor: '#1b065c'}}><i className="fa-solid fa-maximize"></i> </button>
      <button title={Props.title4} className='btn btn mx-2 my-2' onClick={zoomOut} style={{color: 'white', backgroundColor: '#1b065c'}}> <i className="fa-solid fa-magnifying-glass-minus"></i> </button>
    </div>
  );
}

export default Hand_rail_section_graph;