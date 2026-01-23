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
  const shapeData = [];
  const [selectedShapeData, setSelectedShapeData] = useState([])
  const [changedShapeData, setChangedShapeData] = useState([]);
  const [entities, setEntities] = useState([]);
  const [predefinedPoints, setPredefinedPoints] = useState([]);
  const [dimensioning, setDimensioning] = useState(false);
  let first = true
  let clockWise = true;
  var mnx = 0;
  var mny = 0;
  var mxx = 40;
  var mxy = 40;
  const [startX, setStartX] = useState(30);
  const [startY, setStartY] = useState(30);
  const [endX, setEndX] = useState(30);
  const [endY, setEndY] = useState(30);
  const [thickness, setThickness] = useState(2);
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

  useEffect(() => {
    console.log("-------******* useEffect called ********-------");
    setSelectedShapeData([])
    setChangedShapeData([])
    setPredefinedPoints([])
    shapeData.length = 0;
    let count = 0;
    let LWPOLYLINE = false;
    mnx = Number.MAX_SAFE_INTEGER;
    mny = Number.MAX_SAFE_INTEGER;
    mxx = Number.MIN_SAFE_INTEGER;
    mxy = Number.MIN_SAFE_INTEGER;
    for(let i =0; i < entities.length; i++){
      if(entities[i].type === "LINE"){
        const p1 = entities[i].vertices[0];
        const p2 = entities[i].vertices[1];
        const angle1 = (p2.x - p1.x >=0) ? Math.atan((p2.y - p1.y)/(p2.x - p1.x)) : Math.atan((p2.y - p1.y)/(p2.x - p1.x)) + Math.PI;
        const thickness = entities[i].lineweight/100;
        mnx = Math.min(mnx, p1.x, p2.x);
        mny = Math.min(mny, p1.y, p2.y);
        mxx = Math.max(mxx, p1.x, p2.y);
        mxy = Math.max(mxy, p1.y, p2.y); 
        setThickness(thickness);
        const newPoint = {
          id : i,
          type : 'line',
          x : p1.x + (thickness/2)*Math.sin(angle1),
          y : p1.y - (thickness/2)*Math.cos(angle1),
          w : Math.sqrt(Math.pow(p2.y - p1.y, 2) + Math.pow(p2.x - p1.x, 2)),
          h : thickness,
          r : 0,
          angle : angle1*180/Math.PI, 
          rotation : 0,
          t : thickness
        };
        setPredefinedPoints(prev => [...prev, newPoint])
        shapeData.push({angle: angle1, start: {x: p1.x + (thickness/2)*Math.sin(angle1), y: p1.y - (thickness/2)*Math.cos(angle1)}, end: {x: p2.x + (thickness/2)*Math.sin(angle1), y: p2.y - (thickness/2)*Math.cos(angle1)}, type: "LINE"})
      }
      if(entities[i].type === "ARC"){
        const p = entities[i].center;
        const thickness = entities[i].lineweight/100;
        setThickness(thickness);
        const newPoint = {
            id : i,
            type : 'circle',
            x : p.x,
            y : p.y,
            w : 0,
            h : thickness,
            r : entities[i].radius + thickness/2,
            angle : (entities[i].endAngle - entities[i].startAngle)*180/Math.PI, 
            rotation : (entities[i].startAngle)*180/Math.PI,
            t : thickness
          };
          setPredefinedPoints(prev => [...prev, newPoint])
          shapeData.push({type: "ARC", center: {x: p.x, y: p.y}, clockWise: false, endAngle: entities[i].endAngle, radius: (entities[i].radius + thickness/2), startAngle: entities[i].startAngle})
      }
      if(entities[i].type === "LWPOLYLINE" && entities[i].shape === true){
        first = true;
        LWPOLYLINE = true
        for(let j = 0; j < entities[i].vertices.length; j++){
          const p1 = entities[i].vertices[j];count++;
          if(p1.x > mxx && (i >= shapes.length/2 || count === 2)) first = false;
          mnx = Math.min(mnx, p1.x);
          mny = Math.min(mny, p1.y);
          mxx = Math.max(mxx, p1.x);
          mxy = Math.max(mxy, p1.y); 
        }
        shapeData.push(...convertDXFPolyline(entities[i].vertices));
      }
    } 
    setStartX(mnx);setStartY(mny);setEndX(mxx);setEndY(mxy);
    let innerradius = 0;
    let outerradius = 0;
    let sum = 0;
    for(let i = 0;i< shapeData.length; i++){
      if(count === 1){
        if(shapeData[i].type === "ARC" && outerradius === 0) outerradius = shapeData[i].radius;
        else if(shapeData[i].type === "ARC") innerradius = shapeData[i].radius;
      }
      else{
        if(shapeData[i].type === "ARC" && outerradius === 0) outerradius = shapeData[i].radius;
        else if(shapeData[i].type === "ARC" && i>=shapeData.length/2 && innerradius === 0) innerradius = shapeData[i].radius;
      }
      if(i < shapeData.length/2 && shapeData[i].type === "ARC"){
        sum += (shapeData[i].clockwise && shapeData[i].endAngle - shapeData[i].startAngle < 0) ? 360 - (shapeData[i].startAngle - shapeData[i].endAngle)*aa : (shapeData[i].clockwise && shapeData[i].endAngle - shapeData[i].startAngle >= 0) ? (shapeData[i].endAngle - shapeData[i].startAngle)*aa : (!shapeData[i].clockwise && shapeData[i].endAngle - shapeData[i].startAngle < 0) ? - (360 + (shapeData[i].endAngle - shapeData[i].startAngle)*aa) : - (shapeData[i].endAngle - shapeData[i].startAngle)*aa;
      }
    }
    if(sum > 0 ) clockWise = false;
    else clockWise = true;
    if(LWPOLYLINE) setThickness(Math.abs(outerradius - innerradius)); 
    for(let i = 0;i< shapeData.length; i++){
      if(LWPOLYLINE){
        if(!(clockWise ^ first) && i < shapeData.length/2){
          if(shapeData[i].type === "LINE"){
            const newPoint = {
              id : i,
              type : 'line',
              x : shapeData[i].start.x,
              y : shapeData[i].start.y,
              w : Math.sqrt(Math.pow(shapeData[i].end.y - shapeData[i].start.y, 2) + Math.pow(shapeData[i].end.x - shapeData[i].start.x, 2)),
              h : Math.abs(outerradius - innerradius),
              r : 0,
              angle : shapeData[i].angle*aa, 
              rotation : 0,
              t : Math.abs(outerradius - innerradius)
            };
            setPredefinedPoints(prev => [...prev, newPoint])
          }
          else{
            const newPoint = {
              id : i,
              type : 'circle',
              x : shapeData[i].center.x,
              y : shapeData[i].center.y,
              w : 0,
              h : Math.abs(outerradius - innerradius),
              r : shapeData[i].clockwise === true ? shapeData[i].radius + thickness : shapeData[i].radius,
              angle : (shapeData[i].endAngle - shapeData[i].startAngle)*aa, 
              rotation : (shapeData[i].startAngle)*aa,
              t : Math.abs(outerradius - innerradius)
            };
            setPredefinedPoints(prev => [...prev, newPoint])
          }
          setSelectedShapeData(prev => [...prev, shapeData[i]]);
        }
        else if((clockWise ^ first) && i >= shapeData.length/2){
          if(shapeData[i].type === "LINE"){
            const newPoint = {
              id : i,
              type : 'line',
              x : shapeData[i].start.x,
              y : shapeData[i].start.y,
              w : Math.sqrt(Math.pow(shapeData[i].end.y - shapeData[i].start.y, 2) + Math.pow(shapeData[i].end.x - shapeData[i].start.x, 2)),
              h : Math.abs(outerradius - innerradius),
              r : 0,
              angle : shapeData[i].angle*aa, 
              rotation : 0,
              t : Math.abs(outerradius - innerradius)
            };
            setPredefinedPoints(prev => [...prev, newPoint])
          }
          else{
            const newPoint = {
              id : i,
              type : 'circle',
              x : shapeData[i].center.x,
              y : shapeData[i].center.y,
              w : 0,
              h : Math.abs(outerradius - innerradius),
              r : shapeData[i].clockwise === true ? shapeData[i].radius + thickness : shapeData[i].radius,
              angle : (shapeData[i].endAngle - shapeData[i].startAngle)*aa, 
              rotation : (shapeData[i].startAngle)*aa,
              t : Math.abs(outerradius - innerradius)
            };
            setPredefinedPoints(prev => [...prev, newPoint])
          }
          setSelectedShapeData(prev => [...prev, shapeData[i]]);
        }
      }
      else setSelectedShapeData(prev => [...prev, shapeData[i]]);
    }
  }, [entities]);

  useEffect(() => {
    // for(let i = 0;i<selectedShapeData.length;i++){
    //   const newShape = {
    //     id: i + 1,
    //     type: selectedShapeData[i].type === "LINE" ? "Line" : selectedShapeData[i].clockWise === true ? "clockwise" : "anticlockwise", 
    //     length: selectedShapeData[i].type === "LINE" ? Math.sqrt(Math.pow(selectedShapeData[i].end.x - selectedShapeData[i].start.x, 2) + Math.pow(selectedShapeData[i].end.y - selectedShapeData[i].start.y, 2)) : 0,
    //     radius: selectedShapeData[i].type === "LINE" ? 0 : selectedShapeData[i].clockwise === true ? selectedShapeData[i].radius + thickness : selectedShapeData[i].radius,
    //     angle: selectedShapeData[i].type === "LINE" ? 0 : aa*(selectedShapeData[i].endAngle - selectedShapeData[i].startAngle),
    //     color: "black",
    //     x: selectedShapeData[i].type === "LINE" ? selectedShapeData[i].start.x : selectedShapeData[i].center.x,
    //     y: selectedShapeData[i].type === "LINE" ? selectedShapeData[i].start.y : selectedShapeData[i].center.y,
    //   }
    //   setChangedShapeData(prev => [...prev, newShape]);
    // }
    // console.log("changedshapedata", changedShapeData);
    ({a, b} = COM(predefinedPoints));
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
  }, [predefinedPoints]);

  useEffect(() => {
    const newWidth =  (endX - startX + 40)/ scale;
    const newHeight = (endY - startY + 40)/ scale;
    setViewBox(`${(startX + endX)/2 - Math.max(newWidth,newHeight)/2} ${(startY + endY)/2 - Math.max(newWidth,newHeight)/2} ${Math.max(newWidth,newHeight)} ${Math.max(newWidth,newHeight)}`);
  }, [startX, startY, endX, endY]);

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
      const newWidth =  (endX - startX + 40)/ scale;
      const newHeight = (endY - startY + 40)/ scale;
      setViewBox(`${(startX + endX)/2 - Math.max(newWidth,newHeight)/2} ${(startY + endY)/2 - Math.max(newWidth,newHeight)/2} ${Math.max(newWidth,newHeight)} ${Math.max(newWidth,newHeight)}`);
    };
    
    const updateViewBox = () => {
      const newWidth =  (endX - startX + 40)/ scale;
      const newHeight = (endY - startY + 40)/ scale;
      setViewBox(`${(startX + endX)/2 - Math.max(newWidth,newHeight)/2} ${(startY + endY)/2 - Math.max(newWidth,newHeight)/2} ${Math.max(newWidth,newHeight)} ${Math.max(newWidth,newHeight)}`);
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
            {selectedShapeData.map((shape) => (
              <>
              {shape.type === "LINE" && <LineAtTheta x={shape.start.x} y={shape.start.y} w={Math.sqrt(Math.pow(shape.end.x - shape.start.x, 2) + Math.pow(shape.end.y - shape.start.y, 2))} h={thickness} angle={shape.angle*aa}/>}

              {shape.type === "ARC" && <CircleSector radius={shape.clockwise === true ? shape.radius + thickness : shape.radius} centerX={shape.center.x} centerY={shape.center.y} angle={aa*(shape.endAngle - shape.startAngle)} rotation={shape.startAngle*aa} thickness={thickness}/>}
              </>
            ))}
            {dimensioning && (
              <PredefinedPoints points={predefinedPoints} mx={100} thickness={thickness} scale={100}/>
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
