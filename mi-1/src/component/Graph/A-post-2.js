import { useState, useCallback, useEffect } from 'react';
import CircleSector from './Shap/Circle';
import * as Props from '../constant';
import Linex from './Shap/Linex';
import Liney from './Shap/Liney';
import LineAtTheta from './Shap/LineAtθ';
import { COM } from '../AdvanceOutput/COM';

function A_post_2_graph({ side11, side22, side33, side44, side55, side66, thickness1, outerRadius1, angle1, angle2, angle3, radius1}) {
  const aa = Math.PI/180;
  const mx = Math.max(side11 + side22, side33 + side44, side55 + side66);
  const thickness = (thickness1/mx)*Props.ratio
  const side1 = (side11/mx)*Props.ratio
  const side2 = (side22/mx)*Props.ratio
  const side3 = (side33/mx)*Props.ratio
  const side4 = (side44/mx)*Props.ratio
  const side5 = (side55/mx)*Props.ratio
  const side6 = (side66/mx)*Props.ratio
  const outerRadius = (outerRadius1/mx)*Props.ratio
  const radius = (radius1/mx)*Props.ratio
  
  const angle4 =  angle1 + angle2 + angle3 - 180
  const l1 = -side6/Math.cos(aa*angle1) - radius/Math.tan(aa*angle1/2) - outerRadius/Math.tan(aa*angle2/2)

  const x1 = 50 + side3 + side4 - radius
  const y1 = 150 - side5 + radius/Math.tan(aa*angle1/2)

  const x4 = 50 + outerRadius;
  const y4 = 150 - side2 - side1 + outerRadius/Math.tan(aa*angle3/2)

  const l2 = (side2 + side1 - side5 - (side3 + side4)/Math.tan(aa*angle3) + (l1 + radius/Math.tan(aa*angle1/2) + outerRadius/Math.tan(aa*angle2/2))*(Math.cos(aa*angle1) + Math.sin(aa*angle1)/Math.tan(aa*angle3)))/(Math.cos(aa*(angle1 + angle2)) + Math.sin(aa*(angle1 + angle2))/Math.tan(aa*angle3)) - outerRadius/Math.tan(aa*angle2/2) - (outerRadius - thickness)/Math.tan(aa*angle4/2)

  const l3 = (side3 + side4 + (l2 + outerRadius/Math.tan(aa*angle2/2) + (outerRadius - thickness)/Math.tan(aa*angle4/2))*Math.sin(aa*(angle1 + angle2)) - (l1 + radius/Math.tan(aa*angle1/2) + outerRadius/Math.tan(aa*angle2/2))*Math.sin(aa*angle1))/Math.sin(aa*angle3) - outerRadius/Math.tan(aa*angle3/2) - (outerRadius - thickness)/Math.tan(aa*angle4/2)

  const x3 = x1 - (radius - outerRadius)*Math.cos(aa*angle1) - l1*Math.sin(aa*angle1)
  const y3 = y1 - (radius - outerRadius)*Math.sin(aa*angle1) + l1*Math.cos(aa*angle1)

  const x2 = 50 + outerRadius + (2*outerRadius - thickness)*Math.cos(aa*angle3) + l3*Math.sin(aa*angle3)
  const y2 = 150 - side2 - side1 + outerRadius/Math.tan(aa*angle3/2) - (2*outerRadius - thickness)*Math.sin(aa*angle3) + l3*Math.cos(aa*angle3)


  const predefinedPoints = [
  // Straight segments
  { id: 1, type: 'line', x: 50 + outerRadius + side3, y: 150 - thickness, w: side4 - 2 * outerRadius, h: thickness, angle: 0 },
  { id: 2, type: 'line', x: 50 + side3 + side4 - thickness, y: 150 - side5 + radius / Math.tan(aa * angle1 / 2), w: thickness, h: side5 - outerRadius - radius / Math.tan(aa * angle1 / 2), angle: 0 },
  { id: 3, type: 'line', x: 50 + side3, y: 150 - side2 + outerRadius - thickness, w: thickness, h: side2 - 2 * outerRadius + thickness, angle: 0 },
  { id: 4, type: 'line', x: 50, y: 150 - side1 - side2 + outerRadius / Math.tan(aa * angle3 / 2), w: thickness, h: side1 - outerRadius - outerRadius / Math.tan(aa * angle3 / 2), angle: 0 },
  { id: 5, type: 'line', x: 50 + outerRadius, y: 150 - side2 - thickness, w: side3 - 2 * outerRadius + thickness, h: thickness, angle: 0 },

  // Angled lines
  { id: 6, type: 'line', x: x1 - (radius - thickness) * Math.cos(aa * angle1), y: y1 - (radius - thickness) * Math.sin(aa * angle1), w: l1, h: thickness, angle: 90 + angle1 },
  { id: 7, type: 'line', x: x4 + outerRadius * Math.cos(aa * angle3), y: y4 - outerRadius * Math.sin(aa * angle3), w: l3, h: thickness, angle: 90 - angle3 },
  { id: 8, type: 'line', x: x3 + (outerRadius - thickness) * Math.cos(aa * (angle1 + angle2)), y: y3 + (outerRadius - thickness) * Math.sin(aa * (angle1 + angle2)), w: l2, h: thickness, angle: angle1 + angle2 - 90 },

  // Circle Sectors (rounded corners)
  { id: 9, type: 'circle', x: 50 + outerRadius, y: 150 - side2 - side1 + outerRadius / Math.tan(aa * angle3 / 2), r: outerRadius, angle: 180 - angle3, rotation: 180, t: thickness },
  { id: 10, type: 'circle', x: 50 + outerRadius, y: 150 - side2 - outerRadius, r: outerRadius, angle: 90, rotation: 90, t: thickness },
  { id: 11, type: 'circle', x: 50 + side3 - outerRadius + thickness, y: 150 - side2 + outerRadius - thickness, r: outerRadius, angle: 90, rotation: 270, t: thickness },
  { id: 12, type: 'circle', x: 50 + side3 + outerRadius, y: 150 - outerRadius, r: outerRadius, angle: 90, rotation: 90, t: thickness },
  { id: 13, type: 'circle', x: 50 + side3 + side4 - outerRadius, y: 150 - outerRadius, r: outerRadius, angle: 90, rotation: 0, t: thickness },
  { id: 14, type: 'circle', x: 50 + side3 + side4 - radius, y: 150 - side5 + radius / Math.tan(aa * angle1 / 2), r: radius, angle: 180 - angle1, rotation: angle1 - 180, t: thickness },
  { id: 15, type: 'circle', x: x3, y: y3, r: outerRadius, angle: 180 - angle2, rotation: angle1 + angle2, t: thickness },
  { id: 16, type: 'circle', x: x2, y: y2, r: outerRadius, angle: 180 - angle4, rotation: -angle3 + angle4, t: thickness }
];

  const {a, b} = COM(predefinedPoints)
  console.log('COM:', a, b);


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
        <rect x={50 + outerRadius + side3 + 100 - a} y={150 - thickness + 100 - b} width={side4 - 2*outerRadius} height={thickness} fill="black"/>
        <rect x={50 + side3 + side4 - thickness + 100 - a} y={150 - side5 + radius/Math.tan(aa*angle1/2) + 100 - b} width={thickness} height={side5 - outerRadius - radius/Math.tan(aa*angle1/2)} fill="black"/>
        <rect x={50 + side3 + 100 - a} y={150 - side2 + outerRadius - thickness + 100 - b} width={thickness} height={side2 - 2*outerRadius + thickness} fill="black"/>
        <rect x={50 + 100 - a} y={150 - side1 - side2 + outerRadius/Math.tan(aa*angle3/2) + 100 - b} width={thickness} height={side1 - outerRadius - outerRadius/Math.tan(aa*angle3/2)} fill="black"/>
        <rect x={50 + outerRadius + 100 - a} y={150 - side2 - thickness + 100 - b} width={side3 - 2*outerRadius + thickness} height={thickness} fill="black"/>
        <LineAtTheta x={x1 - (radius - thickness)*Math.cos(aa*angle1) + 100 - a} y={y1 - (radius - thickness)*Math.sin(aa*angle1) + 100 - b} w={l1} h={thickness} angle={90 + angle1}/>
        <LineAtTheta x={x4 + outerRadius*Math.cos(aa*angle3) + 100 - a} y={y4 - outerRadius*Math.sin(aa*angle3) + 100 - b} w={l3} h={thickness} angle={90 - angle3}/>
        <LineAtTheta x={x3 + (outerRadius - thickness)*Math.cos(aa*(angle1 + angle2)) + 100 - a} y={y3 + (outerRadius - thickness)*Math.sin(aa*(angle1 + angle2)) + 100 - b} w={l2} h={thickness} angle={angle1 + angle2 - 90}/>
        <CircleSector radius={outerRadius} centerX={50 + outerRadius + 100 - a} centerY={150 - side2 - side1 + outerRadius/Math.tan(aa*angle3/2) + 100 - b} angle={180 - angle3} rotation={180} thickness={thickness}/>
        <CircleSector radius={outerRadius} centerX={50 + outerRadius + 100 - a} centerY={150 - side2 - outerRadius + 100 - b} angle={90} rotation={90} thickness={thickness}/>
        <CircleSector radius={outerRadius} centerX={50 + side3 - outerRadius + thickness + 100 - a} centerY={150 - side2 + outerRadius - thickness + 100 - b} angle={90} rotation={270} thickness={thickness}/>
        <CircleSector radius={outerRadius} centerX={50 + side3 + outerRadius + 100 - a} centerY={150 - outerRadius + 100 - b} angle={90} rotation={90} thickness={thickness}/>
        <CircleSector radius={outerRadius} centerX={50 + side3 + side4 - outerRadius + 100 - a} centerY={150 - outerRadius + 100 - b} angle={90} rotation={0} thickness={thickness}/>
        <CircleSector radius={radius} centerX={50 + side3 + side4 - radius + 100 - a} centerY={150 - side5 + radius/Math.tan(aa*angle1/2) + 100 - b} angle={180 - angle1} rotation={angle1 - 180} thickness={thickness}/>
        <CircleSector radius={outerRadius} centerX={x3 + 100 - a} centerY={y3 + 100 - b} angle={180 - angle2} rotation={angle1 + angle2} thickness={thickness}/>
        <CircleSector radius={outerRadius} centerX={x2 + 100 - a} centerY={y2 + 100 - b} angle={180 - angle4} rotation={-angle3 + angle4} thickness={thickness}/>
        <Liney x1={45 + 100 - a} x2={45 + 100 - a} y1={150 - side2 - side1 + 100 - b} y2={150 - side2 + 100 - b} text={'A'} val={side11} textHeight={-17}/>
        <Liney x1={45 + 100 - a} x2={45 + 100 - a} y1={150 - side2 + 100 - b} y2={150 + 100 - b} text={'B'} val={side22} textHeight={-17}/>
        <Liney x1={55 + side3 + side4 + 100 - a} x2={55 + side3 + side4 + 100 - a} y1={150 - side5 - side6 + 100 - b} y2={150 - side5 + 100 - b} text={'F'} val={side66} textHeight={17}/>
        <Liney x1={55 + side3 + side4 + 100 - a} x2={55 + side3 + side4 + 100 - a} y1={150 - side5 + 100 - b} y2={150 + 100 - b} text={'E'} val={side55} textHeight={17}/>
        <Linex x1={50 + 100 - a} x2={50 + side3 + 100 - a} y1={155 + 100 - b} y2={155 + 100 - b} text={'C'} val={side33} textHeight={5} unit={""}/>
        <Linex x1={50 + side3 + 100 - a} x2={50 + side3 + side4 + 100 - a} y1={155 + 100 - b} y2={155 + 100 - b} text={'D'} val={side44} textHeight={5} unit={""}/>


      </svg>
      <button title={Props.title3} className='btn btn mx-2 my-2' onClick={zoomIn} style={{color: 'white', backgroundColor: '#1b065c'}}><i className="fa-solid fa-magnifying-glass-plus"></i></button>
      <button title={Props.title6} className='btn btn mx-2 my-2' onClick={resetZoom} style={{color: 'white', backgroundColor: '#1b065c'}}><i className="fa-solid fa-maximize"></i> </button>
      <button title={Props.title4} className='btn btn mx-2 my-2' onClick={zoomOut} style={{color: 'white', backgroundColor: '#1b065c'}}> <i className="fa-solid fa-magnifying-glass-minus"></i> </button>
    </div>
  );
}

export default A_post_2_graph;
