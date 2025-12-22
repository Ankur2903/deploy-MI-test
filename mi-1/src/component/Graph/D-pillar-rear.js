import { useState, useCallback, useEffect } from 'react';
import CircleSector from './Shap/Circle';
import * as Props from '../constant';
import Linex from './Shap/Linex';
import Liney from './Shap/Liney';
import LineAtTheta from './Shap/LineAtθ';
import { COM } from '../AdvanceOutput/COM';
import { ComputeMomentOfInertia } from '../AdvanceOutput/MomentOfInertia';
import PredefinedPoints from '../PredefinedPoints';
import { ComputePrincipalAxisAngle } from '../AdvanceOutput/PrincipalAxisAngle';

function D_pillar_rear_graph({ side11, side22, side33, side44, side55, radius11, radius22, radius33, radius44, angle1, angle2, angle3, angle4, thickness1, outerRadius1, sendValue}) {
  const aa = Math.PI/180;
  const mx = Math.max(side11 + side22, side55 + radius11);
  const thickness = (thickness1/mx)*Props.ratio
  const side1 = (side11/mx)*Props.ratio
  const side2 = (side22/mx)*Props.ratio
  const side3 = (side33/mx)*Props.ratio
  const side4 = (side44/mx)*Props.ratio
  const side5 = (side55/mx)*Props.ratio
  const radius1 = (radius11/mx)*Props.ratio
  const radius2 = (radius22/mx)*Props.ratio
  const radius3 = (radius33/mx)*Props.ratio
  const radius4 = (radius44/mx)*Props.ratio
  const outerRadius = (outerRadius1/mx)*Props.ratio

  const angle5 = 270 - angle1 - angle2 + angle3 - angle4
  const l1 = side4/Math.sin(aa*angle1) - outerRadius*(1/Math.tan(aa*angle1/2) + 1/Math.tan(aa*angle2/2))

  const x1 = 50 + side1 + side2 - radius1 - (radius1 - radius4)*Math.cos(aa*angle5)
  const y1 = 150 - side5 - (radius1 - radius4)*Math.sin(aa*angle5)

  const x2 = 50 + outerRadius/Math.tan(aa*angle1/2) + l1*Math.cos(aa*angle1)
  const y2 = 150 - side3 - outerRadius - l1*Math.sin(aa*angle1)

  const  l2 = -(side1 + side2 - radius1 - (radius1 - radius4)*(Math.cos(aa*angle5) + Math.sin(aa*angle5)/Math.tan(aa*(angle1 + angle2 - angle3))) - radius4*(Math.sin(aa*(angle1 + angle2 - angle3)) + Math.cos(aa*(angle1 + angle2 - angle3))/Math.tan(aa*(angle1 + angle2 - angle3))) + side3/Math.tan(aa*(angle1 + angle2 - angle3)) - side5/Math.tan(aa*(angle1 + angle2 - angle3)) - (l1 + outerRadius*(1/Math.tan(aa*angle1/2) + 1/Math.tan(aa*angle2/2)))*(Math.cos(aa*angle1) - Math.sin(aa*angle1)/Math.tan(aa*(angle1 + angle2 - angle3))))/(Math.cos(aa*(angle1 + angle2)) - Math.sin(aa*(angle1 + angle2))/Math.tan(aa*(angle1 + angle2 - angle3))) - outerRadius/Math.tan(aa*angle2/2) - (radius3 - thickness)/Math.tan(aa*angle3/2) 

  const l3 = (side5 - side3  + (radius1 - radius4)*Math.sin(aa*angle5) + radius4*Math.cos(aa*(angle1 + angle2 - angle3)) + (l2 + outerRadius/Math.tan(aa*angle2/2) + (radius3 - thickness)/Math.tan(aa*angle3/2))*Math.sin(aa*(angle1 + angle2)) - (l1 + outerRadius*(1/Math.tan(aa*angle1/2) + 1/Math.tan(aa*angle2/2)))*Math.sin(aa*angle1))/(Math.sin(aa*(angle1 + angle2 - angle3))) - (radius3 - thickness)/Math.tan(aa*angle3/2)

  const x3 = x2 + outerRadius*Math.sin(aa*(angle1 + angle2)) - l2*Math.cos(aa*(angle1 + angle2)) + (radius3 - thickness)*Math.sin(aa*(angle1 + angle2))
  const y3 = y2 + outerRadius*Math.cos(aa*(angle1 + angle2)) + l2*Math.sin(aa*(angle1 + angle2)) + (radius3 - thickness)*Math.cos(aa*(angle1 + angle2))

  const predefinedPoints = [
    { id: 1, type: 'line', x: 50 + outerRadius / Math.tan(aa * angle1 / 2), y: 150 - side3 - thickness, w: side1 - outerRadius / Math.tan(aa * angle1 / 2) - radius2 + thickness, h: thickness, angle: 0 },
    { id: 2, type: 'line', x: 50 + side1 + outerRadius, y: 150 - thickness, w: side2 - 2 * outerRadius, h: thickness, angle: 0 },
    { id: 3, type: 'line', x: 50 + side1 + side2 - thickness, y: 150 - side5, w: thickness, h: side5 - outerRadius, angle: 0 },
    { id: 4, type: 'line', x: 50 + side1, y: 150 - side3 + radius2 - thickness, w: thickness, h: side3 - outerRadius - radius2 + thickness, angle: 0 },
    { id: 5, type: 'line', x: 50 + outerRadius / Math.tan(aa * angle1 / 2) - outerRadius * Math.sin(aa * angle1), y: 150 - side3 - outerRadius - outerRadius * Math.cos(aa * angle1), w: l1, h: thickness, angle: -angle1 },
    { id: 6, type: 'line', x: x2 + outerRadius * Math.sin(aa * (angle1 + angle2)), y: y2 + outerRadius * Math.cos(aa * (angle1 + angle2)), w: l2, h: thickness, angle: 180 - angle1 - angle2 },
    { id: 7, type: 'line', x: x1 - (radius4 - thickness) * Math.sin(aa * (angle1 + angle2 - angle3)), y: y1 - (radius4 - thickness) * Math.cos(aa * (angle1 + angle2 - angle3)), w: l3, h: thickness, angle: 180 - angle1 - angle2 + angle3 },
    { id: 8, type: 'circle', x: 50 + side1 - radius2 + thickness, y: 150 - side3 + radius2 - thickness, r: radius2, angle: 90, rotation: 270, t: thickness },
    { id: 9, type: 'circle', x: 50 + side1 + outerRadius, y: 150 - outerRadius, r: outerRadius, angle: 90, rotation: 90, t: thickness },
    { id: 10, type: 'circle', x: 50 + side1 + side2 - outerRadius, y: 150 - outerRadius, r: outerRadius, angle: 90, rotation: 0, t: thickness },
    { id: 11, type: 'circle', x: 50 + outerRadius / Math.tan(aa * angle1 / 2), y: 150 - side3 - outerRadius, r: outerRadius, angle: 180 - angle1, rotation: 90, t: thickness },
    { id: 12, type: 'circle', x: 50 + side1 + side2 - radius1, y: 150 - side5, r: radius1, angle: 180 - angle5, rotation: angle5 - 180, t: thickness },
    { id: 13, type: 'circle', x: x1, y: y1, r: radius4, angle: 180 - angle4, rotation: angle5 + angle4, t: thickness },
    { id: 14, type: 'circle', x: x2, y: y2, r: outerRadius, angle: 180 - angle2, rotation: 270 - angle1, t: thickness },
    { id: 15, type: 'circle', x: x3, y: y3, r: radius3, angle: 180 - angle3, rotation: 90 - angle1 - angle2 + angle3, t: thickness },
  ];

  const {a, b} = COM(predefinedPoints)

  const translatedPoints = predefinedPoints.map(point => ({
    ...point,
    x: point.x + 100 - a,
    y: point.y + 100 - b
  }));
  const {Ix, Iy, sw, ol, acs, xmax, ymax, Ixy} = ComputeMomentOfInertia(predefinedPoints, a, b, mx, Props.ratio, thickness);
  const Paa = Math.atan(2*Ixy/(Ix - Iy))*90/Math.PI
  const Iu = (Paa <= 0) ? (Number(Ix) + Number(Iy))/2 - Math.sqrt(Math.pow((Number(Ix) - Number(Iy))/2, 2) + Ixy*Ixy) : (Number(Ix) + Number(Iy))/2 + Math.sqrt(Math.pow((Number(Ix) - Number(Iy))/2, 2) + Ixy*Ixy)
  const Iv = (Paa > 0) ? (Number(Ix) + Number(Iy))/2 - Math.sqrt(Math.pow((Number(Ix) - Number(Iy))/2, 2) + Ixy*Ixy) : (Number(Ix) + Number(Iy))/2 + Math.sqrt(Math.pow((Number(Ix) - Number(Iy))/2, 2) + Ixy*Ixy)
  const {umax, vmax} = ComputePrincipalAxisAngle(predefinedPoints, a, b, mx, Props.ratio, thickness, Paa);


  useEffect(() => {
    sendValue({ Ix, Iy, sw, ol, acs, xmax, ymax, Ixy, Paa, Iu, Iv, umax, vmax});// Send all consts as an object when the component mounts
  }, [Ix, Iy, sw, ol, acs, xmax, ymax, Ixy, Paa, Iu, Iv, umax, vmax]);


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
        <rect x={50 + outerRadius/Math.tan(aa*angle1/2) + 100 - a} y={150 - side3 - thickness + 100 - b} width={side1 - outerRadius/Math.tan(aa*angle1/2) - radius2 + thickness} height={thickness} fill="black" />
        <rect x={50 + side1 + outerRadius + 100 - a} y={150 - thickness + 100 - b} width={side2 - 2*outerRadius} height={thickness} fill="black" />
        <rect x={50 + side1 + side2 - thickness + 100 - a} y={150 - side5 + 100 - b} width={thickness} height={side5 - outerRadius} fill="black" />
        <rect x={50 + side1 + 100 - a} y={150 - side3 + radius2 - thickness + 100 - b} width={thickness} height={side3 - outerRadius - radius2 + thickness} fill="black" />

        <LineAtTheta x={50 + outerRadius/Math.tan(aa*angle1/2) - outerRadius*Math.sin(aa*angle1) + 100 - a} y={150 - side3 - outerRadius - outerRadius*Math.cos(aa*angle1) + 100 - b} w={l1} h={thickness} angle={-angle1}/>   
        <LineAtTheta x={x2 + outerRadius*Math.sin(aa*(angle1 + angle2)) + 100 - a} y={y2 + outerRadius*Math.cos(aa*(angle1 + angle2)) + 100 - b} w={l2} h={thickness} angle={180 - angle1 - angle2}/>  
        <LineAtTheta x={x1 - (radius4 - thickness)*Math.sin(aa*(angle1 + angle2 - angle3)) + 100 - a} y={y1 - (radius4 - thickness)*Math.cos(aa*(angle1 + angle2 - angle3)) + 100 - b} w={l3} h={thickness} angle={180 - angle1 - angle2 + angle3}/>  

        {/* outer radius */}
        <CircleSector radius={radius2} centerX={50 + side1 - radius2 + thickness + 100 - a} centerY={150 - side3 + radius2 - thickness + 100 - b} angle={90} rotation={270} thickness={thickness}/>  
        <CircleSector radius={outerRadius} centerX={50 + side1 + outerRadius + 100 - a} centerY={150 - outerRadius + 100 - b} angle={90} rotation={90} thickness={thickness}/>  
        <CircleSector radius={outerRadius} centerX={50 + side1 + side2 - outerRadius + 100 - a} centerY={150 - outerRadius + 100 - b} angle={90} rotation={0} thickness={thickness}/>  
        <CircleSector radius={outerRadius} centerX={50 + outerRadius/Math.tan(aa*angle1/2) + 100 - a} centerY={150 - side3 - outerRadius + 100 - b} angle={180 - angle1} rotation={90} thickness={thickness}/>  
        <CircleSector radius={radius1} centerX={50 + side1 + side2 - radius1 + 100 - a} centerY={150 - side5 + 100 - b} angle={180 - angle5} rotation={angle5 - 180} thickness={thickness}/>  
        <CircleSector radius={radius4} centerX={x1 + 100 - a} centerY={y1 + 100 - b} angle={180 - angle4} rotation={angle5 + angle4} thickness={thickness}/>  
        <CircleSector radius={outerRadius} centerX={x2 + 100 - a} centerY={y2 + 100 - b} angle={180 - angle2} rotation={270 - angle1} thickness={thickness}/>  
        <CircleSector radius={radius3} centerX={x3 + 100 - a} centerY={y3 + 100 - b} angle={180 - angle3} rotation={90 - angle1 - angle2 + angle3} thickness={thickness}/>  

        {/* Vertical Arrow for G */}
        <Liney x1={45 + 100 - a} x2={45 + 100 - a} y1={150 - side3 + 100 - b} y2={150 + 100 - b} text={'C'} val={side33} textHeight={-17}/>

        {/* Vertical Arrow for G */}
        <Liney x1={45 + 100 - a} x2={45 + 100 - a} y1={150 - side3 - side4 + 100 - b} y2={150 - side3 + 100 - b} text={'D'} val={side44} textHeight={-17}/>

        {/* Vertical Arrow for G */}
        <Liney x1={55 + side1 + side2 + 100 - a} x2={55 + side1 + side2 + 100 - a} y1={150 - side5 + 100 - b} y2={150 + 100 - b} text={'E'} val={side55} textHeight={17}/>

        {/* Vertical Arrow for R2 */}
        <Linex x1={50 + 100 - a} x2={50 + side1 + 100 - a} y1={155 + 100 - b} y2={155 + 100 - b} text={'A'} val={side11} textHeight={5}/>

        {/* Vertical Arrow for R2 */}
        <Linex x1={50 + side1 + 100 - a} x2={50 + side1 + side2 + 100 - a} y1={155 + 100 - b} y2={155 + 100 - b} text={'B'} val={side22} textHeight={5}/>

        {/* Vertical Arrow for R2 */}
        <Linex x1={60 + outerRadius/Math.tan(aa*angle1/2) + 100 - a} x2={60 + outerRadius/Math.tan(aa*angle1/2) + 100 - a} y1={140 - side3 + 100 - b} y2={140 - side3 + 100 - b} text={'θ1'} val={angle1} textHeight={5} unit={" "}/>

        {/* Vertical Arrow for R2 */}
        <Linex x1={50 + side4/Math.tan(aa*angle1) + 100 - a} x2={50 + side4/Math.tan(aa*angle1) + 100 - a} y1={145- side3 - side4 + 100 - b} y2={145 - side3 - side4 + 100 - b} text={'θ2'} val={angle2} textHeight={-5} unit={" "}/>

        <Linex x1={x3 + 100 - a} x2={x3 + 100 - a} y1={y3 + 10 + 100 - b} y2={y3 + 10 + 100 - b} text={'θ3'} val={angle3} textHeight={5} unit={" "}/>

        <Linex x1={x1 + 100 - a} x2={x1 + 100 - a} y1={y1 - 10 + 100 - b} y2={y1 - 10 + 100 - b} text={'θ4'} val={angle4} textHeight={-5} unit={" "}/>

      
      </svg>
      <button title={Props.title3} className='btn btn mx-2 my-2' onClick={zoomIn} style={{color: 'white', backgroundColor: '#1b065c'}}><i className="fa-solid fa-magnifying-glass-plus"></i></button>
      <button title={Props.title6} className='btn btn mx-2 my-2' onClick={resetZoom} style={{color: 'white', backgroundColor: '#1b065c'}}><i className="fa-solid fa-maximize"></i> </button>
      <button title={Props.title4} className='btn btn mx-2 my-2' onClick={zoomOut} style={{color: 'white', backgroundColor: '#1b065c'}}> <i className="fa-solid fa-magnifying-glass-minus"></i> </button>
    </div>
  );
}

export default D_pillar_rear_graph;
