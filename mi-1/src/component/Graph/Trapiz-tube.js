import { useState, useCallback, useEffect } from 'react';
import CircleSector from './Shap/Circle';
import * as Props from '../constant';
import Linex from './Shap/Linex';
import LineAtTheta from './Shap/LineAtθ';
import Liney from './Shap/Liney';
import { COM } from '../AdvanceOutput/COM';
import { ComputeMomentOfInertia } from '../AdvanceOutput/MomentOfInertia';

function Trapiz_tube_graph({side11, side22, side33, side44, side55, angle1, angle2, thickness1, outerRadius1, sendValue}){
  const aa = Math.PI/180
  const angle3 = (360 + (180/Math.PI)*Math.atan(side44/(side11/2 - side55/2 - side22/Math.tan(aa*angle1) - side33/Math.tan(aa*(angle1 + angle2)))) - angle2 - angle1)%360
  const angle4 = 540 - angle1 - angle2 - angle3;
  const mx = Math.max(side11 - 2*side22/Math.tan(aa*angle1), side33 + side22 + side44, side55 - 2*side44/Math.tan(aa*angle4));
  const thickness = (thickness1/mx)*Props.ratio
  const side1 = (side11/mx)*Props.ratio
  const side2 = (side22/mx)*Props.ratio
  const side3 = (side33/mx)*Props.ratio
  const side4 = (side44/mx)*Props.ratio
  const side5 = (side55/mx)*Props.ratio
  const outerRadius = (outerRadius1/mx)*Props.ratio

  const x1 = side1/2 - outerRadius/Math.tan(aa*angle1/2)
  const y1 = 150 - outerRadius

  const x2 = x1 - (side2/Math.sin(aa*angle1) - outerRadius*(1/Math.tan(aa*angle1/2) + 1/Math.tan(aa*angle2/2)))*Math.cos(aa*angle1)
  const y2 = y1 - (side2/Math.sin(aa*angle1) - outerRadius*(1/Math.tan(aa*angle1/2) + 1/Math.tan(aa*angle2/2)))*Math.sin(aa*angle1)

  const x4 = side5/2 - outerRadius/Math.tan(aa*angle4/2)
  const y4 = 150 - side2 - side3 - side4 + outerRadius

  const x3 = x4 - (side4/Math.sin(aa*angle4) - outerRadius*(1/Math.tan(aa*angle3/2) + 1/Math.tan(aa*angle4/2)))*Math.cos(aa*angle4)
  const y3 = y4 + (side4/Math.sin(aa*angle4) - outerRadius*(1/Math.tan(aa*angle3/2) + 1/Math.tan(aa*angle4/2)))*Math.sin(aa*angle4)

  const predefinedPoints = [
    { id: 1, type: 'line', x: 100 - x1, y: 150 - thickness, w: side1 - 2 * outerRadius / Math.tan(aa * angle1 / 2), h: thickness, angle: 0 },
    { id: 2, type: 'line', x: 100 - x4, y: 150 - side2 - side3 - side4, w: side5 - 2 * outerRadius / Math.tan(aa * angle4 / 2), h: thickness, angle: 0 },
    { id: 3, type: 'line', x: 100 - x1 - outerRadius * Math.sin(aa * angle1), y: y1 - outerRadius * Math.cos(aa * angle1), w: side2 / Math.sin(aa * angle1) - outerRadius * (1 / Math.tan(aa * angle1 / 2) + 1 / Math.tan(aa * angle2 / 2)), h: thickness, angle: 360 - angle1 },
    { id: 4, type: 'line', x: 100 + x1 + (outerRadius - thickness) * Math.sin(aa * angle1), y: y1 - (outerRadius - thickness) * Math.cos(aa * angle1), w: side2 / Math.sin(aa * angle1) - outerRadius * (1 / Math.tan(aa * angle1 / 2) + 1 / Math.tan(aa * angle2 / 2)), h: thickness, angle: angle1 - 180 },
    { id: 5, type: 'line', x: 100 - x4 - (outerRadius - thickness) * Math.sin(aa * angle4), y: y4 + (outerRadius - thickness) * Math.cos(aa * angle4), w: side4 / Math.sin(aa * angle4) - outerRadius * (1 / Math.tan(aa * angle4 / 2) + 1 / Math.tan(aa * angle3 / 2)), h: thickness, angle: angle4 },
    { id: 6, type: 'line', x: 100 + x4 + outerRadius * Math.sin(aa * angle4), y: y4 + outerRadius * Math.cos(aa * angle4), w: side4 / Math.sin(aa * angle4) - outerRadius * (1 / Math.tan(aa * angle4 / 2) + 1 / Math.tan(aa * angle3 / 2)), h: thickness, angle: 180 - angle4 },
    { id: 7, type: 'line', x: 100 - x2 + outerRadius * Math.sin(aa * (angle2 + angle1)), y: y2 + outerRadius * Math.cos(aa * (angle2 + angle1)), w: -side3 / Math.sin(aa * (angle1 + angle2)) - outerRadius * (1 / Math.tan(aa * angle3 / 2) + 1 / Math.tan(aa * angle2 / 2)), h: thickness, angle: 180 - angle1 - angle2 },
    { id: 8, type: 'line', x: 100 + x2 - (outerRadius - thickness) * Math.sin(aa * (angle2 + angle1)), y: y2 + (outerRadius - thickness) * Math.cos(aa * (angle2 + angle1)), w: -side3 / Math.sin(aa * (angle1 + angle2)) - outerRadius * (1 / Math.tan(aa * angle3 / 2) + 1 / Math.tan(aa * angle2 / 2)), h: thickness, angle: angle1 + angle2 },
    { id: 9, type: 'circle', x: 100 - x1, y: y1, r: outerRadius, angle: 180 - angle1, rotation: 90, t: thickness },
    { id: 10, type: 'circle', x: 100 + x1, y: y1, r: outerRadius, angle: 180 - angle1, rotation: angle1 - 90, t: thickness },
    { id: 11, type: 'circle', x: 100 - x2, y: y2, r: outerRadius, angle: 180 - angle2, rotation: 270 - angle1, t: thickness },
    { id: 12, type: 'circle', x: 100 + x2, y: y2, r: outerRadius, angle: 180 - angle2, rotation: angle1 + angle2 - 270, t: thickness },
    { id: 13, type: 'circle', x: 100 - x3, y: y3, r: outerRadius, angle: 180 - angle3, rotation: angle4 + angle3 - 90, t: thickness },
    { id: 14, type: 'circle', x: 100 + x3, y: y3, r: outerRadius, angle: 180 - angle3, rotation: 450 - angle4, t: thickness },
    { id: 15, type: 'circle', x: 100 - x4, y: y4, r: outerRadius, angle: 180 - angle4, rotation: 90 + angle4, t: thickness },
    { id: 16, type: 'circle', x: 100 + x4, y: y4, r: outerRadius, angle: 180 - angle4, rotation: 270, t: thickness },
  ];


  const {a, b} = COM(predefinedPoints)

  const translatedPoints = predefinedPoints.map(point => ({
    ...point,
    x: point.x + 100 - a,
    y: point.y + 100 - b
  }));
  const {Ix, Iy, sw, ol, acs} = ComputeMomentOfInertia(predefinedPoints, a, b, mx, Props.ratio, thickness);

  useEffect(() => {
    sendValue({ Ix, Iy, sw, ol, acs});// Send all consts as an object when the component mounts
  }, [Ix, Iy, sw, ol, acs]);


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

        <rect x={100 - x1 + 100 - a} y={150 - thickness + 100 - b} width={side1 - 2*outerRadius/Math.tan(aa*angle1/2)} height={thickness} fill="black" />
        <rect x={100 - x4 + 100 - a} y={150 - side2 - side3 - side4 + 100 - b} width={side5 - 2*outerRadius/Math.tan(aa*angle4/2)} height={thickness} fill="black"/>

        <LineAtTheta x={100 - x1 - outerRadius*Math.sin(aa*angle1) + 100 - a} y={y1 - outerRadius*Math.cos(aa*angle1) + 100 - b} w={side2/Math.sin(aa*angle1) - outerRadius*(1/Math.tan(aa*angle1/2) + 1/Math.tan(aa*angle2/2))} h={thickness} angle={360 - angle1}/>

        <LineAtTheta x={100 + x1 + (outerRadius - thickness)*Math.sin(aa*angle1) + 100 - a} y={y1 - (outerRadius - thickness)*Math.cos(aa*angle1) + 100 - b} w={side2/Math.sin(aa*angle1) - outerRadius*(1/Math.tan(aa*angle1/2) + 1/Math.tan(aa*angle2/2))} h={thickness} angle={angle1 - 180}/>

        <LineAtTheta x={100 - x4 - (outerRadius - thickness)*Math.sin(aa*angle4) + 100 - a} y={y4 + (outerRadius - thickness)*Math.cos(aa*angle4) + 100 - b} w={side4/Math.sin(aa*angle4) - outerRadius*(1/Math.tan(aa*angle4/2) + 1/Math.tan(aa*angle3/2))} h={thickness} angle={angle4}/>

        <LineAtTheta x={100 + x4 + outerRadius*Math.sin(aa*angle4) + 100 - a} y={y4 + outerRadius*Math.cos(aa*angle4) + 100 - b} w={side4/Math.sin(aa*angle4) - outerRadius*(1/Math.tan(aa*angle4/2) + 1/Math.tan(aa*angle3/2))} h={thickness} angle={180 - angle4}/>

        <LineAtTheta x={100 - x2 + outerRadius*Math.sin(aa*(angle2 + angle1)) + 100 - a} y={y2 + outerRadius*Math.cos(aa*(angle2 + angle1)) + 100 - b} w={-side3/Math.sin(aa*(angle1 + angle2)) - outerRadius*(1/Math.tan(aa*angle3/2) + 1/Math.tan(aa*angle2/2))} h={thickness} angle={180 - angle1 - angle2}/>

        <LineAtTheta x={100 + x2 - (outerRadius - thickness)*Math.sin(aa*(angle2 + angle1)) + 100 - a} y={y2 + (outerRadius - thickness)*Math.cos(aa*(angle2 + angle1)) + 100 - b} w={-side3/Math.sin(aa*(angle1 + angle2)) - outerRadius*(1/Math.tan(aa*angle3/2) + 1/Math.tan(aa*angle2/2))} h={thickness} angle={angle1 + angle2}/>

        <CircleSector radius={outerRadius} centerX={100 - x1 + 100 - a} centerY={y1 + 100 - b} angle={180 - angle1} rotation={90} thickness={thickness}/>
        <CircleSector radius={outerRadius} centerX={100 + x1 + 100 - a} centerY={y1 + 100 - b} angle={180 - angle1} rotation={angle1 - 90} thickness={thickness}/>
        <CircleSector radius={outerRadius} centerX={100 - x2 + 100 - a} centerY={y2 + 100 - b} angle={180 - angle2} rotation={270 - angle1} thickness={thickness}/>
        <CircleSector radius={outerRadius} centerX={100 + x2 + 100 - a} centerY={y2 + 100 - b} angle={180 - angle2} rotation={angle1 + angle2 - 270} thickness={thickness}/>
        <CircleSector radius={outerRadius} centerX={100 - x3 + 100 - a} centerY={y3 + 100 - b} angle={180 - angle3} rotation={angle4 + angle3 - 90} thickness={thickness}/>
        <CircleSector radius={outerRadius} centerX={100 + x3 + 100 - a} centerY={y3 + 100 - b} angle={180 - angle3} rotation={450 - angle4} thickness={thickness}/>
        <CircleSector radius={outerRadius} centerX={100 - x4 + 100 - a} centerY={y4 + 100 - b} angle={180 - angle4} rotation={90 + angle4} thickness={thickness}/>
        <CircleSector radius={outerRadius} centerX={100 + x4 + 100 - a} centerY={y4 + 100 - b} angle={180 - angle4} rotation={270} thickness={thickness}/>

        <Linex x1={100 - side1/2 + 100 - a} x2={100 + side1/2 + 100 - a} y1={155 + 100 - b} y2={155 + 100 - b} text={'A'} val={side11} textHeight={5}/>
        <Linex x1={100 - side5/2 + 100 - a} x2={100 + side5/2 + 100 - a} y1={145 - side2 - side3 - side4 + 100 - b} y2={145 - side2 - side3 - side4 + 100 - b} text={'E'} val={side55} textHeight={-5}/>
        <Linex x1={115 - x2 + 100 - a} x2={115 - x2 + 100 - a} y1={y2 + 100 - b} y2={y2 + 100 - b} text={'θ2'} val={angle2} textHeight={5} unit={" "}/>
        <Linex x1={110 - x1 + 100 - a} x2={110 - x1 + 100 - a} y1={y1 + 100 - b} y2={y1 + 100 - b} text={'θ1'} val={angle1} textHeight={-5} unit={" "}/>

        <Liney x1={95 - x2 - outerRadius + 100 - a} x2={95 - x2 - outerRadius + 100 - a} y1={150 - side2 + 100 - b} y2={150 + 100 - b} text={'B'} val={side22} textHeight={-17}/>
        <Liney x1={95 - x2 - outerRadius + 100 - a} x2={95 - x2 - outerRadius + 100 - a} y1={150 - side2 - side3 + 100 - b} y2={150 - side2 + 100 - b} text={'C'} val={side33} textHeight={-17}/>
        <Liney x1={95 - x2 - outerRadius + 100 - a} x2={95 - x2 - outerRadius + 100 - a} y1={150 - side2 - side3 - side4 + 100 - b} y2={150 - side2 - side3 + 100 - b} text={'D'} val={side44} textHeight={-17}/>

       
      </svg>
      <button title={Props.title3} className='btn btn mx-2 my-2' onClick={zoomIn} style={{color: 'white', backgroundColor: '#1b065c'}}><i className="fa-solid fa-magnifying-glass-plus"></i></button>
      <button title={Props.title6} className='btn btn mx-2 my-2' onClick={resetZoom} style={{color: 'white', backgroundColor: '#1b065c'}}><i className="fa-solid fa-maximize"></i> </button>
      <button title={Props.title4} className='btn btn mx-2 my-2' onClick={zoomOut} style={{color: 'white', backgroundColor: '#1b065c'}}> <i className="fa-solid fa-magnifying-glass-minus"></i> </button>
    </div>
  );
}

export default Trapiz_tube_graph;
