import { useState, useCallback, useEffect } from "react";
import DxfParser from "dxf-parser";
import PredefinedPoints from "./PredefinedPoints";
import Result from "./shap/Result";
import { COM } from "./AdvanceOutput/COM";
import { ComputeMomentOfInertia } from "./AdvanceOutput/MomentOfInertia";
import { ComputePrincipalAxisAngle } from "./AdvanceOutput/PrincipalAxisAngle";
import { convertDXFPolyline } from "./DxfViewer/DxftoSvgData";
import LineAtTheta from "./Graph/Shap/LineAtθ";
import CircleSector from "./Graph/Shap/Circle";
import Feasibility from "./Feasibility";
import FeasibilityL1 from "./FeasibilityL1";

export default function FromDxf() {
  const aa = 180/Math.PI;
  const shapeData = [];
  const dxfData = [];
  const [selectedShapeData, setSelectedShapeData] = useState([])
  const [boxPerimeter, setBoxPerimeter] = useState(0)
  const [entities, setEntities] = useState([]);
  const [predefinedPoints, setPredefinedPoints] = useState([]);
  const [dimensioning, setDimensioning] = useState(false);
  let clockwise = true;
  const [clockWises, setClockWises] = useState(true)
  var mnx = 0;
  var mny = 0;
  var mxx = 40;
  var mxy = 40;
  const [startX, setStartX] = useState(30);
  const [startY, setStartY] = useState(30);
  const [endX, setEndX] = useState(30);
  const [endY, setEndY] = useState(30);
  const [thickness, setThickness] = useState(-1);
  const [innerThickness, setInnerThickness] = useState(-2);
  const [outerThickness, setOuterThickness] = useState(-3);
  const [thicknessIncreaseSide, setThicknessIncreaseSide] = useState("Inner");
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

  const handleThicknessChange = (e) => {
    if(thicknessIncreaseSide === "Inner") setInnerThickness(Number(e.target.value));
    else setOuterThickness(Number(e.target.value));
  };

  const clickOndimensioning = () => {
    setDimensioning(!dimensioning)
  }

  const handleUpload = async (e) => {
    setThickness(-1);
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
    console.log("entities", entities)
    setSelectedShapeData([])
    shapeData.length = 0;
    dxfData.length = 0;
    shapeData.length = 0;
    let count = 0;
    let sum = 0;
    let LWPOLYLINE = false;
    let thickness1 = 0;
    if(entities.length>0){
      mnx = Number.MAX_SAFE_INTEGER;
      mny = Number.MAX_SAFE_INTEGER;
      mxx = Number.MIN_SAFE_INTEGER;
      mxy = Number.MIN_SAFE_INTEGER;
    }
    for(let i =0; i < entities.length; i++){
      if(entities[i].type === "LINE"){
        const p1 = entities[i].vertices[0];
        const p2 = entities[i].vertices[1];
        const angle1 = (p2.x - p1.x >=0) ? Math.atan((p2.y - p1.y)/(p2.x - p1.x)) : Math.atan((p2.y - p1.y)/(p2.x - p1.x)) + Math.PI;
        thickness1 = entities[i].lineweight/100;
        mnx = Math.min(mnx, p1.x, p2.x);
        mny = Math.min(mny, p1.y, p2.y);
        mxx = Math.max(mxx, p1.x, p2.y);
        mxy = Math.max(mxy, p1.y, p2.y); 
        shapeData.push({ type: "LINE", start: {x: p1.x, y: p1.y}, end: {x: p2.x, y: p2.y}, angle: angle1})
      }
      if(entities[i].type === "ARC"){
        const p = entities[i].center;
        thickness1 = entities[i].lineweight/100;
        shapeData.push({type: "ARC", center: {x: p.x, y: p.y}, radius: entities[i].radius, clockwise: (entities[i].endAngle > entities[i].startAngle) ? false : true, endAngle: entities[i].endAngle, startAngle: entities[i].startAngle,})
      }
      if(entities[i].type === "LWPOLYLINE"){
        LWPOLYLINE = true;
        count++;
        for(let j = 0; j < entities[i].vertices.length; j++){
          const p1 = entities[i].vertices[j];
          mnx = Math.min(mnx, p1.x);
          mny = Math.min(mny, p1.y);
          mxx = Math.max(mxx, p1.x);
          mxy = Math.max(mxy, p1.y); 
        }
        console.log("entities[i].shape", entities[i].shape);
        dxfData.push(...convertDXFPolyline(entities[i].vertices, entities[i].shape));
      }
    } 
    setStartX(mnx);setStartY(mny);setEndX(mxx);setEndY(mxy);
    if(LWPOLYLINE && count === 2){
      shapeData.length = 0;thickness1 = 0;
      for(let i = 0;i<dxfData.length/2; i++){
        if(dxfData[i].type === "LINE"){
          shapeData.push({start : {x: (dxfData[i].start.x + dxfData[i + dxfData.length/2].start.x)/2, y: (dxfData[i].start.y + dxfData[i + dxfData.length/2].start.y)/2}, end: {x: (dxfData[i].end.x + dxfData[i + dxfData.length/2].end.x)/2, y: (dxfData[i].end.y + dxfData[i + dxfData.length/2].end.y)/2}, angle : dxfData[i].angle, type : "LINE"})
        }
        else if(dxfData[i].type === "ARC"){
          shapeData.push({center: {x : dxfData[i].center.x, y : dxfData[i].center.y}, clockwise: dxfData[i].clockwise, startAngle: dxfData[i].startAngle, endAngle: dxfData[i].endAngle, radius: (dxfData[i].radius + dxfData[i + dxfData.length/2].radius)/2, type: "ARC"})
          if(thickness1 === 0){
            thickness1 = Math.abs(dxfData[i].radius - dxfData[i + dxfData.length/2].radius)
          }
        }
      }
    }
    else if(LWPOLYLINE && count === 1){
      shapeData.length = 0;thickness1 = 0;
      let s0 = 0;
      const n = dxfData.length;
      for(let i = 1;i<=n;i++){
        if(dxfData[i%n].type === "LINE" && dxfData[(i - 1)%n].type === "LINE" && dxfData[(i + 1)%n].type === "LINE"){
          if(dxfData[(i - 1)%n].angle%(2*Math.PI) === (Math.PI + dxfData[(i + 1)%n].angle)%(2*Math.PI)){
            s0 = (i + 1)%n;
            break;
          }
        }
        if(dxfData[i%n].type === "LINE" && dxfData[(i - 1)%n].type === "ARC" && dxfData[(i + 1)%n].type === "ARC"){
          if(dxfData[(i - 1)%n].center.x === dxfData[(i + 1)%n].center.x && dxfData[(i - 1)%n].center.y === dxfData[(i + 1)%n].center.y){
            s0 = (i + 1)%n;
            break;
          }
        }
      }
      thickness1 = Math.sqrt(Math.pow(dxfData[s0].end.x - dxfData[s0].start.x, 2) + Math.pow(dxfData[s0].end.y - dxfData[s0].start.y, 2))
      let s1 = s0 + n;
      let s2 = s0 + n - 2;
      for(let i = 0;i<dxfData.length/2 - 1;i++){
        let first = (s1 + i)%n;
        let second = (s2 - i)%n;
        if(dxfData[first].type === "LINE"){
          shapeData.push({start : {x: (dxfData[first].start.x + dxfData[second].end.x)/2, y: (dxfData[first].start.y + dxfData[second].end.y)/2}, end: {x: (dxfData[first].end.x + dxfData[second].start.x)/2, y: (dxfData[first].end.y + dxfData[second].start.y)/2}, angle : dxfData[first].angle, type : "LINE"})
        }
        else if(dxfData[first].type === "ARC"){
          shapeData.push({center: {x : dxfData[first].center.x, y : dxfData[first].center.y}, clockwise: dxfData[first].clockwise, startAngle: dxfData[first].startAngle, endAngle: dxfData[first].endAngle, radius: (dxfData[first].radius + dxfData[second].radius)/2, type: "ARC"})
        }
      }
    }
    console.log("shapedata", shapeData);
    setThickness(thickness1.toFixed(2));
    setInnerThickness((thickness1/2).toFixed(2));
    setOuterThickness((thickness1/2).toFixed(2));
    for(let i = 0;i< shapeData.length; i++){
      // changeing arc angle and cal sum
      if(LWPOLYLINE && shapeData[i].type === "ARC" && shapeData[i].startAngle > shapeData[i].endAngle) shapeData[i].endAngle += 2*Math.PI;
      if(LWPOLYLINE && shapeData[i].type === "ARC") sum += (shapeData[i].clockwise) ? (shapeData[i].endAngle - shapeData[i].startAngle)*aa : - (shapeData[i].endAngle - shapeData[i].startAngle)*aa;
      if(!LWPOLYLINE && shapeData[i].type === "ARC") sum += (shapeData[i].startAngle - shapeData[i].endAngle)*aa;
    }
    if(sum > 0) clockwise = false;
    else clockwise = true;
    setClockWises(clockwise);
    for(let i = 0;i< shapeData.length; i++) setSelectedShapeData(prev => [...prev, shapeData[i]]);
  }, [entities]);

  useEffect(() => {
    setPredefinedPoints([])
    setThickness(Number(innerThickness) + Number(outerThickness));
    const n = selectedShapeData.length;
    for(let i = 0;i<n;i++){
      const shape = selectedShapeData[i];
      const newPoint = {
        id : i + 1,
        type : (shape.type === 'LINE') ? 'line' : 'circle',
        x : (shape.type === 'LINE') ? clockWises ? shape.start.x + outerThickness*Math.sin(shape.angle) : shape.start.x + innerThickness*Math.sin(shape.angle) : shape.center.x,
        y : (shape.type === 'LINE') ? clockWises ? shape.start.y - outerThickness*Math.cos(shape.angle) : shape.start.y - innerThickness*Math.cos(shape.angle) : shape.center.y,
        w : (shape.type === 'LINE') ? Math.sqrt(Math.pow(shape.end.x - shape.start.x, 2) + Math.pow(shape.end.y - shape.start.y, 2)) : 0,
        h : (shape.type === 'LINE') ? Number(outerThickness) + Number(innerThickness) : 0,
        r : (shape.type === 'LINE') ? 0 : (!shape.clockwise^clockWises) ? shape.radius + Number(innerThickness): shape.radius + Number(outerThickness),
        angle : (shape.type === 'LINE') ? shape.angle*aa : aa*Math.abs(shape.endAngle - shape.startAngle),
        rotation : (shape.type === 'LINE') ? 0 : shape.startAngle*aa,
        t : thickness,
      }
      setPredefinedPoints(prev => [...prev, newPoint])
    }
  }, [selectedShapeData, outerThickness, innerThickness]);

  useEffect(() => {
    
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
  }, [predefinedPoints, length]);

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
      <div className="modal fade" id="exampleModal0" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-body">
              <Feasibility type={type} stripWidth={stripWidth} thickness={thickness} boxPerimeter={boxPerimeter}/>
            </div>  
          </div>
        </div>
      </div>
      <div className="modal fade" id="exampleModal1" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-body">
              <FeasibilityL1 type={type} stripWidth={stripWidth} thickness={thickness} boxPerimeter={boxPerimeter}  length={length}/>
            </div>  
          </div>
        </div>
      </div>
      {/* Left content */}
      <div style={{ flex: 1, marginRight: 20 }}>
        <table className="table align-middle" style={{margin: "0"}}>
          <tbody>
            <tr style={{ borderColor: "white", margin: "0", borderWidth: "0" }}>
              <td><h2 style={{ margin: 0 }}>DXF Viewer</h2></td>
              <td style={{paddingBottom: "0"}}>Thickness : {thickness}</td>
              <td style={{paddingBottom: "0"}}>Length</td>
              <td><input type="file" accept=".dxf" onChange={handleUpload} /></td>
            </tr>
            <tr style={{ borderColor: "white", margin: "0" ,borderWidth: "0" }}>
              <td style={{margin: "0"}}><div className="form-check form-switch m-0">
                  <input className="form-check-input" type="checkbox" role="switch" id="dimensionSwitch" title="Click to check dimensions" checked={dimensioning} onClick={clickOndimensioning}/>
                  <label className="form-check-label ms-2" htmlFor="dimensionSwitch"> DIMENSIONING FUNCTION</label></div></td>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <input type="number" value={thicknessIncreaseSide === "Inner" ? innerThickness : outerThickness} onChange={handleThicknessChange}  style={{padding: "8px", border: "1px solid #ccc", borderRight: "none", borderRadius: "6px 0 0 6px", outline: "none"}} onFocus={(e) => e.target.select()}/>
                    {/* Unit Selector */}
                    <select value={thicknessIncreaseSide} onChange={(e)=>setThicknessIncreaseSide(e.target.value)} style={{width:"75px",padding: "8px", border: "1px solid #ccc", borderRadius: "0 6px 6px 0", outline: "none", background: "#f9f9f9"}}>
                        <option value="Inner">Inner </option>
                        <option value="Outer">Outer </option>
                    </select>
                  </div>
              <td><input type="number"className="form-control" value={length} onChange={(e)=>setLength(Number(e.target.value))}/></td>
              <td><div className="btn-group">
                  <button className="btn dropdown-toggle" data-bs-toggle="dropdown" style={{ color: "white", backgroundColor: "#1b065c", borderRadius: "5px"}}> Feasibility?</button>
                  <ul className="dropdown-menu">
                    <li><button className="btn" data-bs-toggle="modal" data-bs-target="#exampleModal0">Feasibility L0</button></li>
                    <li><button className="btn" data-bs-toggle="modal" data-bs-target="#exampleModal1">Feasibility L1</button></li>
                  </ul>
                </div></td>
            </tr>
          </tbody>
        </table>
        <div style={{ marginTop: 10, border: "1px solid #999", height: "70%"}}>
          <svg viewBox={viewBox} style={{ width: '100%', height: '58vh', backgroundColor: '#f9f9f9', border: '1px solid #ccc' }} onMouseDown={handleMouseDown}  onTouchStart={handleTouchStart}>
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="gray" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect x='-10000' y='-10000' width="20000" height="20000" fill="url(#grid)" />
            {selectedShapeData.map((shape, i) => (
              <>
              {i >=0 && shape.type === "LINE" && <LineAtTheta x={clockWises ? shape.start.x + outerThickness*Math.sin(shape.angle) : shape.start.x + innerThickness*Math.sin(shape.angle)} y={clockWises ? shape.start.y - outerThickness*Math.cos(shape.angle) : shape.start.y - innerThickness*Math.cos(shape.angle)} w={Math.sqrt(Math.pow(shape.end.x - shape.start.x, 2) + Math.pow(shape.end.y - shape.start.y, 2))} h={Number(outerThickness) + Number(innerThickness)} angle={shape.angle*aa}/>}
{/* 
              {i >=0 && shape.type === "LINE" && <circle cx={shape.start.x} cy={shape.start.y} r="" fill="none" stroke="black" />}


              {i >=0 && shape.type === "LINE" && <circle cx={shape.end.x} cy={shape.end.y} r="2" fill="black" stroke="black" />}

              {i >=0 && shape.type === "ARC" && <circle cx={shape.center.x} cy={shape.center.y} r="2" fill="black" stroke="black" />} */}
              

              {i >=0 && shape.type === "ARC" && <CircleSector radius={(!shape.clockwise^clockWises) ? shape.radius + Number(innerThickness): shape.radius + Number(outerThickness)} centerX={shape.center.x} centerY={shape.center.y} angle={aa*Math.abs(shape.endAngle - shape.startAngle)} rotation={shape.startAngle*aa} thickness={Number(outerThickness) + Number(innerThickness)}/>}
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
