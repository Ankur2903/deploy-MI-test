import { useState, useCallback, useEffect } from 'react';
import CircleSector from './Shap/Circle';
import Linex from './Shap/Linex';
import Liney from './Shap/Liney';
import LineAtTheta from './Shap/LineAtθ';

function Cat_a_piller_graph({ side11, side22, side33, side44, side55, side66, side77, side88, radius11, radius22, radius33, radius44, radius55, angle11, angle22, thickness1, outerRadius1}) {
  const aa = Math.PI/180;
  const mx = Math.max(side11, side55);
  const thickness = (thickness1/mx)*100;
  const side1 = (side11/mx)*100;
  const side2 = (side22/mx)*100;
  const side3 = (side33/mx)*100;
  const side4 = (side44/mx)*100;
  const side5 = (side55/mx)*100;
  const side6 = (side66/mx)*100;
  const side7 = (side77/mx)*100;
  const side8 = (side88/mx)*100;
  const angle1 = angle11
  const angle2 = angle22
  const radius1 = (radius11/mx)*100;
  const radius2 = (radius22/mx)*100;
  const radius3 = (radius33/mx)*100;
  const radius4 = (radius44/mx)*100;
  const radius5 = (radius55/mx)*100;
  const outerRadius = (outerRadius1/mx)*100;

  const l2 = (side8 - thickness + radius5  + side2 - radius5/Math.tan(aa*angle1/2) - side5)/(Math.cos(aa*angle1)) 
  const l1 = side1 - radius4 - radius5 - l2*Math.sin(aa*angle1) + thickness - side3 - side4 
  const l3 = (radius3 - radius3*Math.sin(aa*angle2) + radius2*Math.sin(aa*angle2) + side7 - radius2/Math.tan(aa*angle2/2) + side6 - side5)/(Math.cos(aa*angle2))
  const l4 = side1 - radius4 + radius3*Math.cos(angle2*aa) - l3*Math.sin(aa*angle2) - radius2 - radius2*Math.cos(aa*angle2)

  const [viewBox, setViewBox] = useState('0 0 200 200');
  const [isDragging, setIsDragging] = useState(false);
  const [startCoords, setStartCoords] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);

  const svgWidth = 200;
  const svgHeight = 200;

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
    setViewBox('0 0 200 200');
  };

  const updateViewBox = () => {
    const newWidth = svgWidth / scale;
    const newHeight = svgHeight / scale;
    setViewBox(`0 0 ${newWidth} ${newHeight}`);
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
            <input onClick={clickOndimensioning} className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" style={{color: '#1b065c', transform: 'translateY(0px) translateX(4px)'}}/>
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
        <line x1="-1000" y1={100} x2={svgWidth + 1000} y2={100} stroke="gray" strokeWidth="1" />
        <line x1={100} y1="-1000" x2={100} y2={svgHeight + 1000} stroke="gray" strokeWidth="1" />

        {/* L Shape */}
        <rect x={50 + side1 - side4 - side3 + outerRadius} y={150 - thickness} width={side3 - 2*outerRadius} height={thickness} fill="black" />
        <rect x={50 + side1 - side4 - side3} y={150 - side2 + radius5/Math.tan(aa*angle1/2)} width={thickness} height={side2 - outerRadius - radius5/Math.tan(aa*angle1/2)} fill="black"/>
        <rect x={50 + side1 - side4 - thickness} y={150  - side6 + radius1 - thickness} width={thickness} height={side6 - outerRadius - radius1 + thickness} fill="black"/>
        <rect x={50 + side1 - side4 - thickness + radius1} y={150  - side6 - thickness} width={side4 - outerRadius - radius1 + thickness} height={thickness} fill="black"/>
        <rect x={50 + side1 - thickness} y={150  - side6 - side7 + radius2/Math.tan(aa*angle2/2)} width={thickness} height={side7 - outerRadius - radius2/Math.tan(aa*angle2/2)} fill="black"/>
        <rect x={50} y={150  - side5 + radius4} width={thickness} height={side8 - 2*radius4} fill="black"/>
        <rect x={50 + radius4} y={150  - side5} width={l4} height={thickness} fill="black"/>
        <rect x={50 + radius4} y={150  - side5 + side8 - thickness} width={l1} height={thickness} fill="black"/>
 
        <LineAtTheta x={50 + radius4 + l4 - radius3*Math.cos(aa*angle2)} y={150 - side5 + radius3- radius3*Math.sin(aa*angle2)} w={l3} h={thickness} angle={angle2 - 90}/>   
        <LineAtTheta x={50 + radius4 + l1 - radius5*Math.cos(aa*angle1)} y={150 - side5 + side8 - thickness + radius5- radius5*Math.sin(aa*angle1)} w={l2} h={thickness} angle={angle1 - 90}/>  

        {/* outer radius */}
        <CircleSector radius={outerRadius} centerX={50 + side1 - side4 - side3 + outerRadius} centerY={150 - outerRadius} angle={90} rotation={90} thickness={thickness}/>   
        <CircleSector radius={outerRadius} centerX={50 + side1 - side4 - outerRadius} centerY={150 - outerRadius} angle={90} rotation={0} thickness={thickness}/>     
        <CircleSector radius={radius1} centerX={50 + side1 - side4 - thickness + radius1} centerY={150  - side6 + radius1 - thickness} angle={90} rotation={180} thickness={thickness}/> 
        <CircleSector radius={outerRadius} centerX={50 + side1 - outerRadius} centerY={150  - side6 - outerRadius} angle={90} rotation={0} thickness={thickness}/> 
        <CircleSector radius={radius2} centerX={50 + side1 - radius2} centerY={150  - side6 - side7 + radius2/Math.tan(aa*angle2/2)} angle={180 - angle2} rotation={angle2 - 180} thickness={thickness}/> 
        <CircleSector radius={radius5} centerX={50 + side1 - side4 - side3 - radius5 + thickness} centerY={150 - side2 + radius5/Math.tan(aa*angle1/2)} angle={180 - angle1} rotation={angle1 - 180} thickness={thickness}/> 
        <CircleSector radius={radius4} centerX={50 + radius4} centerY={150 - side5 + radius4} angle={90} rotation={180} thickness={thickness}/> 
        <CircleSector radius={radius4} centerX={50 + radius4} centerY={150 - side5 + side8 - radius4} angle={90} rotation={90} thickness={thickness}/> 
        <CircleSector radius={radius3} centerX={50 + radius4 + l4} centerY={150 - side5 + radius3} angle={angle2 - 90} rotation={270} thickness={thickness}/> 
        <CircleSector radius={radius5} centerX={50 + radius4 + l1} centerY={150 - side5 + side8 - thickness + radius5} angle={angle1 - 90} rotation={270} thickness={thickness}/> 
    
        {/* Vertical Arrow for E */}
        <Liney x1={12} x2={12} y1={150 - side5} y2={150} text={'E'} val={side55} textHeight={17}/>

         {/* Vertical Arrow for H */}
        <Liney x1={45} x2={45} y1={150 - side5} y2={150 - side5 + side8} text={'H'} val={side88} textHeight={-17}/>

        {/* Vertical Arrow for B */}
        <Liney x1={45 + side1 - side4 - side3} x2={45 + side1 - side4 - side3} y1={150 - side2} y2={150} text={'B'} val={side22} textHeight={-17}/>

        {/* Vertical Arrow for G */}
        <Liney x1={55 + side1} x2={55 + side1} y1={150 - side6 - side7} y2={150 - side6} text={'G'} val={side77} textHeight={17}/>

         {/* Vertical Arrow for G */}
        <Liney x1={55 + side1} x2={55 + side1} y1={150 - side6} y2={150} text={'F'} val={side66} textHeight={17}/>


        {/* Vertical Arrow for R2 */}
        <Linex x1={50} x2={50 + side1} y1={165} y2={165} text={'A'} val={side11} textHeight={5}/>

         {/* Vertical Arrow for R2 */}
        <Linex x1={50 + side1 - side4} x2={50 + side1} y1={155 - side6} y2={155 - side6} text={'D'} val={side44} textHeight={5}/>

        {/* Vertical Arrow for R2 */}
        <Linex x1={50 + side1 - side4 - side3} x2={50 + side1 - side4} y1={155} y2={155} text={'C'} val={side33} textHeight={7}/>

         {/* Vertical Arrow for R2 */}
        <Linex x1={35 + side1 - side4 - side3} x2={35 + side1 - side4 - side3} y1={155 - side2} y2={155 - side2} text={'θ1'} val={angle11} textHeight={7} unit={" "}/>

        <Linex x1={35 + side1} x2={35 + side1} y1={155 - side6 - side7} y2={155 - side6 - side7} text={'θ2'} val={angle22} textHeight={7} unit={" "}/>

        <Linex x1={50 + radius4 + l4} x2={50 + radius4 + l4 + radius3} y1={145 - side5} y2={145 - side5} text={'R3'} val={radius33} textHeight={-5}/>

        <Linex x1={50 + radius4 + l1} x2={50 + radius4 + l1 + radius5} y1={155 - side5 + side8} y2={155 - side5 + side8} text={'R5'} val={radius55} textHeight={5}/>

        <Linex x1={50 + side1 - radius2} x2={50 + side1} y1={145 - side6 - side7} y2={145 - side6 - side7} text={'R2'} val={radius22} textHeight={-5}/>

        <Linex x1={50} x2={50 + radius4} y1={145 - side5} y2={145 - side5} text={'R4'} val={radius44} textHeight={-5}/>

         <Linex x1={50 + side1 - side4 - thickness} x2={50 + side1 - side4 - thickness + radius1} y1={145 - side6} y2={145 - side6} text={'R1'} val={radius11} textHeight={-5}/>
      
      </svg>
      <button className='btn btn mx-2 my-2' onClick={zoomIn} style={{color: 'white', backgroundColor: '#1b065c'}}><i className="fa-solid fa-magnifying-glass-plus"></i></button>
      <button className='btn btn mx-2 my-2' onClick={resetZoom} style={{color: 'white', backgroundColor: '#1b065c'}}><i className="fa-solid fa-maximize"></i> </button>
      <button className='btn btn mx-2 my-2' onClick={zoomOut} style={{color: 'white', backgroundColor: '#1b065c'}}> <i className="fa-solid fa-magnifying-glass-minus"></i> </button>
    </div>
  );
}

export default Cat_a_piller_graph;
