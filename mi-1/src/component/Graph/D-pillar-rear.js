import { useState, useCallback, useEffect } from 'react';
import CircleSector from './Shap/Circle';
import * as Props from '../constant';
import Linex from './Shap/Linex';
import Liney from './Shap/Liney';
import LineAtTheta from './Shap/LineAtθ';

function D_pillar_rear_graph({ side11, side22, side33, side44, side55, radius11, radius22, radius33, radius44, angle1, angle2, angle3, angle4, thickness1, outerRadius1}) {
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
    const scaleX = viewBox.width / width;  
    const scaleY = viewBox.height / height;

    const newPoint = {
      x: (event.clientX - left)*scaleX + viewBox.x ,
      y: (event.clientY - top)*scaleY + viewBox.y,
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
      <svg viewBox={viewBox} style={{ width: '100%', height: 'auto', backgroundColor: '#f9f9f9', border: '1px solid #ccc' }} onMouseDown={handleMouseDown} onTouchStart={handleTouchStart} onClick={handleSVGClick}>
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
        <line x1="-1000" y1={90} x2={svgWidth + 1000} y2={90} stroke="gray" strokeWidth="1" />
        <line x1={100} y1="-1000" x2={100} y2={svgHeight + 1000} stroke="gray" strokeWidth="1" />

        {/* L Shape */}
        <rect x={50 + outerRadius/Math.tan(aa*angle1/2)} y={150 - side3 - thickness} width={side1 - outerRadius/Math.tan(aa*angle1/2) - radius2 + thickness} height={thickness} fill="black" />
        <rect x={50 + side1 + outerRadius} y={150 - thickness} width={side2 - 2*outerRadius} height={thickness} fill="black" />
        <rect x={50 + side1 + side2 - thickness} y={150 - side5} width={thickness} height={side5 - outerRadius} fill="black" />
        <rect x={50 + side1} y={150 - side3 + radius2 - thickness} width={thickness} height={side3 - outerRadius - radius2 + thickness} fill="black" />
 
        <LineAtTheta x={50 + outerRadius/Math.tan(aa*angle1/2) - outerRadius*Math.sin(aa*angle1)} y={150 - side3 - outerRadius - outerRadius*Math.cos(aa*angle1)} w={l1} h={thickness} angle={-angle1}/>   
        <LineAtTheta x={x2 + outerRadius*Math.sin(aa*(angle1 + angle2))} y={y2 + outerRadius*Math.cos(aa*(angle1 + angle2))} w={l2} h={thickness} angle={180 - angle1 - angle2}/>  
        <LineAtTheta x={x1 - (radius4 - thickness)*Math.sin(aa*(angle1 + angle2 - angle3))} y={y1 - (radius4 - thickness)*Math.cos(aa*(angle1 + angle2 - angle3))} w={l3} h={thickness} angle={180 - angle1 - angle2 + angle3}/>  
       
        {/* outer radius */}
        <CircleSector radius={radius2} centerX={50 + side1 - radius2 + thickness} centerY={150 - side3 + radius2 - thickness} angle={90} rotation={270} thickness={thickness}/>  
        <CircleSector radius={outerRadius} centerX={50 + side1 + outerRadius} centerY={150 - outerRadius} angle={90} rotation={90} thickness={thickness}/>  
        <CircleSector radius={outerRadius} centerX={50 + side1 + side2 - outerRadius} centerY={150 - outerRadius} angle={90} rotation={0} thickness={thickness}/>  
        <CircleSector radius={outerRadius} centerX={50 + outerRadius/Math.tan(aa*angle1/2)} centerY={150 - side3 - outerRadius} angle={180 - angle1} rotation={90} thickness={thickness}/>  
        <CircleSector radius={radius1} centerX={50 + side1 + side2 - radius1} centerY={150 - side5} angle={180 - angle5} rotation={angle5 - 180} thickness={thickness}/>  
        <CircleSector radius={radius4} centerX={x1} centerY={y1} angle={180 - angle4} rotation={angle5 + angle4} thickness={thickness}/>  
        <CircleSector radius={outerRadius} centerX={x2} centerY={y2} angle={180 - angle2} rotation={270 - angle1} thickness={thickness}/>  
        <CircleSector radius={radius3} centerX={x3} centerY={y3} angle={180 - angle3} rotation={90 - angle1 - angle2 + angle3} thickness={thickness}/>  
      
         {/* Vertical Arrow for G */}
        <Liney x1={45} x2={45} y1={150 - side3} y2={150} text={'C'} val={side33} textHeight={-17}/>

        {/* Vertical Arrow for G */}
        <Liney x1={45} x2={45} y1={150 - side3 - side4} y2={150 - side3} text={'D'} val={side44} textHeight={-17}/>

        {/* Vertical Arrow for G */}
        <Liney x1={55 + side1 + side2} x2={55 + side1 + side2} y1={150 - side5} y2={150} text={'E'} val={side55} textHeight={17}/>

        {/* Vertical Arrow for R2 */}
        <Linex x1={50} x2={50 + side1} y1={155} y2={155} text={'A'} val={side11} textHeight={5}/>

        {/* Vertical Arrow for R2 */}
        <Linex x1={50 + side1} x2={50 + side1 + side2} y1={155} y2={155} text={'B'} val={side22} textHeight={5}/>

        {/* Vertical Arrow for R2 */}
        <Linex x1={60 + outerRadius/Math.tan(aa*angle1/2)} x2={60 + outerRadius/Math.tan(aa*angle1/2)} y1={140 - side3} y2={140 - side3} text={'θ1'} val={angle1} textHeight={5} unit={" "}/>

        {/* Vertical Arrow for R2 */}
        <Linex x1={50 + side4/Math.tan(aa*angle1)} x2={50 + side4/Math.tan(aa*angle1)} y1={145- side3 - side4} y2={145 - side3 - side4} text={'θ2'} val={angle2} textHeight={-5} unit={" "}/>

        <Linex x1={x3} x2={x3} y1={y3 + 10} y2={y3 + 10} text={'θ3'} val={angle3} textHeight={5} unit={" "}/>

        <Linex x1={x1} x2={x1} y1={y1 - 10} y2={y1 - 10} text={'θ4'} val={angle4} textHeight={-5} unit={" "}/>
      
      </svg>
      <button title={Props.title3} className='btn btn mx-2 my-2' onClick={zoomIn} style={{color: 'white', backgroundColor: '#1b065c'}}><i className="fa-solid fa-magnifying-glass-plus"></i></button>
      <button title={Props.title6} className='btn btn mx-2 my-2' onClick={resetZoom} style={{color: 'white', backgroundColor: '#1b065c'}}><i className="fa-solid fa-maximize"></i> </button>
      <button title={Props.title4} className='btn btn mx-2 my-2' onClick={zoomOut} style={{color: 'white', backgroundColor: '#1b065c'}}> <i className="fa-solid fa-magnifying-glass-minus"></i> </button>
    </div>
  );
}

export default D_pillar_rear_graph;
