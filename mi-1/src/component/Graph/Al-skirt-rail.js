import { useState, useCallback, useEffect } from 'react';
import CircleSector from './Shap/Circle';
import * as Props from '../constant';
import Linex from './Shap/Linex';
import Liney from './Shap/Liney';
import LineAtTheta from './Shap/LineAtθ';
import { COM } from '../AdvanceOutput/COM';
import { ComputeMomentOfInertia } from '../AdvanceOutput/MomentOfInertia';
import PredefinedPoints from '../PredefinedPoints';

function Al_skirt_rail_graph({ side11, side22, side33, side44, angle11, angle22, radius1, thickness1, outerRadius1, sendValue}) {
  const aa = Math.PI/180;
  const mx = Math.max(side22,side11, side11 - side22/Math.tan(aa*angle11));
  const thickness = (thickness1/mx)*Props.ratio
  const side1 = (side11/mx)*Props.ratio
  const side2 = (side22/mx)*Props.ratio
  const side3 = (side33/mx)*Props.ratio
  const side4 = (side44/mx)*Props.ratio
  const angle1 = angle11
  const angle2 = angle22
  const radius = (radius1/mx)*Props.ratio
  const outerRadius = (outerRadius1/mx)*Props.ratio

  const l = side2/Math.sin(aa*angle1) - outerRadius/Math.tan(aa*angle1/2) - outerRadius*Math.tan(aa*angle1/2);
  const l2 = (side2 - side4 - (1 + Math.cos(aa*angle2))*(2*outerRadius - thickness))/Math.sin(aa*angle2)

  const x1 = 50 + side1 - outerRadius/Math.tan(aa*angle1/2)
  const y1 = 150 - outerRadius

  const x2 = x1 - l*Math.cos(aa*angle1)
  const y2 = y1 - l*Math.sin(aa*angle1)

  const x3 = x2 - side3 + outerRadius*(Math.tan(aa*angle1/2) + 1/Math.tan(aa*angle2/2))
  const y3 = y2

  const x4 = x3 - outerRadius*Math.sin(aa*angle2) + l2*Math.cos(aa*angle2) - (outerRadius - thickness)*Math.sin(aa*angle2)
  const y4 = y3 + outerRadius*Math.cos(aa*angle2) + l2*Math.sin(aa*angle2) + (outerRadius - thickness)*Math.cos(aa*angle2)

  const predefinedPoints = [
    { id: 1, type: 'line', x: 50 + radius, y: 150 - thickness, w: side1 - radius - outerRadius / Math.tan(aa * angle1 / 2), h: thickness, angle: 0 },
    { id: 2, type: 'line', x: 50, y: 150 - side4 + radius, w: thickness, h: side4 - 2 * radius, angle: 0 },
    { id: 3, type: 'line', x: x3, y: y3 - outerRadius, w: side3 - outerRadius * (Math.tan(aa * angle1 / 2) + 1 / Math.tan(aa * angle2 / 2)), h: thickness, angle: 0 },
    { id: 4, type: 'line', x: 50 + radius, y: 150 - side4, w: x4 - 50 - radius, h: thickness, angle: 0 },
    { id: 5, type: 'line', x: 50 + side1 - outerRadius / Math.tan(aa * angle1 / 2) + (outerRadius - thickness) * Math.sin(aa * angle1), y: 150 - outerRadius - (outerRadius - thickness) * Math.cos(aa * angle1), w: l, h: thickness, angle: angle1 - 180 },
    { id: 6, type: 'line', x: x3 - (outerRadius - thickness) * Math.sin(aa * angle2), y: y3 + (outerRadius - thickness) * Math.cos(aa * angle2), w: l2, h: thickness, angle: angle2 },
    { id: 7, type: 'circle', x: 50 + radius, y: 150 - radius, r: radius, angle: 90, rotation: 90, t: thickness },
    { id: 8, type: 'circle', x: 50 + side1 - outerRadius / Math.tan(aa * angle1 / 2), y: 150 - outerRadius, r: outerRadius, angle: 180 - angle1, rotation: angle1 - 90, t: thickness },
    { id: 9, type: 'circle', x: 50 + radius, y: 150 - side4 + radius, r: radius, angle: 90, rotation: 180, t: thickness },
    { id: 10, type: 'circle', x: x2, y: y2, r: outerRadius, angle: angle1, rotation: 270, t: thickness },
    { id: 11, type: 'circle', x: x3, y: y3, r: outerRadius, angle: 180 - angle2, rotation: 90 + angle2, t: thickness },
    { id: 12, type: 'circle', x: x4, y: y4, r: outerRadius, angle: 180 - angle2, rotation: angle2 - 90, t: thickness },
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

  

  return (
    <div style={{ position: 'relative' }}>
      <div className="form-check form-switch" style={{color: 'white', backgroundColor: '#1b065c'}}>
            <input title={Props.title1} onClick={clickOndimensioning} className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" style={{color: '#1b065c', transform: 'translateY(0px) translateX(4px)'}}/>
            <label className="form-check-label" htmlFor="flexSwitchCheckDefault" >DIMENSIONING FUNCTION</label>
          </div>
      <svg viewBox={viewBox} style={{ width: '100%', height: '61vh', backgroundColor: '#f9f9f9', border: '1px solid #ccc' }} onMouseDown={handleMouseDown} onTouchStart={handleTouchStart} >
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

        {dimensioning && <PredefinedPoints points={translatedPoints} mx={mx} thickness={thickness}/>}

        {/* L Shape */}
        <rect x={50 + radius + 100 - a} y={150 - thickness + 100 - b} width={side1 - radius - outerRadius/Math.tan(aa*angle1/2)} height={thickness} fill="black" />
        <rect x={50 + 100 - a} y={150 - side4 + radius + 100 - b} width={thickness} height={side4 - 2*radius} fill="black" />
        <rect x={x3 + 100 - a} y={y3 - outerRadius + 100 - b} width={side3 - outerRadius*(Math.tan(aa*angle1/2) + 1/Math.tan(aa*angle2/2))} height={thickness} fill="black" />
        <rect x={50 + radius + 100 - a} y={150 - side4 + 100 - b} width={x4 - 50 - radius} height={thickness} fill="black" />

        <LineAtTheta x={50 + side1 - outerRadius/Math.tan(aa*angle1/2) + (outerRadius - thickness)*Math.sin(aa*angle1) + 100 - a} y={150 - outerRadius - (outerRadius - thickness)*Math.cos(aa*angle1) + 100 - b} w={l} h={thickness} angle={angle1 - 180}/>    
        <LineAtTheta x={x3 - (outerRadius - thickness)*Math.sin(aa*angle2) + 100 - a} y={y3 + (outerRadius - thickness)*Math.cos(aa*angle2) + 100 - b} w={l2} h={thickness} angle={angle2}/>    

        {/* outer radius */}
        <CircleSector radius={radius} centerX={50 + radius + 100 - a} centerY={150 - radius + 100 - b} angle={90} rotation={90} thickness={thickness}/>      
        <CircleSector radius={outerRadius} centerX={50 + side1 - outerRadius/Math.tan(aa*angle1/2) + 100 - a} centerY={150 - outerRadius + 100 - b} angle={180 - angle1} rotation={angle1 - 90} thickness={thickness}/>  
        <CircleSector radius={radius} centerX={50 + radius + 100 - a} centerY={150 - side4 + radius + 100 - b} angle={90} rotation={180} thickness={thickness}/>  
        <CircleSector radius={outerRadius} centerX={x2 + 100 - a} centerY={y2 + 100 - b} angle={angle1} rotation={270} thickness={thickness}/>  
        <CircleSector radius={outerRadius} centerX={x3 + 100 - a} centerY={y3 + 100 - b} angle={180 - angle2} rotation={90 + angle2} thickness={thickness}/>  
        <CircleSector radius={outerRadius} centerX={x4 + 100 - a} centerY={y4 + 100 - b} angle={180 - angle2} rotation={angle2 - 90} thickness={thickness}/>

        {/* Horizontal Arrow for side2 */}
        <Linex x1={50 + 100 - a} x2={50 + side1 + 100 - a} y1={155 + 100 - b} y2={155 + 100 - b} text={'A'} val={side11} textHeight={5}/>

        {/* Horizontal Arrow for side2 */}
        <Linex x1={x3 - outerRadius/Math.tan(aa*angle2/2) + 100 - a} x2={x2 + outerRadius*Math.tan(aa*angle1/2) + 100 - a} y1={145 - side2 + 100 - b} y2={145 - side2 + 100 - b} text={'C'} val={side33} textHeight={-5}/>

        {/* Vertical Arrow for A */}
        <Liney x1={5 + x2 + outerRadius + 100 - a} x2={5 + x2 + outerRadius + 100 - a} y1={150 - side2 + 100 - b} y2={150 + 100 - b} text={'B'} val={side22} textHeight={17}/>

        {/* Vertical Arrow for A */}
        <Liney x1={45 + 100 - a} x2={45 + 100 - a} y1={150 - side4 + 100 - b} y2={150 + 100 - b} text={'D'} val={side44} textHeight={-17}/>

        {/* Horizontal Arrow for side2 */}
        <Linex x1={x4 - 10 + 100 - a} x2={x4 - 10 + 100 - a} y1={y4 - 10 + 100 - b} y2={y4 - 10 + 100 - b} text={'θ2'} val={angle22} textHeight={7} unit={" "}/>

        {/* Horizontal Arrow for side2 */}
        <Linex x1={x1 - 10 + 100 - a} x2={x1 - 10 + 100 - a} y1={y1 - 10 + 100 - b} y2={y1 - 10 + 100 - b} text={'θ1'} val={angle11} textHeight={7} unit={" "}/>

      
      </svg>
      <button title={Props.title3} className='btn btn mx-2 my-2' onClick={zoomIn} style={{color: 'white', backgroundColor: '#1b065c'}}><i className="fa-solid fa-magnifying-glass-plus"></i></button>
      <button title={Props.title6} className='btn btn mx-2 my-2' onClick={resetZoom} style={{color: 'white', backgroundColor: '#1b065c'}}><i className="fa-solid fa-maximize"></i> </button>
      <button title={Props.title4} className='btn btn mx-2 my-2' onClick={zoomOut} style={{color: 'white', backgroundColor: '#1b065c'}}> <i className="fa-solid fa-magnifying-glass-minus"></i> </button>
    </div>
  );
}

export default Al_skirt_rail_graph;
