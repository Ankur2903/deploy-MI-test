import { useState, useCallback, useEffect } from 'react';
import CircleSector from './Shap/Circle';
import Linex from './Shap/Linex';
import Liney from './Shap/Liney';
import LineAtTheta from './Shap/LineAtθ';

function C_pillar_graph({ side11, side22, side33, side44, thickness1, outerRadius1, angle1, angle2, angle3, angle4, radius1, sendValuey}) {
  const aa = Math.PI/180;
  const angle5 = 270 + angle3 - angle1 - angle2 - angle4
  const l11 = side22/Math.sin(aa*angle1) - outerRadius1*(1/Math.tan(aa*angle1/2) + 1/Math.tan(aa*angle2/2))
  const l22 = (thickness1*Math.cos(aa*(angle1 + angle2)) - side33)/Math.sin(aa*(angle1 + angle2)) - outerRadius1*(1/Math.tan(aa*angle2/2) + 1/Math.tan(aa*angle3/2))
  const l33 = - (side44 - thickness1*Math.cos(aa*(angle3 - angle1 - angle2)))/Math.sin(aa*(angle3 - angle1 - angle2)) - outerRadius1*(1/Math.tan(aa*angle3/2) + 1/Math.tan(aa*angle4/2))
  const mx = Math.max(side11 - 2*l11*Math.cos(aa*angle1));
  const thickness = (thickness1/mx)*100;
  const side1 = (side11/mx)*100;
  const side2 = (side22/mx)*100;
  const side3 = (side33/mx)*100;
  const side4 = (side44/mx)*100;
  const outerRadius = (outerRadius1/mx)*100;
  const radius = radius1*100/mx
  const l1 = l11*100/mx
  const l2 = l22*100/mx
  const l3 = l33*100/mx

  const x1 = 100 - side1/2 + outerRadius + l1*Math.cos(aa*angle1)
  const y1 = 150 - outerRadius - l1*Math.sin(aa*angle1)

  const x2 = 100 + side1/2 - outerRadius - l1*Math.cos(aa*angle1)
  const y2 = 150 - outerRadius - l1*Math.sin(aa*angle1)

  const x3 = x1 + outerRadius*Math.sin(aa*(angle1 + angle2)) - l2*Math.cos(aa*(angle1 + angle2)) + (outerRadius - thickness)*Math.sin(aa*(angle1 + angle2))
  const y3 = y1 + outerRadius*Math.cos(aa*(angle1 + angle2)) + l2*Math.sin(aa*(angle1 + angle2)) + (outerRadius - thickness)*Math.cos(aa*(angle1 + angle2)) 

  const x4 = x2 - outerRadius*Math.sin(aa*(angle1 + angle2)) + l2*Math.cos(aa*(angle1 + angle2)) - (outerRadius - thickness)*Math.sin(aa*(angle1 + angle2))
  const y4 = y2 + outerRadius*Math.cos(aa*(angle1 + angle2)) + l2*Math.sin(aa*(angle1 + angle2)) + (outerRadius - thickness)*Math.cos(aa*(angle1 + angle2))

  const x5 = x3 - outerRadius*Math.sin(aa*(angle3 - angle1 - angle2)) + l3*Math.cos(aa*(angle3 - angle1 - angle2)) - (outerRadius - thickness)*Math.sin(aa*(angle3 - angle1 - angle2))
  const y5 = y3 + outerRadius*Math.cos(aa*(angle3 - angle1 - angle2)) + l3*Math.sin(aa*(angle3 - angle1 - angle2)) + (outerRadius - thickness)*Math.cos(aa*(angle3 - angle1 - angle2)) 

  const x6 = x4 + outerRadius*Math.sin(aa*(angle3 - angle1 - angle2)) - l3*Math.cos(aa*(angle3 - angle1 - angle2)) + (outerRadius - thickness)*Math.sin(aa*(angle3 - angle1 - angle2))
  const y6 = y3 + outerRadius*Math.cos(aa*(angle3 - angle1 - angle2)) + l3*Math.sin(aa*(angle3 - angle1 - angle2)) + (outerRadius - thickness)*Math.cos(aa*(angle3 - angle1 - angle2)) 

  const l4 =   (x5 - 100 - outerRadius*Math.sin(aa*(angle3 - angle1 - angle2 - angle4)) + radius*Math.cos(aa*angle5))/Math.cos(aa*(angle3 - angle1 - angle2 - angle4))

  const y7 = y5 + outerRadius*Math.cos(aa*(angle3 - angle1 - angle2 - angle4)) - l4*Math.sin(aa*(angle3 - angle1 - angle2 - angle4)) + radius*Math.sin(aa*angle5) ;

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
            <input title='Click to check dimensions' onClick={clickOndimensioning} className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" style={{color: '#1b065c', transform: 'translateY(0px) translateX(4px)'}}/>
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
        <rect x={100 - side1/2 + outerRadius} y={150 - thickness} width={side1 - 2*outerRadius} height={thickness} fill="black"/>
        
        <LineAtTheta x={100 - side1/2 + outerRadius - outerRadius*Math.sin(aa*angle1)} y = {150 - outerRadius - outerRadius*Math.cos(aa*angle1)} w={l1} h={thickness} angle={360 - angle1}/>
        <LineAtTheta x={100 + side1/2 - outerRadius + (outerRadius - thickness)*Math.sin(aa*angle1)} y = {150 - outerRadius - (outerRadius - thickness)*Math.cos(aa*angle1)} w={l1} h={thickness} angle={180 + angle1}/>
        <LineAtTheta x={x1 + outerRadius*Math.sin(aa*(angle1 + angle2))} y = {y1 + outerRadius*Math.cos(aa*(angle1 + angle2))} w={l2} h={thickness} angle={180 - angle1 - angle2}/>
        <LineAtTheta x={x2 - (outerRadius - thickness)*Math.sin(aa*(angle1 + angle2))} y = {y2 + (outerRadius - thickness)*Math.cos(aa*(angle1 + angle2))} w={l2} h={thickness} angle={angle1 + angle2}/>
        <LineAtTheta x={x3 - (outerRadius - thickness)*Math.sin(aa*(angle3 - angle1 - angle2))} y = {y3 + (outerRadius - thickness)*Math.cos(aa*(angle3 - angle1 - angle2))} w={l3} h={thickness} angle={360 + angle3 - angle1 - angle2}/>
        <LineAtTheta x={x4 + outerRadius*Math.sin(aa*(angle3 - angle1 - angle2))} y = {y3 + outerRadius*Math.cos(aa*(angle3 - angle1 - angle2))} w={l3} h={thickness} angle={angle1 + angle2 - angle3 - 180}/>
        <LineAtTheta x={100 - (radius - thickness)*Math.sin(aa*(90 - angle5))} y = {y7 - (radius - thickness)*Math.cos(aa*(90 - angle5))} w={l4} h={thickness} angle={angle5 + 90}/>
        <LineAtTheta x={100 + radius*Math.sin(aa*(90 - angle5))} y = {y7 - radius*Math.cos(aa*(90 - angle5))} w={l4} h={thickness} angle={90 - angle5}/>

        {/* outer radius */}
        <CircleSector radius={outerRadius} centerX={100 - side1/2 + outerRadius} centerY={150 - outerRadius} angle={180 - angle1} rotation={90} thickness={thickness}/>
        <CircleSector radius={outerRadius} centerX={100 + side1/2 - outerRadius} centerY={150 - outerRadius} angle={180 - angle1} rotation={angle1 - 90} thickness={thickness}/>
        <CircleSector radius={outerRadius} centerX={x1} centerY={y1} angle={180 - angle2} rotation={270 - angle1} thickness={thickness}/>
        <CircleSector radius={outerRadius} centerX={x2} centerY={y2} angle={180 - angle2} rotation={angle1 + angle2 - 270 } thickness={thickness}/>
        <CircleSector radius={outerRadius} centerX={x3} centerY={y3} angle={180 - angle3} rotation={90 - angle1 - angle2 + angle3} thickness={thickness}/>
        <CircleSector radius={outerRadius} centerX={x4} centerY={y4} angle={180 - angle3} rotation={angle1 + angle2 - 90} thickness={thickness}/>
        <CircleSector radius={outerRadius} centerX={x5} centerY={y5} angle={180 - angle4} rotation={270 + angle3 - angle1 - angle2} thickness={thickness}/>
        <CircleSector radius={outerRadius} centerX={x6} centerY={y6} angle={180 - angle4} rotation={angle1 + angle2 + angle4 - angle3 - 270} thickness={thickness}/>
        <CircleSector radius={radius} centerX={100} centerY={y7} angle={180 - 2*angle5} rotation={180  + angle5} thickness={thickness}/>
       
         {/* Vertical Arrow for B */}
        <Liney x1={45} x2={45} y1={150 - side2} y2={150} text={'B'} val={side22} textHeight={-17}/>

         {/* Vertical Arrow for C */}
        <Liney x1={45} x2={45} y1={150 - side2 - side3} y2={150 - side2} text={'C'} val={side33} textHeight={-17}/>

        {/* Vertical Arrow for B */}
        <Liney x1={45} x2={45} y1={150 - side2 - side3 - side4} y2={150 - side2 - side3} text={'D'} val={side44} textHeight={-17}/>

        {/* Vertical Arrow for B */}
        <Linex x1={100 - side1/2} x2={100 + side1/2} y1={155} y2={155} text={'A'} val={side11} textHeight={5} unit={""}/>

         {/* Vertical Arrow for θ1 */}
        <Linex x1={105 - side1/2 + outerRadius} x2={105 - side1/2 +  outerRadius} y1={150 - outerRadius} y2={150 - outerRadius} text={'θ1'} val={angle1} textHeight={-5} unit={" "}/>

         {/* Vertical Arrow for θ1 */}
        <Linex x1={10 + x1} x2={10 + x1} y1={y1} y2={y1} text={'θ2'} val={angle2} textHeight={5} unit={" "}/>

        {/* Vertical Arrow for θ1 */}
        <Linex x1={15 + x4} x2={15 + x4} y1={y3} y2={y3} text={'θ3'} val={angle3} textHeight={5} unit={" "}/>

        {/* Vertical Arrow for θ1 */}
        <Linex x1={10 + x5} x2={10 + x5} y1={y6} y2={y6} text={'θ4'} val={angle4} textHeight={5} unit={" "}/>

      </svg>
      <button title='Zoom in' className='btn btn mx-2 my-2' onClick={zoomIn} style={{color: 'white', backgroundColor: '#1b065c'}}><i className="fa-solid fa-magnifying-glass-plus"></i></button>
      <button title='Reset zoom' className='btn btn mx-2 my-2' onClick={resetZoom} style={{color: 'white', backgroundColor: '#1b065c'}}><i className="fa-solid fa-maximize"></i> </button>
      <button title='Zoom out' className='btn btn mx-2 my-2' onClick={zoomOut} style={{color: 'white', backgroundColor: '#1b065c'}}> <i className="fa-solid fa-magnifying-glass-minus"></i> </button>
    </div>
  );
}

export default C_pillar_graph;
