import { useState, useCallback, useEffect } from 'react';
import CircleSector from './Shap/Circle';
import * as Props from '../constant';
import Linex from './Shap/Linex';
import Liney from './Shap/Liney';
import { COM } from '../AdvanceOutput/COM';
import { ComputeMomentOfInertia } from '../AdvanceOutput/MomentOfInertia';
import PredefinedPoints from '../PredefinedPoints';

function Flat_oval_graph({ side1, thickness1, outerRadius1, sendValue}) {
  const mx = Math.max(side1,2*outerRadius1);
  const thickness = (thickness1/mx)*Props.ratio
  const sidex = (side1/mx)*Props.ratio
  const sidey = (2*outerRadius1/mx)*Props.ratio
  const outerRadius = (outerRadius1/mx)*Props.ratio

  const predefinedPoints = [
    { id: 1, type: 'line', x: 50 + outerRadius, y: sidey - thickness + 50 + (100 - sidey) / 2, w: sidex - 2 * outerRadius, h: thickness, angle: 0 },
    { id: 2, type: 'line', x: 50 + outerRadius, y: 50 + (100 - sidey) / 2, w: sidex - 2 * outerRadius, h: thickness, angle: 0 },
    { id: 3, type: 'circle', x: 50 + outerRadius, y: 50 + sidey - outerRadius + (100 - sidey) / 2, r: sidey / 2, angle: 180, rotation: 90, t: thickness },
    { id: 4, type: 'circle', x: 50 + sidex - outerRadius, y: 50 + sidey - outerRadius + (100 - sidey) / 2, r: sidey / 2, angle: 180, rotation: 270, t: thickness }
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

{dimensioning && <PredefinedPoints points={translatedPoints} mx={mx} thickness={thickness}/>}

        {/* flatoval Shape */}
        <rect x={50 + outerRadius + 100 - a} y={sidey - thickness + 50 + (100 - sidey) / 2 + 100 - b} width={sidex - 2 * outerRadius} height={thickness} fill="black" />
        <rect x={50 + outerRadius + 100 - a} y={50 + (100 - sidey) / 2 + 100 - b} width={sidex - 2 * outerRadius} height={thickness} fill="black" />
        <CircleSector radius={sidey / 2} centerX={50 + outerRadius + 100 - a} centerY={50 + sidey - outerRadius + (100 - sidey) / 2 + 100 - b} angle={180} rotation={90} thickness={thickness} />
        <CircleSector radius={sidey / 2} centerX={50 + sidex - outerRadius + 100 - a} centerY={50 + sidey - outerRadius + (100 - sidey) / 2 + 100 - b} angle={180} rotation={270} thickness={thickness} />
        <Linex x1={50 + 100 - a} x2={sidex + 50 + 100 - a} y1={sidey + 55 + (100 - sidey) / 2 + 100 - b} y2={sidey + 55 + (100 - sidey) / 2 + 100 - b} text={'w'} val={side1} textHeight={5} />
        <Liney x1={55 + sidex + 100 - a} x2={55 + sidex + 100 - a} y1={50 + (100 - sidey) / 2 + 100 - b} y2={50 + sidey + (100 - sidey) / 2 + 100 - b} text={'h'} val={2 * outerRadius1} textHeight={17} />
        <Linex x1={50 + 100 - a} x2={thickness + 50 + 100 - a} y1={45 + (100 - sidey) / 2 + 100 - b} y2={45 + (100 - sidey) / 2 + 100 - b} text={'t'} val={thickness1} textHeight={-5} />

        
      </svg>
      <button title={Props.title3} className='btn btn mx-2 my-2' onClick={zoomIn} style={{color: 'white', backgroundColor: '#1b065c'}}><i className="fa-solid fa-magnifying-glass-plus"></i></button>
      <button title={Props.title6} className='btn btn mx-2 my-2' onClick={resetZoom} style={{color: 'white', backgroundColor: '#1b065c'}}><i className="fa-solid fa-maximize"></i> </button>
      <button title={Props.title4} className='btn btn mx-2 my-2' onClick={zoomOut} style={{color: 'white', backgroundColor: '#1b065c'}}> <i className="fa-solid fa-magnifying-glass-minus"></i> </button>
    </div>
  );
}

export default Flat_oval_graph;
