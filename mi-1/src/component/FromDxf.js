import React, { useState, useEffect } from "react";
import DxfParser from "dxf-parser";
import PredefinedPoints from "./PredefinedPoints";

const toRad = (deg) => (deg * Math.PI) / 180;

export default function FromDxf() {
  const [entities, setEntities] = useState([]);
  const predefinedPoints =[]
  const [dimensioning, setDimensioning] = useState(false);
  var mnx = Number.MAX_SAFE_INTEGER;
  var mny = Number.MAX_SAFE_INTEGER;
  var mxx = Number.MIN_SAFE_INTEGER;
  var mxy = Number.MIN_SAFE_INTEGER;

  const clickOndimensioning = () => {
    setDimensioning(!dimensioning)
  }

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const text = await file.text();
    const parser = new DxfParser();
    const dxf = parser.parseSync(text);
    setEntities(dxf.entities || []);
  };

  const renderEntity = (e, i) => {
    if(i === 0){
      mnx = Number.MAX_SAFE_INTEGER;
      mny = Number.MAX_SAFE_INTEGER;
      mxx = Number.MIN_SAFE_INTEGER;
      mxy = Number.MIN_SAFE_INTEGER;
    }
    // console.log(i, e);
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
  return null;
};
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [c, setC] = useState(0);
  const [d, setD] = useState(0);
  
  useEffect(() => {
      setA(mnx);setB(mny);setC(mxx - mnx);setD(mxy - mny);
    }, [mnx, mny, mxx, mxy,renderEntity])


  return (
    <div style={{ padding: 20 }}>
      <h2>DXF SVG Viewer</h2>

      <input type="file" accept=".dxf" onChange={handleUpload} />
      <div className="form-check form-switch m-0">
          <input className="form-check-input" type="checkbox" role="switch" id="dimensionSwitch" title="Click to check dimensions" value={dimensioning} onClick={clickOndimensioning}/>
          <label className="form-check-label ms-2" htmlFor="dimensionSwitch">DIMENSIONING FUNCTION</label>
        </div>
      <div style={{ marginTop: 20, border: "1px solid #999", height: 500,}}
      >
        <svg viewBox= {`${a - 0.2*c} ${b - 0.2*d} ${c + c*0.4} ${d + d*0.4}`} width="100%" height="100%">
          {entities.map(renderEntity)}
          {dimensioning && <PredefinedPoints points={predefinedPoints} mx={100} thickness={2} scale={100}/>}
        </svg>
      </div>
    </div>
  );
}
