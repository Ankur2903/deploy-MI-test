import { useState, useCallback, useEffect } from 'react';
import CircleSector from './Shap/Circle';
import * as Props from '../constant';
import Linex from './Shap/Linex';
import Liney from './Shap/Liney';
import LineAtTheta from './Shap/LineAtθ';
import { COM } from '../AdvanceOutput/COM';
import { ComputeMomentOfInertia } from '../AdvanceOutput/MomentOfInertia';
import PredefinedPoints from '../PredefinedPoints';

function A_post_graph({ side11, side22, side33, side44, angle1, r11, thickness1, outerRadius1, sendValue}) {
  const aa = Math.PI/180
  const mx = Math.max(side11 + side33, side11 + side33 - side33*Math.cos(aa*angle1), side11 + side33 - side33*Math.cos(aa*angle1) - side22*Math.sin(aa*angle1) +  - side11*Math.cos(aa*angle1))
  const side1 = (side11*Props.ratio)/mx
  const side2 = (side22*Props.ratio)/mx
  const side3 = (side33*Props.ratio)/mx
  const side4 = (side44*Props.ratio)/mx
  const r1 = (r11*Props.ratio)/mx
  const thickness = (thickness1*Props.ratio)/mx
  const outerRadius = (outerRadius1*Props.ratio)/mx

  const x1 = 50 + side1 + side3 - r1/Math.tan(angle1*aa/2)
  const y1 = 50 + r1

  const x2 = x1 + r1*Math.sin(aa*angle1) - (side3 - outerRadius - r1/Math.tan(aa*angle1/2))*Math.cos(aa*angle1) - outerRadius*Math.sin(aa*angle1) 
  const y2 = y1 + r1*Math.cos(aa*angle1) + (side3 - outerRadius - r1/Math.tan(aa*angle1/2))*Math.sin(aa*angle1) - outerRadius*Math.cos(aa*angle1)

  const x3 = x2 - (side2 - 2*outerRadius + thickness)*Math.sin(aa*angle1) - (2*outerRadius - thickness)*Math.cos(aa*angle1)
  const y3 = y2 - (side2 - 2*outerRadius + thickness)*Math.cos(aa*angle1) + (2*outerRadius - thickness)*Math.sin(aa*angle1)

  const x4 = x3 - (outerRadius - thickness)*Math.sin(aa*angle1) - (side1 - 2*outerRadius + thickness)*Math.cos(aa*angle1) - outerRadius*Math.sin(aa*angle1)
  const y4 = y3 - (outerRadius - thickness)*Math.cos(aa*angle1) + (side1 - 2*outerRadius + thickness)*Math.sin(aa*angle1) - outerRadius*Math.cos(aa*angle1)

  const l = (x4 - outerRadius - 50  - (side4 - outerRadius - outerRadius*Math.tan(angle1*aa/4))*Math.sin(aa*angle1))/Math.sin(aa*angle1/2)

  const predefinedPoints = [
    { id: 1, type: 'line', x: 50 + outerRadius, y: 50 + side2, w: side1 - 2 * outerRadius + thickness, h: thickness, angle: 0 },
    { id: 2, type: 'line', x: 50 + side1, y: 50 + outerRadius, w: thickness, h: side2 - 2 * outerRadius + thickness, angle: 0 },
    { id: 3, type: 'line', x: 50 + side1 + outerRadius, y: 50, w: side3 - outerRadius - r1 / Math.tan(angle1 * aa / 2), h: thickness, angle: 0 },
    { id: 4, type: 'line', x: 50, y: 50 + side2 + outerRadius, w: thickness, h: side4 - outerRadius - outerRadius * Math.tan(aa * angle1 / 4), angle: 0 },
    { id: 5, type: 'line', x: x1 + r1 * Math.sin(aa * angle1), y: y1 + r1 * Math.cos(aa * angle1), w: side3 - outerRadius - r1 / Math.tan(angle1 * aa / 2), h: thickness, angle: 180 - angle1 },
    { id: 6, type: 'line', x: x2 - outerRadius * Math.cos(aa * angle1), y: y2 + outerRadius * Math.sin(aa * angle1), w: side2 - 2 * outerRadius + thickness, h: thickness, angle: 270 - angle1 },
    { id: 7, type: 'line', x: x3 - (outerRadius - thickness) * Math.sin(aa * angle1), y: y3 - (outerRadius - thickness) * Math.cos(aa * angle1), w: side1 - 2 * outerRadius + thickness, h: thickness, angle: 180 - angle1 },
    { id: 8, type: 'line', x: 50 + outerRadius - (outerRadius - thickness) * Math.cos(aa * angle1 / 2), y: 50 + side2 + side4 - outerRadius * Math.tan(aa * angle1 / 4) + (outerRadius - thickness) * Math.sin(aa * angle1 / 2), w: l, h: thickness, angle: 90 - angle1 / 2 },
    { id: 9, type: 'line', x: x4 - outerRadius * Math.cos(aa * angle1), y: y4 + outerRadius * Math.sin(aa * angle1), w: side4 - outerRadius - outerRadius * Math.tan(aa * angle1 / 4), h: thickness, angle: 270 - angle1 },
    { id: 10, type: 'circle', x: 50 + outerRadius, y: 50 + side2 + outerRadius, r: outerRadius, angle: 90, rotation: 180, t: thickness },
    { id: 11, type: 'circle', x: 50 + side1 - outerRadius + thickness, y: 50 + side2 - outerRadius + thickness, r: outerRadius, angle: 90, rotation: 0, t: thickness },
    { id: 12, type: 'circle', x: 50 + side1 + outerRadius, y: 50 + outerRadius, r: outerRadius, angle: 90, rotation: 180, t: thickness },
    { id: 13, type: 'circle', x: x1, y: y1, r: r1, angle: 180 - angle1, rotation: 270, t: thickness },
    { id: 14, type: 'circle', x: x2, y: y2, r: outerRadius, angle: 90, rotation: 90 - angle1, t: thickness },
    { id: 15, type: 'circle', x: x3, y: y3, r: outerRadius, angle: 90, rotation: 270 - angle1, t: thickness },
    { id: 16, type: 'circle', x: x4, y: y4, r: outerRadius, angle: 90, rotation: 90 - angle1, t: thickness },
    { id: 17, type: 'circle', x: 50 + outerRadius, y: 50 + side2 + side4 - outerRadius * Math.tan(aa * angle1 / 4), r: outerRadius, angle: angle1 / 2, rotation: 180 - angle1 / 2, t: thickness },
    { id: 18, type: 'circle', x: x4 - (side4 - outerRadius - outerRadius * Math.tan(aa * angle1 / 4)) * Math.sin(aa * angle1), y: y4 - (side4 - outerRadius - outerRadius * Math.tan(aa * angle1 / 4)) * Math.cos(aa * angle1), r: outerRadius, angle: angle1 / 2, rotation: 180 - angle1, t: thickness },
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
            <input title={Props.title1} className="form-check-input" onClick={clickOndimensioning} type="checkbox" role="switch" id="flexSwitchCheckDefault" style={{color: '#1b065c', transform: 'translateY(0px) translateX(4px)'}}/>
            <label className="form-check-label" htmlFor="flexSwitchCheckDefault">DIMENSIONING FUNCTION</label>
          </div>
      <svg
        viewBox={viewBox}
        style={{ width: '100%', height: '61vh', backgroundColor: '#f9f9f9', border: '1px solid #ccc' }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        
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

{dimensioning && <PredefinedPoints points={translatedPoints} mx={mx} thickness={thickness} scale={scale}/>}

        {/* L Shape */}
        <rect x={50 + outerRadius + 100 - a} y={50 + side2 + 100 - b} width={side1 - 2*outerRadius + thickness} height={thickness} fill="black" />
        <rect x={50 + side1 + 100 - a} y={50 + outerRadius + 100 - b} width={thickness} height={side2 - 2*outerRadius + thickness} fill="black" />
        <rect x={50 + side1 + outerRadius + 100 - a} y={50 + 100 - b} width={side3 - outerRadius - r1/Math.tan(angle1*aa/2)} height={thickness} fill="black" />
        <rect x={50 + 100 - a} y={50 + side2 + outerRadius + 100 - b} width={thickness} height={side4 - outerRadius - outerRadius*Math.tan(aa*angle1/4)} fill="black" />
        <LineAtTheta x={x1 + r1*Math.sin(aa*angle1) + 100 - a} y={y1 + r1*Math.cos(aa*angle1) + 100 - b} w={side3 - outerRadius - r1/Math.tan(angle1*aa/2)} h={thickness} angle={180 - angle1} fill="black" />
        <LineAtTheta x={x2 - outerRadius*Math.cos(aa*angle1) + 100 - a} y={y2 + outerRadius*Math.sin(aa*angle1) + 100 - b} w={side2 - 2*outerRadius + thickness} h={thickness} angle={270 - angle1} fill="black" />
        <LineAtTheta x={x3 - (outerRadius - thickness)*Math.sin(aa*angle1) + 100 - a} y={y3 - (outerRadius - thickness)*Math.cos(aa*angle1) + 100 - b} w={side1 - 2*outerRadius +thickness} h={thickness} angle={180 - angle1} fill="black" />
        <LineAtTheta x={50 + outerRadius - (outerRadius - thickness)*Math.cos(aa*angle1/2) + 100 - a} y={50 + side2 + side4 - outerRadius*Math.tan(aa*angle1/4) + (outerRadius - thickness)*Math.sin(aa*angle1/2) + 100 - b} w={l} h={thickness} angle={90 - angle1/2} fill="black" />
        <LineAtTheta x={x4 - outerRadius*Math.cos(aa*angle1) + 100 - a} y={y4 + outerRadius*Math.sin(aa*angle1) + 100 - b} w={side4  - outerRadius - outerRadius*Math.tan(aa*angle1/4)} h={thickness} angle={270 - angle1} fill="black" />
        <CircleSector radius={outerRadius} centerX={50 + outerRadius + 100 - a} centerY={50 + side2 + outerRadius + 100 - b} angle={90} rotation={180} thickness={thickness}/>
        <CircleSector radius={outerRadius} centerX={50 + side1 - outerRadius + thickness + 100 - a} centerY={50 +  side2 - outerRadius + thickness + 100 - b} angle={90} rotation={0} thickness={thickness}/>
        <CircleSector radius={outerRadius} centerX={50 + side1 + outerRadius + 100 - a} centerY={50 + outerRadius + 100 - b} angle={90} rotation={180} thickness={thickness}/>
        <CircleSector radius={r1} centerX={x1 + 100 - a} centerY={y1 + 100 - b} angle={180 - angle1} rotation={270} thickness={thickness}/>
        <CircleSector radius={outerRadius} centerX={x2 + 100 - a} centerY={y2 + 100 - b} angle={90} rotation={90 - angle1} thickness={thickness}/>
        <CircleSector radius={outerRadius} centerX={x3 + 100 - a} centerY={y3 + 100 - b} angle={90} rotation={270 - angle1} thickness={thickness}/>
        <CircleSector radius={outerRadius} centerX={x4 + 100 - a} centerY={y4 + 100 - b} angle={90} rotation={90 - angle1} thickness={thickness}/>
        <CircleSector radius={outerRadius} centerX={50 + outerRadius + 100 - a} centerY={50 + side2 + side4 - outerRadius*Math.tan(aa*angle1/4) + 100 - b} angle={angle1/2} rotation={180 - angle1/2} thickness={thickness}/>
        <CircleSector radius={outerRadius} centerX={x4 - (side4 - outerRadius - outerRadius*Math.tan(aa*angle1/4))*Math.sin(aa*angle1) + 100 - a} centerY={y4 - (side4 - outerRadius - outerRadius*Math.tan(aa*angle1/4))*Math.cos(aa*angle1) + 100 - b} angle={angle1/2} rotation={180 - angle1} thickness={thickness}/>
        <Linex x1={50 + side1 + 100 - a} x2={50 + side1 + side3 + 100 - a} y1={45 + 100 - b} y2={45 + 100 - b} text={'C'} val={side33} textHeight={-10}/>
        <Linex x1={50 + 100 - a} x2={50 + side1 + 100 - a} y1={45 + side2 + 100 - b} y2={45 + side2 + 100 - b} text={'A'} val={side11} textHeight={-10}/>
        <Liney x1={57 + side1 + 100 - a} x2={57 + side1 + 100 - a} y1={50 + 100 - b} y2={50 + side2 + 100 - b} text={'B'} val={side22} textHeight={17}/>
        <Liney x1={45 + 100 - a} x2={45 + 100 - a} y1={50 + side2 + 100 - b} y2={50 + side2 + side4 + 100 - b} text={'D'} val={side44} textHeight={-17}/>
        <Liney x1={55 + side1 + side3 + 100 - a} x2={55 + side1 + side3 + 100 - a} y1={50 + 100 - b} y2={50 + r1 + 100 - b} text={'R1'} val={r11} textHeight={17}/>

      
      </svg>
      <button title={Props.title3} className='btn btn mx-2 my-2' onClick={zoomIn} style={{color: 'white', backgroundColor: '#1b065c'}}><i className="fa-solid fa-magnifying-glass-plus"></i></button>
      <button title={Props.title6} className='btn btn mx-2 my-2' onClick={resetZoom} style={{color: 'white', backgroundColor: '#1b065c'}}><i className="fa-solid fa-maximize"></i> </button>
      <button title={Props.title4} className='btn btn mx-2 my-2' onClick={zoomOut} style={{color: 'white', backgroundColor: '#1b065c'}}> <i className="fa-solid fa-magnifying-glass-minus"></i> </button>
    </div>
  );
}

export default A_post_graph;
