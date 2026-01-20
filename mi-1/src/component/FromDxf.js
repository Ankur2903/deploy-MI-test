import React, { useState, useCallback, useEffect ,useRef } from "react";
import DxfParser from "dxf-parser";
import PredefinedPoints from "./PredefinedPoints";
import Result from "./shap/Result";
import { COM } from "./AdvanceOutput/COM";
import { ComputeMomentOfInertia } from "./AdvanceOutput/MomentOfInertia";
import { ComputePrincipalAxisAngle } from "./AdvanceOutput/PrincipalAxisAngle";
import { convertDXFPolyline } from "./DxfViewer/DxftoSvgData";
import LineAtTheta from "./Graph/Shap/LineAtθ";
import CircleSector from "./Graph/Shap/Circle";

export default function FromDxf() {
  const aa = 180/Math.PI;
  const shapes = [];
  const [entities, setEntities] = useState([]);
  const predefinedPoints =[];
  const [dimensioning, setDimensioning] = useState(false);
  let first = true
  let clockWise = true;
  var mnx = 0;
  var mny = 0;
  var mxx = 40;
  var mxy = 40;
  const [thickness, setThickness] = useState(0);
  const [viewBox, setViewBox] = useState('0 0 40 40');
  const [isDragging, setIsDragging] = useState(false);
  const [startCoords, setStartCoords] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [stripWidth, setStripWidth] = useState(0);
  const [weightPerLength, setWeightPerLength] = useState(0);
  const [length, setLength] = useState(1);
  const [totalWeight, setTotalWeight] = useState(0)
  const [outLine, setOutLine] = useState(0)
  const [area, setArea] = useState(0);
  const [inertiax, setInertiax] = useState(0);
  const [inertiay, setInertiay] = useState(0);
  const [rogx, setRogx] = useState(0); // Radius of gyration i(x)
  const [rogy, setRogy] = useState(0); // Radius of gyration i(y)
  const [pmoi, setPmoi] = useState(0); // Polar moment of inertia Ip
  const [type, setType] = useState("Open"); 
  const [morx, setMorx] = useState(0);
  const [mory, setMory] = useState(0);
  const [inertiaxy, setInertiaxy] = useState(0);
  const [paangle, setPaangle] = useState(0);
  const [inertiau, setInertiau] = useState(0);
  const [inertiav, setInertiav] = useState(0);
  const [rogu, setRogu] = useState(0); // Radius of gyration i(u)
  const [rogv, setRogv] = useState(0); // Radius of gyration i(v)
  const [moru, setMoru] = useState(0);
  const [morv, setMorv] = useState(0);
  let x;
  let y;
  let a;let b; let Ix; let Iy; let sw; let ol; let acs; let xmax; let ymax; let Ixy;
  const mx = 100;
  const ratio = 100;
  var count = 0;

  const clickOndimensioning = () => {
    setDimensioning(!dimensioning)
  }

  const handleUpload = async (e) => {
    setDimensioning(false);
    const file = e.target.files[0];
    if (!file) return;
    const text = await file.text();
    const parser = new DxfParser();
    const dxf = parser.parseSync(text);
    setEntities(dxf.entities || []);
  };

  const renderEntity = (e, i) => {
    
    if(i === 0){
      shapes.length = 0;
      count = 0;
      mnx = Number.MAX_SAFE_INTEGER;
      mny = Number.MAX_SAFE_INTEGER;
      mxx = Number.MIN_SAFE_INTEGER;
      mxy = Number.MIN_SAFE_INTEGER;
    }
    // console.log("entity ", i, "  ", e);
  /* ---------- LINE ---------- */
  if (e.type === "LINE" && Array.isArray(e.vertices) && e.vertices.length >= 2) {
    const p1 = e.vertices[0];
    const p2 = e.vertices[1];
    const t1 = e.lineweight/100;
    const angle1 = (p2.x - p1.x >=0) ? Math.atan((p2.y - p1.y)/(p2.x - p1.x)) : Math.atan((p2.y - p1.y)/(p2.x - p1.x)) + Math.PI;
    const newPoint = {
      id : i,
      type : 'line',
      x : p1.x + (t1/2)*Math.sin(angle1),
      y : p1.y - (t1/2)*Math.cos(angle1),
      w : Math.sqrt(Math.pow(p2.y - p1.y, 2) + Math.pow(p2.x - p1.x, 2)),
      h : t1,
      r : 0,
      angle : angle1*180/Math.PI, 
      rotation : 0,
      t : t1
    };
    predefinedPoints.push(newPoint)
    mnx = (Math.min(mnx, p1.x, p2.x)).toFixed(0);
    mny = (Math.min(mny, p1.y, p2.y)).toFixed(0);
    mxx = (Math.max(mxx, p1.x, p2.x)).toFixed(0);
    mxy = (Math.max(mxy, p1.y, p2.y)).toFixed(0);

    return (
      <line key={i} x1={p1.x } y1={p1.y} x2={p2.x} y2={p2.y} stroke="black" strokeWidth={e.lineweight/100}/>
    );
  }
  /* ---------- ARC (ANGLES ARE IN RADIANS) ---------- */
  if (e.type === "ARC" && e.center && typeof e.radius === "number") {
    const { x: cx, y: cy } = e.center;
    const r = e.radius;
    // angles are already in radians
    const sx = cx + r * Math.cos(e.startAngle);
    const sy = cy + r * Math.sin(e.startAngle);
    const ex = cx + r * Math.cos(e.endAngle);
    const ey = cy + r * Math.sin(e.endAngle);

    const largeArc = e.angleLength > Math.PI ? 1 : 0;
    const sweep = e.endAngle > e.startAngle ? 1 : 1;
    const t1 = e.lineweight/100;

    const newPoint = {
      id : i,
      type : 'circle',
      x : cx,
      y : cy,
      w : 0,
      h : t1,
      r : r + t1/2,
      angle : (e.endAngle - e.startAngle)*180/Math.PI, 
      rotation : (e.startAngle)*180/Math.PI,
      t : t1
    };
    predefinedPoints.push(newPoint)
    mnx = (Math.min(mnx, sx, ex)).toFixed(0);
    mny = (Math.min(mny, sy, ey)).toFixed(0);
    mxx = (Math.max(mxx, sx, ex)).toFixed(0);
    mxy = (Math.max(mxy, sy, ey)).toFixed(0);  

    return (
      <path key={i} d={`M ${sx} ${sy} A ${r} ${r} 0 ${largeArc} ${sweep} ${ex} ${ey}`} fill="none" stroke="black" strokeWidth={e.lineweight/100}/>
    );
  }
  if(e.type === "LWPOLYLINE" && e.shape === true){
    first = true;
    predefinedPoints.length = 0;
    const n = e.vertices.length;count++;
    for(let j =0; j < n; j++){
      const p1 = e.vertices[j];
      if(p1.x > mxx && (i >= shapes.length/2 || count === 2)){
        first = false;
      }
      mnx = (Math.min(mnx, p1.x)).toFixed(0);
      mny = (Math.min(mny, p1.y)).toFixed(0);
      mxx = (Math.max(mxx, p1.x)).toFixed(0);
      mxy = (Math.max(mxy, p1.y)).toFixed(0);
    }
    shapes.push(...convertDXFPolyline(e.vertices));
    let sum = 0;
    for(let i = (count - 1)*shapes.length/2;i< shapes.length; i++) if(shapes[i].type === "ARC") {
      sum += (shapes[i].clockwise && shapes[i].endAngle - shapes[i].startAngle < 0) ? 360 - (shapes[i].startAngle - shapes[i].endAngle)*aa : (shapes[i].clockwise && shapes[i].endAngle - shapes[i].startAngle >= 0) ? (shapes[i].endAngle - shapes[i].startAngle)*aa : (!shapes[i].clockwise && shapes[i].endAngle - shapes[i].startAngle < 0) ? - (360 + (shapes[i].endAngle - shapes[i].startAngle)*aa) : - (shapes[i].endAngle - shapes[i].startAngle)*aa;
    }
    sum = sum.toFixed(2);
    // console.log(count , "sum", sum);
    if(sum > 0 ) clockWise = false;
    else clockWise = true;
    for(let i = 0;i< shapes.length; i++){
      if((clockWise ^ first) ? i >= shapes.length/2 : i < shapes.length/2){
        if(shapes[i].type === "LINE"){
          const newPoint = {
            id : i,
            type : 'line',
            x : shapes[i].start.x,
            y : shapes[i].start.y,
            w : Math.sqrt(Math.pow(shapes[i].end.y - shapes[i].start.y, 2) + Math.pow(shapes[i].end.x - shapes[i].start.x, 2)),
            h : thickness,
            r : 0,
            angle : shapes[i].angle*aa, 
            rotation : 0,
            t : thickness
          };
          mnx = Math.min(mnx, shapes[i].start.x, shapes[i].end.x);
          mny = Math.min(mny, shapes[i].start.y, shapes[i].end.y);
          mxx = Math.max(mxx, shapes[i].start.x, shapes[i].end.x);
          mxy = Math.max(mxy, shapes[i].start.y, shapes[i].end.y);
          predefinedPoints.push(newPoint);
        }
        else{
          const newPoint = {
            id : i,
            type : 'circle',
            x : shapes[i].center.x,
            y : shapes[i].center.y,
            w : 0,
            h : thickness,
            r : shapes[i].clockwise === true ? shapes[i].radius + thickness : shapes[i].radius,
            angle : (shapes[i].endAngle - shapes[i].startAngle)*aa, 
            rotation : (shapes[i].startAngle)*aa,
            t : thickness
          };
          predefinedPoints.push(newPoint)
        }
      }
    }
  }
  return null;
};
  const [newHeight, setNewHeight] = useState(0);
  const [newWidth, setNewWidth] = useState(0);

  useEffect(() => {
    let innerradius = 0;
    let outerradius = 0;
    for(let i = 0;i< shapes.length; i++){
      if(count === 1){
        if(shapes[i].type === "ARC" && outerradius === 0) outerradius = shapes[i].radius;
        else if(shapes[i].type === "ARC") innerradius = shapes[i].radius;
      }
      else{
        if(shapes[i].type === "ARC" && outerradius === 0) outerradius = shapes[i].radius;
        else if(shapes[i].type === "ARC" && i>=shapes.length/2 && innerradius === 0) innerradius = shapes[i].radius;
      }
    }
    setThickness(Math.abs(outerradius - innerradius));
    ({a, b} = COM(predefinedPoints));
    setNewHeight(Math.max(mxy - mny, 30)/ scale);
    setNewWidth(Math.max(mxx - mnx, 30)/ scale);
    ({Ix, Iy, sw, ol, acs, xmax, ymax, Ixy} = ComputeMomentOfInertia(predefinedPoints, a, b, mx, ratio, thickness));
    const Paa = Math.atan(2*Ixy/(Ix - Iy))*90/Math.PI
    const Iu = (Paa <= 0) ? (Number(Ix) + Number(Iy))/2 - Math.sqrt(Math.pow((Number(Ix) - Number(Iy))/2, 2) + Ixy*Ixy) : (Number(Ix) + Number(Iy))/2 + Math.sqrt(Math.pow((Number(Ix) - Number(Iy))/2, 2) + Ixy*Ixy)
    const Iv = (Paa > 0) ? (Number(Ix) + Number(Iy))/2 - Math.sqrt(Math.pow((Number(Ix) - Number(Iy))/2, 2) + Ixy*Ixy) : (Number(Ix) + Number(Iy))/2 + Math.sqrt(Math.pow((Number(Ix) - Number(Iy))/2, 2) + Ixy*Ixy)
    const {umax, vmax} = ComputePrincipalAxisAngle(predefinedPoints, a, b, mx, ratio, thickness, Paa);
    setWeightPerLength(((sw)*thickness*7850*0.000001).toFixed(3));
    setTotalWeight(((sw)*thickness*7850*0.000001*length).toFixed(3));
    setStripWidth((sw).toFixed(3));
    setOutLine((ol).toFixed(3))
    setArea((acs).toFixed(3));
    setInertiax((Ix).toFixed(3));
    setInertiay((Iy).toFixed(3));
    setRogx((Math.sqrt(Ix/acs)*10).toFixed(3));
    setRogy((Math.sqrt(Iy/acs)*10).toFixed(3));
    setPmoi((Number(Ix) + Number(Iy)).toFixed(3));
    setMorx((Ix/ymax).toFixed(3));
    setMory((Iy/xmax).toFixed(3));
    if(Ix !== Iy) setPaangle((Paa).toFixed(3));
    setInertiaxy((-Ixy).toFixed(3))
    setInertiau((Iu).toFixed(3))
    setInertiav((Iv).toFixed(3));
    setRogu((Math.sqrt(Iu/acs)*10).toFixed(3));
    setRogv((Math.sqrt(Iv/acs)*10).toFixed(3));
    setMoru((Iu/vmax).toFixed(3));
    setMorv((Iv/umax).toFixed(3));
  }, [renderEntity, dimensioning]);

  
  
  useEffect(() => {
    setViewBox(`${mnx - 30} ${mny - 30} ${Math.max(newWidth,newHeight) + 60} ${Math.max(newWidth,newHeight) + 60}`);
  }, [newHeight, newWidth]);

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
      const newWidth =  (mxx - mnx)/ scale;
      const newHeight = (mxy - mny)/ scale;
      setViewBox(`${mnx - 30} ${mny - 30} ${Math.max(newWidth,newHeight) + 60} ${Math.max(newWidth,newHeight) + 60}`);
    };
    
    const updateViewBox = () => {
      const newWidth =  (mxx - mnx)/ scale;
      const newHeight = (mxy - mny)/ scale;
      setViewBox(`${mnx - 30} ${mny - 30} ${Math.max(newWidth,newHeight) + 60} ${Math.max(newWidth,newHeight) + 60}`);
    };
  
    useEffect(() => {
      updateViewBox();
    }, [scale]);

  return (
    <div style={{ display: "flex", padding: 20, height: "88vh"}}>
      {/* Left content */}
      <div style={{ flex: 1, marginRight: 20 }}>
        <h2>DXF Viewer</h2>
        <input type="file" accept=".dxf" onChange={handleUpload} />
        <div className="form-check form-switch m-0">
          <input className="form-check-input" type="checkbox" role="switch" id="dimensionSwitch" title="Click to check dimensions" checked={dimensioning} onClick={clickOndimensioning}/>
          <label className="form-check-label ms-2" htmlFor="dimensionSwitch"> DIMENSIONING FUNCTION</label>
        </div>
        <div style={{ marginTop: 20, border: "1px solid #999", height: "70%"}}>
          <svg viewBox={viewBox} style={{ width: '100%', height: '58vh', backgroundColor: '#f9f9f9', border: '1px solid #ccc' }} onMouseDown={handleMouseDown}  onTouchStart={handleTouchStart}>
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="gray" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect x='-10000' y='-10000' width="20000" height="20000" fill="url(#grid)" />
            {entities.map(renderEntity)}
            {shapes.map((shape, index) => (
              <>
              {!(clockWise ^ first) && index < shapes.length/2 && shape.type === "LINE" && <LineAtTheta x={shape.start.x} y={shape.start.y} w={Math.sqrt(Math.pow(shape.end.x - shape.start.x, 2) + Math.pow(shape.end.y - shape.start.y, 2))} h={thickness} angle={shape.angle*aa}/>}
              {(clockWise ^ first) && index >= shapes.length/2 && shape.type === "LINE" && <LineAtTheta x={shape.start.x} y={shape.start.y} w={Math.sqrt(Math.pow(shape.end.x - shape.start.x, 2) + Math.pow(shape.end.y - shape.start.y, 2))} h={thickness}  angle={shape.angle*aa}/>}

              {/* {shape.type === "LINE" && <circle cx={shape.start.x} cy={shape.start.y} r={0.5} fill="green"/>} */}
              {/* {shape.type === "LINE" && <circle cx={shape.end.x} cy={shape.end.y} r={0.5} fill="red"/>} */}

              {!(clockWise ^ first) && index < shapes.length/2 && shape.type === "ARC" && <CircleSector radius={shape.clockwise === true ? shape.radius + thickness : shape.radius} centerX={shape.center.x} centerY={shape.center.y} angle={(shape.endAngle - shape.startAngle)*aa} rotation={shape.startAngle*aa} thickness={thickness}/>}
              {(clockWise ^ first) && index >= shapes.length/2 && shape.type === "ARC" && <CircleSector radius={shape.clockwise === true ? shape.radius + thickness : shape.radius} centerX={shape.center.x} centerY={shape.center.y} angle={(shape.endAngle - shape.startAngle)*aa} rotation={shape.startAngle*aa} thickness={thickness}/>}
              </>
            ))}
            {dimensioning && (
              <PredefinedPoints points={predefinedPoints} mx={100} thickness={2} scale={100}/>
            )}
          </svg>
          <div style={{display: "flex", justifyContent: "center"}}>
            <button title='Zoom in' className='btn btn mx-2 my-2' onClick={zoomIn} style={{color: 'white', backgroundColor: '#1b065c'}}><i className="fa-solid fa-magnifying-glass-plus"></i></button>
           <button title='Reset zoom' className='btn btn mx-2 my-2' onClick={resetZoom} style={{color: 'white', backgroundColor: '#1b065c'}}><i className="fa-solid fa-maximize"></i> </button>
           <button title='Zoom out' className='btn btn mx-2 my-2' onClick={zoomOut} style={{color: 'white', backgroundColor: '#1b065c'}}> <i className="fa-solid fa-magnifying-glass-minus"></i> </button>
          </div>
          
        </div>
      </div>
      {/* Right panel */}
      <div style={{ width: "20vw", border: "1px solid #ccc", padding: 10, height: "100%", overflowY: "auto" }}>
        <Result weightPerLength={weightPerLength} length={length} totalWeight={totalWeight} stripWidth={stripWidth} outLine={outLine} area={area} inertiax={inertiax} inertiay={inertiay} rogx={rogx} rogy={rogy} pmoi={pmoi} morx={morx} mory={mory} inertiaxy={inertiaxy} paangle={paangle} inertiau={inertiau} inertiav={inertiav} rogu={rogu} rogv={rogv} moru={moru} morv={morv}/>
      </div>
    </div>
  );
}
