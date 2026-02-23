import { useState,useRef ,useEffect } from 'react';
import * as THREE from 'three';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import logo from '../Image/logo.192.jpg';
import '../../App.css'
import 'jspdf-autotable';
import Round_3_graph from '../Graph/Round-3';
import Result from './Result';
import CommonInput from './Commonnput';
import Feasibility from '../Feasibility';
import FeasibilityL1 from '../FeasibilityL1';
import * as Props from '../constant';

function Round_3({materials}) {
  const [boxPerimeter, setBoxPerimeter] = useState(0)
  const [side1, setSide1] = useState(30);
  const side1Change = (event) => {
    setSide1(parseFloat(event.target.value));
  };

  const [side2, setSide2] = useState(15);
  const side2Change = (event) => {
    setSide2(parseFloat(event.target.value));
  };

  const [diameter, setDiameter] = useState(60);
  const diameterChange = (event) => {
    setDiameter(parseFloat(event.target.value));
  };

  const [outerRadius, setOuterRadius] = useState(4);
  const outerRadiusChange = (event) => {
    setOuterRadius(parseFloat(event.target.value));
  };

  const [thickness, setThickness] = useState(2);
  const thicknessChange = (event) => {
    setThickness(parseFloat(event.target.value));
    setOuterRadius(2*parseFloat(event.target.value));
  };

  const [length, setLength] = useState(1);
  const [density, setDensity] = useState(7850);
  

  const [data, setData] = useState({});
  const [weightPerLength, setWeightPerLength] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);
  const [stripWidth, setStripWidth] = useState(0);
  const [outLine, setOutLine] = useState(0);
  const [area, setArea] = useState(0);
  
  const [inertiax, setInertiax] = useState(0);
  const [inertiay, setInertiay] = useState(0);
  const [morx, setMorx] = useState(0); // Moment of resistance W(x)
  const [mory, setMory] = useState(0); // Moment of resistance W(y)
  const [rogx, setRogx] = useState(0); // Radius of gyration i(x)
  const [rogy, setRogy] = useState(0); // Radius of gyration i(y)
  const [inertiaxy, setInertiaxy] = useState(0); // Centrifugal moment I(xy)
  const [pmoi, setPmoi] = useState(0); // Polar moment of inertia Ip
  const [paangle, setPaangle] = useState(0); // Principal axis angle
  const [inertiau, setInertiau] = useState(0); // Moment of inertia I(u)
  const [inertiav, setInertiav] = useState(0); // Moment of inertia I(v)
  const [moru, setMoru] = useState(0); // Moment of resistance W(u)
  const [morv, setMorv] = useState(0); // Moment of resistance W(v)
  const [rogu, setRogu] = useState(0); // Radius of gyration I(u)
  const [rogv, setRogv] = useState(0); // Radius of gyration I(v)

  const handleData = (data) => {
    setData(data); // Receive and store the object
  };

  const submitClick = () => {
    setWeightPerLength(((data.sw)*thickness*density*0.000001).toFixed(3));
    setTotalWeight(((data.sw)*thickness*density*0.000001*length).toFixed(3));
    setStripWidth((data.sw).toFixed(3));
    setOutLine((data.ol).toFixed(3))
    setArea((data.acs).toFixed(3));
    setInertiax((data.Ix).toFixed(3));
    setInertiay((data.Iy).toFixed(3));
    setRogx((Math.sqrt(data.Ix/data.acs)*10).toFixed(3));
    setRogy((Math.sqrt(data.Iy/data.acs)*10).toFixed(3));
    setPmoi((Number(data.Ix) + Number(data.Iy)).toFixed(3));
    setMorx((data.Ix/data.ymax).toFixed(3));
    setMory((data.Iy/data.xmax).toFixed(3));
    if(data.Ix !== data.Iy) setPaangle((data.Paa).toFixed(3));
    setInertiaxy((-data.Ixy).toFixed(3))
    setInertiau((data.Iu).toFixed(3))
    setInertiav((data.Iv).toFixed(3));
    setRogu((Math.sqrt(data.Iu/data.acs)*10).toFixed(3));
    setRogv((Math.sqrt(data.Iv/data.acs)*10).toFixed(3));
    setMoru((data.Iu/data.vmax).toFixed(3));
    setMorv((data.Iv/data.umax).toFixed(3));
  };

  const resetClick = () => {
    setLength(parseFloat(0));
    setThickness(parseFloat(0));
    setSide1(parseFloat(0));
    setSide2(parseFloat(0));
    setOuterRadius(parseFloat(0))
    setDiameter(parseFloat(0));
    setWeightPerLength(parseFloat(0));
    setTotalWeight(parseFloat(0));
  };

  const groupRef = useRef(new THREE.Group()); // Create a new 3D group without rendering
  const exportToSTL = () => {
    const exporter = new STLExporter();
    const stlString = exporter.parse(groupRef.current); // Export the 3D group
    const blob = new Blob([stlString], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'rectangles.stl';
    link.click();
  };
 
  // Manually create 3D shapes to export, without displaying them
  const create3DShapes = () => {
    const angle = Math.asin((side2/2 + outerRadius)/(diameter/2 - outerRadius))* (180 / Math.PI);
    const aa = Math.PI/180;
    const radius = diameter/2;
    const shapes = [];

    const shape1 = new THREE.Shape();
    shape1.moveTo(100 - (radius - outerRadius)*Math.sin(angle*aa) + outerRadius - thickness,(radius - outerRadius)*Math.cos(angle*aa) - 100);
    shape1.lineTo(100 - (radius - outerRadius)*Math.sin(angle*aa) + outerRadius,(radius - outerRadius)*Math.cos(angle*aa) - 100)
    shape1.absarc(100 - (radius - outerRadius)*Math.sin(angle*aa) + 2*outerRadius - thickness,side1 + outerRadius - radius - thickness - 100,outerRadius - thickness,2*Math.PI/2,3*Math.PI/2,false);
    shape1.absarc(100 + (radius - outerRadius)*Math.sin(angle*aa) - 2*outerRadius + thickness,side1 + outerRadius - radius - thickness - 100,outerRadius - thickness,3*Math.PI/2,0*Math.PI/2,false);
    shape1.absarc(100 + (radius - outerRadius)*Math.sin(angle*aa),(radius - outerRadius)*Math.cos(angle*aa) - 100,outerRadius,2*Math.PI/2,1*Math.PI/2 - angle*aa,true);
    shape1.absarc(100 + (radius - outerRadius)*Math.sin(angle*aa),(radius - outerRadius)*Math.cos(angle*aa) - 100,outerRadius - thickness,1*Math.PI/2 - angle*aa,2*Math.PI/2,false);
    shape1.absarc(100 + (radius - outerRadius)*Math.sin(angle*aa) - 2*outerRadius + thickness,side1 + outerRadius - radius - thickness - 100,outerRadius,0*Math.PI/2,3*Math.PI/2,true);
    shape1.absarc(100 - (radius - outerRadius)*Math.sin(angle*aa) + 2*outerRadius - thickness,side1 + outerRadius - radius - thickness - 100,outerRadius,3*Math.PI/2,2*Math.PI/2,true);
    shape1.lineTo(100 - (radius - outerRadius)*Math.sin(angle*aa) + outerRadius - thickness,(radius - outerRadius)*Math.cos(angle*aa) - 100)
    shapes.push(shape1)
    
    const shape2 = new THREE.Shape();
    shape2.moveTo(100 - (radius - outerRadius)*Math.sin(angle*aa) + outerRadius - thickness,(radius - outerRadius)*Math.cos(angle*aa) - 100)
    shape2.lineTo(100 - (radius - outerRadius)*Math.sin(angle*aa) + outerRadius,(radius - outerRadius)*Math.cos(angle*aa) - 100)
    shape2.absarc(100 - (radius - outerRadius)*Math.sin(angle*aa),(radius - outerRadius)*Math.cos(angle*aa) - 100,outerRadius,0*Math.PI/2,1*Math.PI/2 + angle*aa,false);
    shape2.absarc(100,0 - 100,radius,1*Math.PI/2 + angle*aa,1*Math.PI/2 - angle*aa,false);
    shape2.absarc(100,0 - 100,radius - thickness,1*Math.PI/2 - angle*aa,1*Math.PI/2 + angle*aa,true);
    shape2.absarc(100 - (radius - outerRadius)*Math.sin(angle*aa),(radius - outerRadius)*Math.cos(angle*aa) - 100,outerRadius - thickness,1*Math.PI/2 + angle*aa,0*Math.PI/2,true);
    shape2.lineTo(100 - (radius - outerRadius)*Math.sin(angle*aa) + outerRadius - thickness,(radius - outerRadius)*Math.cos(angle*aa) - 100)
    shapes.push(shape2)

    shapes.forEach((shape) => {
      const geometry = new THREE.ExtrudeGeometry(shape, { depth: length*1000, bevelEnabled: false });
      const material = new THREE.MeshNormalMaterial();
      const mesh = new THREE.Mesh(geometry, material);
      groupRef.current.add(mesh); // Add the created mesh to the group
    });
  };
  // Create the shapes as soon as the component mounts
  useEffect(() => {
    groupRef.current.clear();
    create3DShapes();
  }, [side1, side2,diameter, thickness, outerRadius,length]);

  const GraphRef = useRef()

  const handleDownload = () => {
    const doc = new jsPDF();
    html2canvas(GraphRef.current).then((canvas) => {
    doc.setDrawColor("black").setLineWidth(.2).line(4,0,4,300);
    doc.addImage(logo, 'PNG', 75, 2, 60, 10);
    doc.setFont('helvetica',"bold").setFontSize(16).setTextColor('blue').text('Section Characteristics Report', 70, 17);
    doc.setDrawColor("black").setLineWidth(.2).line(0,20,210,20);
    doc.setFont('helvetica',"bold").setFontSize(12).setTextColor('blue').text('Inputs: ', 6, 25);
    doc.setFontSize(10).setTextColor('black').text(`Side(A): ${side1}   Side(B): ${side2}   outerRadius(r): ${outerRadius}   Diameter(d): ${diameter}  Thickness(t): ${thickness}   Length(L): ${length}`, 6, 30);
    doc.setFontSize(12).setTextColor('blue').text('Image: ', 6, 40);
    const imgData = canvas.toDataURL('image/png');
    doc.addImage(imgData, 'PNG', 70, 50, 70, 70); // Adjust dimensions as needed
    doc.setFontSize(12).setTextColor('blue').text('Standard Output: ', 90,130);
    const rows1 = [
      ["Weight per meter", `${weightPerLength} Kg/m`, "Weight of 6m length", `${totalWeight} kg`],
      ["Calculated strip width", `${stripWidth} mm`, "Outline length", `${outLine} mm`],
      ["Area of cross-section", `${(stripWidth*thickness).toFixed(2)} mm^2`, "Inner bend radius(r)", `NA mm`],
    ];
    doc.autoTable({
      body: rows1,
      startY: 135,  // Position from top
    });
    doc.setDrawColor("black").setLineWidth(.2).line(0,165,210,165);
    doc.setFontSize(12).setTextColor('blue').text('Complete Output: ', 90,175);
    const rows2 = [
      ["Center of mass (x)", "at Origin", "Moment of resistance W(y)", "___ cm^3"],
      ["Center of mass (y)", "at Origin", "Moment of resistance W(y)", "___ cm^3"],
      ["Moment of inertia I(x)", `${inertiax} cm^4`, "Polar moment of inertia Ip", "___ cm^4"],
      ["Moment of inertia I(y)", `${inertiay} cm^4`, "Centrifugal moment I(xy)", "___ cm^4"],
      ["Moment of resistance W(v)", `___ cm^3`,"Principal axis angle", "___ deg"],
      ["Radius of gyration i(v)", `___ cm`, "Moment of resistance W(x)", "___ cm^3"],
      ["Radius of gyration i(u)", `___ cm`, "Radius of gyration i(x)", "___ cm"],
      ["Moment of inertia I(u)", `___ cm^4`, "Radius of gyration i(y)", "___ cm"],
      ["Moment of inertia I(v)", `___ cm^4`, "Moment of resistance W(u)", "___ cm^3"],
    ];
    doc.autoTable({
      body: rows2,
      startY: 180,  // Position from top
    });
    doc.save('file.pdf'); // Specify the file name
    });
  };

  return (
    <div>
      <div className="modal fade" id="exampleModal0" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-body">
                <Feasibility type={"Close"} stripWidth={stripWidth} thickness={thickness} boxPerimeter={boxPerimeter}/>
              </div>  
            </div>
          </div>
        </div>
        <div className="modal fade" id="exampleModal1" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-body">
                <FeasibilityL1 type={"Close"} stripWidth={stripWidth} thickness={thickness} boxPerimeter={boxPerimeter}  length={length}/>
              </div>  
            </div>
          </div>
        </div>
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative'}}>
      <h1 className="heading">Hand Rail</h1>
      <div className="btn-group" role="group" style={{marginLeft: 'auto', transform: 'translateX(-35%)'}}>
        <button title={Props.title2} type="button"  className="btn btn dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" style={{ color: 'white', backgroundColor: '#1b065c'}}>
        <i className="fa-solid fa-download"></i>
        </button>
        <ul className="dropdown-menu">
          <li><a className="dropdown-item" onClick={handleDownload}>Export as PDF</a></li>
          <li><a className="dropdown-item" onClick={exportToSTL}>Export as STL</a></li>
        </ul>
        <button title={Props.title2} type="button"  className="btn btn dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" style={{marginInline: "10px", color: 'white', backgroundColor: '#1b065c', borderRadius: "5px"}}>
            Feasibility?
          </button>
          <ul className="dropdown-menu">
            <li><button type="button" className="btn btn" data-bs-toggle="modal" data-bs-target="#exampleModal0" onClick={submitClick}>Feasibility L0</button></li>
            <li><button type="button" className="btn btn" data-bs-toggle="modal" data-bs-target="#exampleModal1" onClick={submitClick}>Feasibility L1</button></li>
          </ul>
      </div>
    </div>
      <div className = "container">
        <div className='box'>
          <div style={{ color: 'white', backgroundColor: '#1b065c', fontWeight: 'bold'}}>Input</div>
           <div className="container1">
            <lable className="label" htmlFor="side1">Side (A) mm</lable>
             <input className="input-field" id="side1" type="number" value={side1} onChange={side1Change} placeholder="Type something..." />
          </div>
           <div className="container1">
            <lable className="label" htmlFor="side2">Side (B) mm</lable>
             <input className="input-field" id="side2" type="number" value={side2} onChange={side2Change} placeholder="Type something..." />
          </div>
          <div className="container1">
            <lable className="label" htmlFor="Radius">Diameter (d) mm</lable>
             <input className="input-field" id="diameter" type="number" value={diameter} onChange={diameterChange} placeholder="Type something..." />
          </div>
           <div className="container1">
            <lable className="label" htmlFor="thickness">Thickness (t) mm</lable>
             <input className="input-field" id="thickness" type="number" value={thickness} onChange={thicknessChange} placeholder="Type something..." />
          </div>
          <div className="container1">
            <lable className="label" htmlFor="Radius">OuterRadius (r) mm</lable>
             <input className="input-field" id="Radius" type="number" value={outerRadius} onChange={outerRadiusChange} placeholder="Type something..." />
          </div>
           <CommonInput density={density} setDensity={setDensity} mat={materials} length={length} setLength={setLength}/>
          <button type="button" className="btn btn mx-2" onClick={submitClick} style={{ color: 'white', backgroundColor: '#1b065c'}}>Submit</button>
          <button type="button" className="btn btn mx-2" onClick={resetClick} style={{ color: 'white', backgroundColor: '#1b065c'}}>Reset</button>
        </div>
        <div className='box'>
          <div ref={GraphRef}><Round_3_graph side11={side1} side22={side2} diameter1={diameter} thickness1={thickness} outerRadius1={outerRadius} sendValue={handleData}/></div>
        </div>
        <div className='box'>
        <Result weightPerLength={weightPerLength} length={length} totalWeight={totalWeight} stripWidth={stripWidth} outLine={outLine} area={area} inertiax={inertiax} inertiay={inertiay} rogx={rogx} rogy={rogy} pmoi={pmoi} morx={morx} mory={mory} inertiaxy={inertiaxy} paangle={paangle} inertiau={inertiau} inertiav={inertiav} rogu={rogu} rogv={rogv} moru={moru} morv={morv}/>
        </div>
      </div>
    </div>
  );
}

export default Round_3;
