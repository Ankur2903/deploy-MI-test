import { useState, useCallback, useEffect } from 'react';
import CircleSector from './Shap/Circle';
import * as Props from '../constant';
import Linex from './Shap/Linex';
import Liney from './Shap/Liney';
import LineAtTheta from './Shap/LineAtθ';
import { COM } from '../AdvanceOutput/COM';
import { ComputeMomentOfInertia } from '../AdvanceOutput/MomentOfInertia';
import PredefinedPoints from '../PredefinedPoints';

function A_piller_graph({ side11, side22, side33, side44, side55, side66, side77, side88, radius11, radius22, radius33, radius44, radius55, angle11, angle22, thickness1, outerRadius1, sendValue}) {
  const aa = Math.PI/180;
  const mx = Math.max(side11, side55);
  const thickness = (thickness1/mx)*Props.ratio
  const side1 = (side11/mx)*Props.ratio
  const side2 = (side22/mx)*Props.ratio
  const side3 = (side33/mx)*Props.ratio
  const side4 = (side44/mx)*Props.ratio
  const side5 = (side55/mx)*Props.ratio
  const side6 = (side66/mx)*Props.ratio
  const side7 = (side77/mx)*Props.ratio
  const side8 = (side88/mx)*Props.ratio
  const angle1 = angle11
  const angle2 = angle22
  const radius1 = (radius11/mx)*Props.ratio
  const radius2 = (radius22/mx)*Props.ratio
  const radius3 = (radius33/mx)*Props.ratio
  const radius4 = (radius44/mx)*Props.ratio
  const radius5 = (radius55/mx)*Props.ratio
  const outerRadius = (outerRadius1/mx)*Props.ratio

  const l2 = (side8 - thickness + radius5  + side2 - radius5/Math.tan(aa*angle1/2) - side5)/(Math.cos(aa*angle1)) 
  const l1 = side1 - radius4 - radius5 - l2*Math.sin(aa*angle1) + thickness - side3 - side4 
  const l3 = (radius3 - radius3*Math.sin(aa*angle2) + radius2*Math.sin(aa*angle2) + side7 - radius2/Math.tan(aa*angle2/2) + side6 - side5)/(Math.cos(aa*angle2))
  const l4 = side1 - radius4 + radius3*Math.cos(angle2*aa) - l3*Math.sin(aa*angle2) - radius2 - radius2*Math.cos(aa*angle2)

  const predefinedPoints = [
    { id: 1, type: 'line', x: 50 + side1 - side4 - side3 + outerRadius, y: 150 - thickness, w: side3 - 2 * outerRadius, h: thickness, angle: 0 },
    { id: 2, type: 'line', x: 50 + side1 - side4 - side3, y: 150 - side2 + radius5 / Math.tan(aa * angle1 / 2), w: thickness, h: side2 - outerRadius - radius5 / Math.tan(aa * angle1 / 2), angle: 0 },
    { id: 3, type: 'line', x: 50 + side1 - side4 - thickness, y: 150 - side6 + radius1 - thickness, w: thickness, h: side6 - outerRadius - radius1 + thickness, angle: 0 },
    { id: 4, type: 'line', x: 50 + side1 - side4 - thickness + radius1, y: 150 - side6 - thickness, w: side4 - outerRadius - radius1 + thickness, h: thickness, angle: 0 },
    { id: 5, type: 'line', x: 50 + side1 - thickness, y: 150 - side6 - side7 + radius2 / Math.tan(aa * angle2 / 2), w: thickness, h: side7 - outerRadius - radius2 / Math.tan(aa * angle2 / 2), angle: 0 },
    { id: 6, type: 'line', x: 50, y: 150 - side5 + radius4, w: thickness, h: side8 - 2 * radius4, angle: 0 },
    { id: 7, type: 'line', x: 50 + radius4, y: 150 - side5, w: l4, h: thickness, angle: 0 },
    { id: 8, type: 'line', x: 50 + radius4, y: 150 - side5 + side8 - thickness, w: l1, h: thickness, angle: 0 },
    { id: 9, type: 'line', x: 50 + radius4 + l4 - radius3 * Math.cos(aa * angle2), y: 150 - side5 + radius3 - radius3 * Math.sin(aa * angle2), w: l3, h: thickness, angle: angle2 - 90 },
    { id: 10, type: 'line', x: 50 + radius4 + l1 - radius5 * Math.cos(aa * angle1), y: 150 - side5 + side8 - thickness + radius5 - radius5 * Math.sin(aa * angle1), w: l2, h: thickness, angle: angle1 - 90 },
    { id: 11, type: 'circle', x: 50 + side1 - side4 - side3 + outerRadius, y: 150 - outerRadius, r: outerRadius, angle: 90, rotation: 90, t: thickness },
    { id: 12, type: 'circle', x: 50 + side1 - side4 - outerRadius, y: 150 - outerRadius, r: outerRadius, angle: 90, rotation: 0, t: thickness },
    { id: 13, type: 'circle', x: 50 + side1 - side4 - thickness + radius1, y: 150 - side6 + radius1 - thickness, r: radius1, angle: 90, rotation: 180, t: thickness },
    { id: 14, type: 'circle', x: 50 + side1 - outerRadius, y: 150 - side6 - outerRadius, r: outerRadius, angle: 90, rotation: 0, t: thickness },
    { id: 15, type: 'circle', x: 50 + side1 - radius2, y: 150 - side6 - side7 + radius2 / Math.tan(aa * angle2 / 2), r: radius2, angle: 180 - angle2, rotation: angle2 - 180, t: thickness },
    { id: 16, type: 'circle', x: 50 + side1 - side4 - side3 - radius5 + thickness, y: 150 - side2 + radius5 / Math.tan(aa * angle1 / 2), r: radius5, angle: 180 - angle1, rotation: angle1 - 180, t: thickness },
    { id: 17, type: 'circle', x: 50 + radius4, y: 150 - side5 + radius4, r: radius4, angle: 90, rotation: 180, t: thickness },
    { id: 18, type: 'circle', x: 50 + radius4, y: 150 - side5 + side8 - radius4, r: radius4, angle: 90, rotation: 90, t: thickness },
    { id: 19, type: 'circle', x: 50 + radius4 + l4, y: 150 - side5 + radius3, r: radius3, angle: angle2 - 90, rotation: 270, t: thickness },
    { id: 20, type: 'circle', x: 50 + radius4 + l1, y: 150 - side5 + side8 - thickness + radius5, r: radius5, angle: angle1 - 90, rotation: 270, t: thickness }
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

        {dimensioning && <PredefinedPoints points={translatedPoints} mx={mx} thickness={thickness} scale={scale}/>}

        {/* L Shape */}
        <rect x={50 + side1 - side4 - side3 + outerRadius + 100 - a} y={150 - thickness + 100 - b} width={side3 - 2*outerRadius} height={thickness} fill="black" />
        <rect x={50 + side1 - side4 - side3 + 100 - a} y={150 - side2 + radius5/Math.tan(aa*angle1/2) + 100 - b} width={thickness} height={side2 - outerRadius - radius5/Math.tan(aa*angle1/2)} fill="black"/>
        <rect x={50 + side1 - side4 - thickness + 100 - a} y={150  - side6 + radius1 - thickness + 100 - b} width={thickness} height={side6 - outerRadius - radius1 + thickness} fill="black"/>
        <rect x={50 + side1 - side4 - thickness + radius1 + 100 - a} y={150  - side6 - thickness + 100 - b} width={side4 - outerRadius - radius1 + thickness} height={thickness} fill="black"/>
        <rect x={50 + side1 - thickness + 100 - a} y={150  - side6 - side7 + radius2/Math.tan(aa*angle2/2) + 100 - b} width={thickness} height={side7 - outerRadius - radius2/Math.tan(aa*angle2/2)} fill="black"/>
        <rect x={50 + 100 - a} y={150  - side5 + radius4 + 100 - b} width={thickness} height={side8 - 2*radius4} fill="black"/>
        <rect x={50 + radius4 + 100 - a} y={150  - side5 + 100 - b} width={l4} height={thickness} fill="black"/>
        <rect x={50 + radius4 + 100 - a} y={150  - side5 + side8 - thickness + 100 - b} width={l1} height={thickness} fill="black"/>

        <LineAtTheta x={50 + radius4 + l4 - radius3*Math.cos(aa*angle2) + 100 - a} y={150 - side5 + radius3 - radius3*Math.sin(aa*angle2) + 100 - b} w={l3} h={thickness} angle={angle2 - 90}/>   
        <LineAtTheta x={50 + radius4 + l1 - radius5*Math.cos(aa*angle1) + 100 - a} y={150 - side5 + side8 - thickness + radius5 - radius5*Math.sin(aa*angle1) + 100 - b} w={l2} h={thickness} angle={angle1 - 90}/>  

        {/* outer radius */}
        <CircleSector radius={outerRadius} centerX={50 + side1 - side4 - side3 + outerRadius + 100 - a} centerY={150 - outerRadius + 100 - b} angle={90} rotation={90} thickness={thickness}/>   
        <CircleSector radius={outerRadius} centerX={50 + side1 - side4 - outerRadius + 100 - a} centerY={150 - outerRadius + 100 - b} angle={90} rotation={0} thickness={thickness}/>     
        <CircleSector radius={radius1} centerX={50 + side1 - side4 - thickness + radius1 + 100 - a} centerY={150  - side6 + radius1 - thickness + 100 - b} angle={90} rotation={180} thickness={thickness}/> 
        <CircleSector radius={outerRadius} centerX={50 + side1 - outerRadius + 100 - a} centerY={150  - side6 - outerRadius + 100 - b} angle={90} rotation={0} thickness={thickness}/> 
        <CircleSector radius={radius2} centerX={50 + side1 - radius2 + 100 - a} centerY={150  - side6 - side7 + radius2/Math.tan(aa*angle2/2) + 100 - b} angle={180 - angle2} rotation={angle2 - 180} thickness={thickness}/> 
        <CircleSector radius={radius5} centerX={50 + side1 - side4 - side3 - radius5 + thickness + 100 - a} centerY={150 - side2 + radius5/Math.tan(aa*angle1/2) + 100 - b} angle={180 - angle1} rotation={angle1 - 180} thickness={thickness}/> 
        <CircleSector radius={radius4} centerX={50 + radius4 + 100 - a} centerY={150 - side5 + radius4 + 100 - b} angle={90} rotation={180} thickness={thickness}/> 
        <CircleSector radius={radius4} centerX={50 + radius4 + 100 - a} centerY={150 - side5 + side8 - radius4 + 100 - b} angle={90} rotation={90} thickness={thickness}/> 
        <CircleSector radius={radius3} centerX={50 + radius4 + l4 + 100 - a} centerY={150 - side5 + radius3 + 100 - b} angle={angle2 - 90} rotation={270} thickness={thickness}/> 
        <CircleSector radius={radius5} centerX={50 + radius4 + l1 + 100 - a} centerY={150 - side5 + side8 - thickness + radius5 + 100 - b} angle={angle1 - 90} rotation={270} thickness={thickness}/> 

        {/* Vertical Arrow for E */}
        <Liney x1={12 + 100 - a} x2={12 + 100 - a} y1={150 - side5 + 100 - b} y2={150 + 100 - b} text={'E'} val={side55} textHeight={17}/>

        {/* Vertical Arrow for H */}
        <Liney x1={45 + 100 - a} x2={45 + 100 - a} y1={150 - side5 + 100 - b} y2={150 - side5 + side8 + 100 - b} text={'H'} val={side88} textHeight={-17}/>

        {/* Vertical Arrow for B */}
        <Liney x1={45 + side1 - side4 - side3 + 100 - a} x2={45 + side1 - side4 - side3 + 100 - a} y1={150 - side2 + 100 - b} y2={150 + 100 - b} text={'B'} val={side22} textHeight={-17}/>

        {/* Vertical Arrow for G */}
        <Liney x1={55 + side1 + 100 - a} x2={55 + side1 + 100 - a} y1={150 - side6 - side7 + 100 - b} y2={150 - side6 + 100 - b} text={'G'} val={side77} textHeight={17}/>

        {/* Vertical Arrow for F */}
        <Liney x1={55 + side1 + 100 - a} x2={55 + side1 + 100 - a} y1={150 - side6 + 100 - b} y2={150 + 100 - b} text={'F'} val={side66} textHeight={17}/>

        {/* Horizontal Arrows */}
        <Linex x1={50 + 100 - a} x2={50 + side1 + 100 - a} y1={165 + 100 - b} y2={165 + 100 - b} text={'A'} val={side11} textHeight={5}/>
        <Linex x1={50 + side1 - side4 + 100 - a} x2={50 + side1 + 100 - a} y1={155 - side6 + 100 - b} y2={155 - side6 + 100 - b} text={'D'} val={side44} textHeight={5}/>
        <Linex x1={50 + side1 - side4 - side3 + 100 - a} x2={50 + side1 - side4 + 100 - a} y1={155 + 100 - b} y2={155 + 100 - b} text={'C'} val={side33} textHeight={7}/>
        <Linex x1={35 + side1 - side4 - side3 + 100 - a} x2={35 + side1 - side4 - side3 + 100 - a} y1={155 - side2 + 100 - b} y2={155 - side2 + 100 - b} text={'θ1'} val={angle11} textHeight={7} unit={" "}/>
        <Linex x1={35 + side1 + 100 - a} x2={35 + side1 + 100 - a} y1={155 - side6 - side7 + 100 - b} y2={155 - side6 - side7 + 100 - b} text={'θ2'} val={angle22} textHeight={7} unit={" "}/>
        <Linex x1={50 + radius4 + l4 + 100 - a} x2={50 + radius4 + l4 + radius3 + 100 - a} y1={145 - side5 + 100 - b} y2={145 - side5 + 100 - b} text={'R3'} val={radius33} textHeight={-5}/>
        <Linex x1={50 + radius4 + l1 + 100 - a} x2={50 + radius4 + l1 + radius5 + 100 - a} y1={155 - side5 + side8 + 100 - b} y2={155 - side5 + side8 + 100 - b} text={'R5'} val={radius55} textHeight={5}/>
        <Linex x1={50 + side1 - radius2 + 100 - a} x2={50 + side1 + 100 - a} y1={145 - side6 - side7 + 100 - b} y2={145 - side6 - side7 + 100 - b} text={'R2'} val={radius22} textHeight={-5}/>
        <Linex x1={50 + 100 - a} x2={50 + radius4 + 100 - a} y1={145 - side5 + 100 - b} y2={145 - side5 + 100 - b} text={'R4'} val={radius44} textHeight={-5}/>
        <Linex x1={50 + side1 - side4 - thickness + 100 - a} x2={50 + side1 - side4 - thickness + radius1 + 100 - a} y1={145 - side6 + 100 - b} y2={145 - side6 + 100 - b} text={'R1'} val={radius11} textHeight={-5}/>

        
      
      </svg>
      <button title={Props.title3} className='btn btn mx-2 my-2' onClick={zoomIn} style={{color: 'white', backgroundColor: '#1b065c'}}><i className="fa-solid fa-magnifying-glass-plus"></i></button>
      <button title={Props.title6} className='btn btn mx-2 my-2' onClick={resetZoom} style={{color: 'white', backgroundColor: '#1b065c'}}><i className="fa-solid fa-maximize"></i> </button>
      <button title={Props.title4} className='btn btn mx-2 my-2' onClick={zoomOut} style={{color: 'white', backgroundColor: '#1b065c'}}> <i className="fa-solid fa-magnifying-glass-minus"></i> </button>
    </div>
  );
}

export default A_piller_graph;
