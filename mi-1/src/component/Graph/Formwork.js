import { useState, useCallback, useEffect } from 'react';
import CircleSector from './Shap/Circle';
import * as Props from '../constant';
import Linex from './Shap/Linex';
import Liney from './Shap/Liney';
import LineAtTheta from './Shap/LineAtθ';
import { COM } from '../AdvanceOutput/COM';

function Formwork_graph({ side11, side22, side33, side44, side55, side66, side77, side88, side99, side1010, side1212, thickness1, outerRadius1, angle1, angle2, angle3, angle4, sendValuey}) {
  const mx = Math.max(side22,side11);
  const thickness = (thickness1/mx)*Props.ratio
  const side1 = (side11/mx)*Props.ratio
  const side2 = (side22/mx)*Props.ratio
  const side3 = (side33/mx)*Props.ratio
  const side4 = (side44/mx)*Props.ratio
  const side5 = (side55/mx)*Props.ratio
  const side7 = (side77/mx)*Props.ratio
  const side8 = (side88/mx)*Props.ratio
  const side9 = (side99/mx)*Props.ratio
  const side10 = (side1010/mx)*Props.ratio
  const side12 = (side1212/mx)*Props.ratio
  const side6 = (side66/mx)*Props.ratio
  const outerRadius = (outerRadius1/mx)*Props.ratio

  const aa = Math.PI/180;
  const l1 = (side12 - 2*outerRadius - (2*outerRadius - thickness)*Math.cos(aa*angle4))/Math.sin(aa*angle4)
  const l2 = side1 - side9 - side10 + 2*outerRadius/Math.tan(aa*angle4/2) - 2*(2*outerRadius - thickness)*Math.sin(aa*angle4) + 2*l1*Math.cos(aa*angle4)
  const l3 = ( - outerRadius*(1/Math.tan(aa*angle1/2) + 1/Math.tan(aa*angle2/2))*Math.cos(aa*angle1) - side4)/Math.cos(aa*angle1)
  const l4 = (-side4*Math.tan(aa*angle1) - side5)/Math.sin(aa*(angle1 + angle2))  + (outerRadius - thickness)*Math.tan(aa*(angle1 + angle2)/2) - outerRadius/Math.tan(aa*angle2/2)
  const l8 = (side8 - outerRadius - outerRadius/Math.tan(aa*angle3/2) - thickness + (2*outerRadius - thickness)*Math.sin(aa*angle3))/Math.cos(aa*angle3)
  const l7 = ( - outerRadius*(1/Math.tan(aa*angle1/2) + 1/Math.tan(aa*angle2/2))*Math.cos(aa*angle1) - side6)/Math.cos(aa*angle1)
  const l6 = (-side6*Math.tan(aa*angle1) - side5)/Math.sin(aa*(angle1 + angle2))  + (outerRadius - thickness)*Math.tan(aa*(angle1 + angle2)/2) - outerRadius/Math.tan(aa*angle2/2)

  const x1 = 50 + side9 - outerRadius/Math.tan(aa*angle4/2) + (2*outerRadius - thickness)*Math.sin(aa*angle4) - l1*Math.cos(aa*angle4)

  const x2 = 50 + side3 - outerRadius/Math.tan(aa*angle1/2)
  const y2 = 150 - side2 + outerRadius

  const x3 = x2 - l3*Math.cos(aa*angle1)
  const y3 = y2 + l3*Math.sin(aa*angle1)

  const x4 = x3 + l4*Math.cos(aa*(angle1 + angle2)) - (2*outerRadius - thickness)*Math.sin(aa*(angle1 + angle2))
  const y4 = 150 - side2 + side5 - outerRadius + thickness

  const x5 = 50 + side1 - outerRadius - (2*outerRadius - thickness)*Math.cos(aa*angle3) - l8*Math.sin(aa*angle3)

  const x6 = x5 - 2*outerRadius + thickness

  const x7 = x6 + outerRadius - side7 + outerRadius/Math.tan(aa*angle1/2)

  const x8 = x7 + l7*Math.cos(aa*angle1)
  const y8 = y2 + l7*Math.sin(aa*angle1)

  const x9 = x8 - l6*Math.cos(aa*(angle1 + angle2)) + (2*outerRadius - thickness)*Math.sin(aa*(angle1 + angle2))
  const y9 = 150 - side2 + side5 - outerRadius + thickness

  const predefinedPoints = [
    { id: 1, type: 'line', x: 50 + outerRadius, y: 150 - thickness, w: side9 - outerRadius * (1 + 1 / Math.tan(aa * angle4 / 2)), h: thickness, angle: 0 },
    { id: 2, type: 'line', x: 50 + side1 - side10 + outerRadius / Math.tan(aa * angle4 / 2), y: 150 - thickness, w: side10 - outerRadius * (1 + 1 / Math.tan(aa * angle4 / 2)), h: thickness, angle: 0 },
    { id: 3, type: 'line', x: 50, y: 150 - side2 + outerRadius, w: thickness, h: side2 - 2 * outerRadius, angle: 0 },
    { id: 4, type: 'line', x: 50 + side1 - thickness, y: 150 - side8 + outerRadius / Math.tan(aa * angle3 / 2), w: thickness, h: side8 - outerRadius * (1 + 1 / Math.tan(aa * angle3 / 2)), angle: 0 },
    { id: 5, type: 'line', x: 50 + outerRadius, y: 150 - side2, w: side3 - outerRadius * (1 + 1 / Math.tan(aa * angle1 / 2)), h: thickness, angle: 0 },
    { id: 6, type: 'line', x: x1, y: 150 - side12, w: l2, h: thickness, angle: 0 },
    { id: 7, type: 'line', x: x5 - outerRadius, y: 150 - side2 + outerRadius, w: thickness, h: side2 - 2 * outerRadius - thickness, angle: 0 },
    { id: 8, type: 'line', x: x7, y: 150 - side2, w: side7 - outerRadius * (1 + 1 / Math.tan(aa * angle1 / 2)), h: thickness, angle: 0 },
    { id: 9, type: 'line', x: x4, y: 150 - side2 + side5, w: x9 - x4, h: thickness, angle: 0 },
    { id: 10, type: 'line', x: 50 + side3 - outerRadius * Math.cos(aa * angle1) / Math.tan(aa * angle1 / 2), y: 150 - side2 + outerRadius * Math.sin(aa * angle1) / Math.tan(aa * angle1 / 2), w: l3, h: thickness, angle: 180 - angle1 },
    { id: 11, type: 'line', x: 50 + side9 - outerRadius / Math.tan(aa * angle4 / 2) + (outerRadius - thickness) * Math.sin(aa * angle4), y: 150 - outerRadius - (outerRadius - thickness) * Math.cos(aa * angle4), w: l1, h: thickness, angle: angle4 - 180 },
    { id: 12, type: 'line', x: 50 + side1 - side10 + outerRadius / Math.tan(aa * angle4 / 2) - outerRadius * Math.sin(aa * angle4), y: 150 - outerRadius - outerRadius * Math.cos(aa * angle4), w: l1, h: thickness, angle: 360 - angle4 },
    { id: 13, type: 'line', x: x3 - outerRadius * Math.sin(aa * (angle1 + angle2)), y: y3 - outerRadius * Math.cos(aa * (angle1 + angle2)), w: l4, h: thickness, angle: -angle1 - angle2 },
    { id: 14, type: 'line', x: x5 + (outerRadius - thickness) * Math.cos(aa * angle3), y: 150 - outerRadius - thickness + (outerRadius - thickness) * Math.sin(aa * angle3), w: l8, h: thickness, angle: angle3 - 90 },
    { id: 15, type: 'line', x: x7 - (outerRadius - thickness) * Math.sin(aa * angle1), y: 150 - side2 + outerRadius + (outerRadius - thickness) * Math.cos(aa * angle1), w: l7, h: thickness, angle: angle1 },
    { id: 16, type: 'line', x: x9 - (outerRadius - thickness) * Math.sin(aa * (angle1 + angle2)), y: y9 + (outerRadius - thickness) * Math.cos(aa * (angle1 + angle2)), w: l6, h: thickness, angle: angle1 + angle2 - 360 },
    { id: 17, type: 'circle', x: 50 + outerRadius, y: 150 - outerRadius, r: outerRadius, angle: 90, rotation: 90, t: thickness },
    { id: 18, type: 'circle', x: 50 + side1 - outerRadius, y: 150 - outerRadius, r: outerRadius, angle: 90, rotation: 0, t: thickness },
    { id: 19, type: 'circle', x: 50 + outerRadius, y: 150 - side2 + outerRadius, r: outerRadius, angle: 90, rotation: 180, t: thickness },
    { id: 20, type: 'circle', x: x2, y: y2, r: outerRadius, angle: 180 - angle1, rotation: 270, t: thickness },
    { id: 21, type: 'circle', x: 50 + side9 - outerRadius / Math.tan(aa * angle4 / 2), y: 150 - outerRadius, r: outerRadius, angle: 180 - angle4, rotation: angle4 - 90, t: thickness },
    { id: 22, type: 'circle', x: x1, y: 150 - side12 + outerRadius, r: outerRadius, angle: 180 - angle4, rotation: angle4 + 90, t: thickness },
    { id: 23, type: 'circle', x: x1 + l2, y: 150 - side12 + outerRadius, r: outerRadius, angle: 180 - angle4, rotation: 270, t: thickness },
    { id: 24, type: 'circle', x: 50 + side1 - side10 + outerRadius / Math.tan(aa * angle4 / 2), y: 150 - outerRadius, r: outerRadius, angle: 180 - angle4, rotation: 90, t: thickness },
    { id: 25, type: 'circle', x: x3, y: y3, r: outerRadius, angle: 180 - angle2, rotation: 90 - angle1, t: thickness },
    { id: 26, type: 'circle', x: x4, y: y4, r: outerRadius, angle: 360 - angle1 - angle2, rotation: 90, t: thickness },
    { id: 27, type: 'circle', x: 50 + side1 - outerRadius, y: 150 - side8 + outerRadius / Math.tan(aa * angle3 / 2), r: outerRadius, angle: 180 - angle3, rotation: angle3 - 180, t: thickness },
    { id: 28, type: 'circle', x: x5, y: 150 - thickness - outerRadius, r: outerRadius, angle: 180 - angle3, rotation: angle3, t: thickness },
    { id: 29, type: 'circle', x: x6, y: 150 - side2 + outerRadius, r: outerRadius, angle: 90, rotation: 270, t: thickness },
    { id: 30, type: 'circle', x: x7, y: 150 - side2 + outerRadius, r: outerRadius, angle: 180 - angle1, rotation: 90 + angle1, t: thickness },
    { id: 31, type: 'circle', x: x8, y: y8, r: outerRadius, angle: 180 - angle2, rotation: angle1 + angle2 - 90, t: thickness },
    { id: 32, type: 'circle', x: x9, y: y9, r: outerRadius, angle: 360 - angle1 - angle2, rotation: angle1 + angle2 - 270, t: thickness },
  ];

  const {a, b} = COM(predefinedPoints)

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
        <rect x={50 + outerRadius + 100 - a} y={150 - thickness + 100 - b} width={side9 - outerRadius*(1 + 1/Math.tan(aa*angle4/2))} height={thickness} fill="black"/>
        <rect x={50 + side1 - side10 + outerRadius/Math.tan(aa*angle4/2) + 100 - a} y={150 - thickness + 100 - b} width={side10 - outerRadius*(1 + 1/Math.tan(aa*angle4/2))} height={thickness} fill="black"/>
        <rect x={50 + 100 - a} y={150 - side2 + outerRadius + 100 - b} width={thickness} height={side2 - 2*outerRadius} fill="black"/>
        <rect x={50 + side1 - thickness + 100 - a} y={150 - side8 + outerRadius/Math.tan(aa*angle3/2) + 100 - b} width={thickness} height={side8 - outerRadius*(1 + 1/Math.tan(aa*angle3/2))} fill="black"/>
        <rect x={50 + outerRadius + 100 - a} y={150 - side2 + 100 - b} width={side3 - outerRadius*(1 + 1/Math.tan(aa*angle1/2))} height={thickness} fill="black"/>
        <rect x={x1 + 100 - a} y={150 - side12 + 100 - b} width={l2} height={thickness} fill="black"/>
        <rect x={x5 - outerRadius + 100 - a} y={150 - side2 + outerRadius + 100 - b} width={thickness} height={side2 - 2*outerRadius - thickness} fill="black"/>
        <rect x={x7 + 100 - a} y={150 - side2 + 100 - b} width={side7 - outerRadius*(1 + 1/Math.tan(aa*angle1/2))} height={thickness} fill="black"/>
        <rect x={x4 + 100 - a} y={150 - side2 + side5 + 100 - b} width={x9 - x4} height={thickness} fill="black"/>

        <LineAtTheta x={50 + side3 - outerRadius*Math.cos(aa*angle1)/Math.tan(aa*angle1/2) + 100 - a} y={150 - side2 + outerRadius*Math.sin(aa*angle1)/Math.tan(aa*angle1/2) + 100 - b} w={l3}  h={thickness} angle={180 - angle1}/>
        <LineAtTheta x={50 + side9 - outerRadius/Math.tan(aa*angle4/2) + (outerRadius - thickness)*Math.sin(aa*angle4) + 100 - a} y={150 - outerRadius - (outerRadius - thickness)*Math.cos(aa*angle4) + 100 - b} w={l1} h={thickness} angle={angle4 - 180}/>
        <LineAtTheta x={50 + side1 - side10 + outerRadius/Math.tan(aa*angle4/2) - outerRadius*Math.sin(aa*angle4) + 100 - a} y={150 - outerRadius - outerRadius*Math.cos(aa*angle4) + 100 - b} w={l1} h={thickness} angle={360 - angle4}/>
        <LineAtTheta x={x3 - outerRadius*Math.sin(aa*(angle1 + angle2)) + 100 - a} y={y3 - outerRadius*Math.cos(aa*(angle1 + angle2)) + 100 - b} w={l4} h={thickness} angle={- angle1 - angle2}/>
        <LineAtTheta x={x5 + (outerRadius - thickness)*Math.cos(aa*angle3) + 100 - a} y={150 - outerRadius - thickness + (outerRadius - thickness)*Math.sin(aa*angle3) + 100 - b} w={l8} h={thickness} angle={angle3 - 90}/>
        <LineAtTheta x={x7 - (outerRadius - thickness)*Math.sin(aa*angle1) + 100 - a} y={150 - side2 + outerRadius + (outerRadius - thickness)*Math.cos(aa*angle1) + 100 - b} w={l7} h={thickness} angle={angle1}/>
        <LineAtTheta x={x9 - (outerRadius - thickness)*Math.sin(aa*(angle1 + angle2)) + 100 - a} y={y9 + (outerRadius - thickness)*Math.cos(aa*(angle1 + angle2)) + 100 - b} w={l6} h={thickness} angle={angle1 + angle2 - 360}/>

        {/* outer radius */}
        <CircleSector radius={outerRadius} centerX={50 + outerRadius + 100 - a} centerY={150 - outerRadius + 100 - b} angle={90} rotation={90} thickness={thickness}/>
        <CircleSector radius={outerRadius} centerX={50 + side1 - outerRadius + 100 - a} centerY={150 - outerRadius + 100 - b} angle={90} rotation={0} thickness={thickness}/>
        <CircleSector radius={outerRadius} centerX={50 + outerRadius + 100 - a} centerY={150 - side2 + outerRadius + 100 - b} angle={90} rotation={180} thickness={thickness}/>
        <CircleSector radius={outerRadius} centerX={x2 + 100 - a} centerY={y2 + 100 - b} angle={180 - angle1} rotation={270} thickness={thickness}/>
        <CircleSector radius={outerRadius} centerX={50 + side9 - outerRadius/Math.tan(aa*angle4/2) + 100 - a} centerY={150 - outerRadius + 100 - b} angle={180 - angle4} rotation={angle4 - 90} thickness={thickness}/>
        <CircleSector radius={outerRadius} centerX={x1 + 100 - a} centerY={150 - side12 + outerRadius + 100 - b} angle={180 - angle4} rotation={angle4 + 90} thickness={thickness}/>
        <CircleSector radius={outerRadius} centerX={x1 + l2 + 100 - a} centerY={150 - side12 + outerRadius + 100 - b} angle={180 - angle4} rotation={270} thickness={thickness}/>

        <CircleSector radius={outerRadius} centerX={50 + side1 - side10 + outerRadius/Math.tan(aa*angle4/2) + 100 - a} centerY={150 - outerRadius + 100 - b} angle={180 - angle4} rotation={90} thickness={thickness}/>
        <CircleSector radius={outerRadius} centerX={x3 + 100 - a} centerY={y3 + 100 - b} angle={180 - angle2} rotation={90 - angle1} thickness={thickness}/>
        <CircleSector radius={outerRadius} centerX={x4 + 100 - a} centerY={y4 + 100 - b} angle={360 - angle1 - angle2} rotation={90} thickness={thickness}/>
        <CircleSector radius={outerRadius} centerX={50 + side1 - outerRadius + 100 - a} centerY={150 - side8 + outerRadius/Math.tan(aa*angle3/2) + 100 - b} angle={180 - angle3} rotation={angle3 - 180} thickness={thickness}/>
        <CircleSector radius={outerRadius} centerX={x5 + 100 - a} centerY={150 - thickness - outerRadius + 100 - b} angle={180 - angle3} rotation={angle3} thickness={thickness}/>
        <CircleSector radius={outerRadius} centerX={x6 + 100 - a} centerY={150 - side2 + outerRadius + 100 - b} angle={90} rotation={270} thickness={thickness}/>
        <CircleSector radius={outerRadius} centerX={x7 + 100 - a} centerY={150 - side2 + outerRadius + 100 - b} angle={180 - angle1} rotation={90 + angle1} thickness={thickness}/>
        <CircleSector radius={outerRadius} centerX={x8 + 100 - a} centerY={y8 + 100 - b} angle={180 - angle2} rotation={angle1 + angle2 - 90} thickness={thickness}/>
        <CircleSector radius={outerRadius} centerX={x9 + 100 - a} centerY={y9 + 100 - b} angle={360 - angle1 - angle2} rotation={angle1 + angle2 - 270} thickness={thickness}/>

        {/* Vertical Arrow for E*/}
        <Liney x1={10 + 100 - a} x2={10 + 100 - a} y1={150 - side2 + 100 - b} y2={150 + 100 - b} text={'B'} val={side22} textHeight={17}/>
        {/* Vertical Arrow for E*/}
        <Liney x1={x4 + 100 - a} x2={x4 + 100 - a} y1={150 - side2 + 100 - b} y2={150 - side2 + side5 + 100 - b} text={'E'} val={side55} textHeight={14}/>
        {/* Vertical Arrow for H*/}
        <Liney x1={55 + side1 + 100 - a} x2={55 + side1 + 100 - a} y1={150 - side8 + 100 - b} y2={150 + 100 - b} text={'H'} val={side88} textHeight={17}/>
        {/* Vertical Arrow for K*/}
        <Liney x1={45 + 100 - a} x2={45 + 100 - a} y1={150 - side1212 + 100 - b} y2={150 + 100 - b} text={'K'} val={side1212} textHeight={-17}/>
        {/* Vertical Arrow for A */}
        <Linex x1={50 + 100 - a} x2={50 + side1 + 100 - a} y1={165 + 100 - b} y2={165 + 100 - b} text={'A'} val={side11} textHeight={5} unit={""}/>
        {/* Vertical Arrow I */}
        <Linex x1={50 + 100 - a} x2={50 + side9 + 100 - a} y1={155 + 100 - b} y2={155 + 100 - b} text={'I'} val={side99} textHeight={5} unit={""}/>
        {/* Vertical Arrow for D */}
        <Linex x1={50 + side3 + 100 - a} x2={50 + side3 + side4 + 100 - a} y1={140 - side2 + 100 - b} y2={140 - side2 + 100 - b} text={'D'} val={side44} textHeight={-5} unit={""}/>
        {/* Vertical Arrow for C */}
        <Linex x1={50 + 100 - a} x2={50 + side3 + 100 - a} y1={140 - side2 + 100 - b} y2={140 - side2 + 100 - b} text={'C'} val={side33} textHeight={5} unit={""}/>
        {/* Vertical Arrow for J */}
        <Linex x1={50 + side1 - side10 + 100 - a} x2={50 + side1 + 100 - a} y1={155 + 100 - b} y2={155 + 100 - b} text={'J'} val={side1010} textHeight={5} unit={""}/>
        {/* Vertical Arrow for C */}
        <Linex x1={x7 - outerRadius/Math.tan(aa*angle1/2) + 100 - a} x2={x6 + outerRadius + 100 - a} y1={140 - side2 + 100 - b} y2={140 - side2 + 100 - b} text={'G'} val={side77} textHeight={-5} unit={""}/>
        {/* Vertical Arrow for C */}
        <Linex x1={x7 - outerRadius/Math.tan(aa*angle1/2) - side6 + 100 - a} x2={x7 - outerRadius/Math.tan(aa*angle1/2) + 100 - a} y1={140 - side2 + 100 - b} y2={140 - side2 + 100 - b} text={'F'} val={side66} textHeight={5} unit={""}/>

      </svg>
      <button title={Props.title3} className='btn btn mx-2 my-2' onClick={zoomIn} style={{color: 'white', backgroundColor: '#1b065c'}}><i className="fa-solid fa-magnifying-glass-plus"></i></button>
      <button title={Props.title6} className='btn btn mx-2 my-2' onClick={resetZoom} style={{color: 'white', backgroundColor: '#1b065c'}}><i className="fa-solid fa-maximize"></i> </button>
      <button title={Props.title4} className='btn btn mx-2 my-2' onClick={zoomOut} style={{color: 'white', backgroundColor: '#1b065c'}}> <i className="fa-solid fa-magnifying-glass-minus"></i> </button>
    </div>
  );
}

export default Formwork_graph
;
