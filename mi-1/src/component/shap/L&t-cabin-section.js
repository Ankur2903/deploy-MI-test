import { useState,useRef ,useEffect } from 'react';
import * as THREE from 'three';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import logo from '../Image/logo.192.jpg';
import '../../App.css'
import 'jspdf-autotable';
import Result from './Result';
import L_t_cabin_section_graph from '../Graph/L&t-cabin-section';
import Feasibility from '../Feasibility';
import * as Props from '../constant';

function L_t_cabin_section() {
  const [parameters, setParameters] = useState(0)
  const [side1, setSide1] = useState(75);
  const side1Change = (event) => {
    setSide1(parseFloat(event.target.value));
  };

  const [side2, setSide2] = useState(45);
  const side2Change = (event) => {
    setSide2(parseFloat(event.target.value));
  };

  const [side3, setSide3] = useState(20);
  const side3Change = (event) => {
    setSide3(parseFloat(event.target.value));
  };
  
  const [side4, setSide4] = useState(12);
  const side4Change = (event) => {
    setSide4(parseFloat(event.target.value));
  };

  const [side5, setSide5] = useState(50);
  const side5Change = (event) => {
    setSide5(parseFloat(event.target.value));
  };

  const [thickness, setThickness] = useState(2);
  const thicknessChange = (event) => {
    setThickness(parseFloat(event.target.value));
    setOuterRadius(parseFloat(2*event.target.value));
  };

  const [length, setLength] = useState(1);
  const lengthChange = (event) => {
    setLength(parseFloat(event.target.value));
  };

  const [outerRadius, setOuterRadius] = useState(4);
  const outerRadiusChange = (event) => {
    setOuterRadius(parseFloat(event.target.value));
  };

  const [radius, setRadius] = useState(10);
  const radiusChange = (event) => {
    setRadius(parseFloat(event.target.value));
  };

  const [radius1, setRadius1] = useState(30);
  const radius1Change = (event) => {
    setRadius1(parseFloat(event.target.value));
  };

  const angle = Math.asin((Math.sqrt(Math.pow(2*thickness*(side1 - side3 - side5),2) - 4*(Math.pow(side1 - side3 - side5,2) + Math.pow(side4,2))*(thickness*thickness - side4*side4)) -(2*thickness*(side1 - side3 - side5))) /(2*(Math.pow(side1 - side3 - side5,2) + Math.pow(side4,2))))

  const l = (side4 - thickness*Math.cos(angle))/Math.sin(angle) - 2*radius*Math.tan(angle/2)

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
  const [cmxy, setCmxy] = useState(0); // Centrifugal moment I(xy)
  const [pmoi, setPmoi] = useState(0); // Polar moment of inertia Ip
  const [principalAngle, setPrincipalAngle] = useState(0); // Principal axis angle
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
    setWeightPerLength(((data.sw)*thickness*7850*0.000001).toFixed(3));
    setTotalWeight(((data.sw)*thickness*7850*0.000001*length).toFixed(3));
    setStripWidth((data.sw))
    setOutLine(data.ol)
    setArea(data.acs)
    setInertiax(data.Ix);
    setInertiay(data.Iy);
  };

  const resetClick = () => {
    setLength(0);
    setThickness(0);
    setSide1(0);
    setSide2(0);
    setSide3(0);
    setSide4(0);
    setSide5(0);
    setOuterRadius(0);
    setRadius(0);
    setRadius1(0);
    setWeightPerLength(0);
    setTotalWeight(0);
  }

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
    const shapes = [];
    const shape1 = new THREE.Shape();
    shape1.moveTo(outerRadius, thickness)
    shape1.lineTo(outerRadius, 0)
    shape1.absarc(side1 - outerRadius, outerRadius, outerRadius, 3*Math.PI/2, 0, false)
    shape1.absarc(side1 - outerRadius,side2 - side4 - outerRadius + thickness, outerRadius, 0, Math.PI/2, false)
    shape1.absarc(side1 - side3 + radius*Math.tan(angle/2),side2 - side4 + radius, radius - thickness, 3*Math.PI/2, 3*Math.PI/2 - angle, true)
    shape1.absarc(side5 - radius*Math.tan(angle/2),side2 - radius, radius, Math.PI/2 - angle, Math.PI/2, false)
    shape1.absarc(radius1,side2 - radius1, radius1, Math.PI/2, Math.PI, false)
    shape1.lineTo(0,outerRadius)
    shape1.lineTo(thickness, outerRadius)
    shape1.absarc(radius1,side2 - radius1, radius1 - thickness, Math.PI, Math.PI/2, true)
    shape1.absarc(side5 - radius*Math.tan(angle/2),side2 - radius, radius - thickness, Math.PI/2, Math.PI/2 - angle, true)
    shape1.absarc(side1 - side3 + radius*Math.tan(angle/2),side2 - side4 + radius, radius, 3*Math.PI/2 - angle, 3*Math.PI/2, false)
    shape1.absarc(side1 - outerRadius,side2 - side4 - outerRadius + thickness, outerRadius - thickness, Math.PI/2, 0, true)
    shape1.absarc(side1 - outerRadius, outerRadius, outerRadius - thickness, 0, 3*Math.PI/2, true)
    shapes.push(shape1)

    const shape2 = new THREE.Shape();
    shape2.moveTo(outerRadius,0)
    shape2.absarc(outerRadius, outerRadius, outerRadius, 3*Math.PI/2, Math.PI, true)
    shape2.absarc(outerRadius, outerRadius, outerRadius - thickness, Math.PI, 3*Math.PI/2, false)
    shapes.push(shape2)
   
    shapes.forEach((shape) => {
      const geometry = new THREE.ExtrudeGeometry(shape, { depth: length*1000, bevelEnabled: false });
      const material = new THREE.MeshNormalMaterial();
      const mesh = new THREE.Mesh(geometry, material);
      groupRef.current.add(mesh); // Add the created mesh to the group
    }); 
  };
  // Create the shapes as soon as the component mou nts
  useEffect(() => {
    groupRef.current.clear();
    create3DShapes();
  }, [side1,side2, side3, side4, side5, radius,radius1, outerRadius, thickness, length]);



  const GraphRef = useRef()

  const handleDownload = () => {
    const doc = new jsPDF();
    html2canvas(GraphRef.current).then((canvas) => {
    doc.setDrawColor("black").setLineWidth(.2).line(4,0,4,300);
    doc.addImage(logo, 'PNG', 75, 2, 60, 10);
    doc.setFont('helvetica',"bold").setFontSize(16).setTextColor('blue').text('Section Characteristics Report', 70, 17);
    doc.setDrawColor("black").setLineWidth(.2).line(0,20,210,20);
    doc.setFont('helvetica',"bold").setFontSize(12).setTextColor('blue').text('Inputs: ', 6, 25);
    doc.setFontSize(10).setTextColor('black').text(`Side(A): ${side1}   Side(B): ${side2}   Side(C): ${side3}   Side(D): ${side4}   Side(E): ${side5}   Radius(R1): ${radius1}   Radius(R2): ${radius}   Outer Radius(R): ${outerRadius}`, 6, 30);
    doc.setFontSize(10).setTextColor('black').text(`Thickness(t): ${thickness}   Length(L): ${length}`, 6, 35);
    doc.setFontSize(12).setTextColor('blue').text('Image: ', 6, 40);
    const imgData = canvas.toDataURL('image/png');
    doc.addImage(imgData, 'PNG', 70, 50, 70, 70); // Adjust dimensions as needed
    doc.setFontSize(12).setTextColor('blue').text('Standard Output: ', 90,130);
    const rows1 = [
      ["Weight per meter", `${weightPerLength} Kg/m`, "Weight of 6m length", `${totalWeight} kg`],
      ["Calculated strip width", `${stripWidth} mm`, "Outline length", `${outLine} mm`],
      ["Area of cross-section", `${(stripWidth*thickness).toFixed(3)} mm^2`, "Inner bend radius(r)", `${outerRadius - thickness} mm`],
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
      <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-body">
                <Feasibility type={"Close"} stripWidth={stripWidth} thickness={thickness} parameters={parameters}/>
              </div>  
            </div>
          </div>
        </div>
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative'}}>
      <h1 className="heading">L&T Cabin Section</h1>
      <div className="btn-group" role="group" style={{marginLeft: 'auto', transform: 'translateX(-35%)'}}>
        <button title={Props.title2} type="button"  className="btn btn dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" style={{ color: 'white', backgroundColor: '#1b065c'}}>
        <i className="fa-solid fa-download"></i>
        </button>
        <ul className="dropdown-menu">
          <li><a className="dropdown-item" onClick={handleDownload}>Export as PDF</a></li>
          <li><a className="dropdown-item" onClick={exportToSTL}>Export as STL</a></li>
        </ul>
        <button type="button" className="btn btn" data-bs-toggle="modal" data-bs-target="#exampleModal" style={{marginInline: "10px", color: 'white', backgroundColor: '#1b065c', borderRadius: "5px"}} onClick={submitClick}>Feasibility?</button>
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
            <lable className="label" htmlFor="side3">Side (C) mm</lable>
            <input className="input-field" id="side3" type="number" value={side3} onChange={side3Change} placeholder="Type something..." />
          </div>
          <div className="container1">
            <lable className="label" htmlFor="side4">Side (D) mm</lable>
            <input className="input-field" id="side4" type="number" value={side4} onChange={side4Change} placeholder="Type something..." />
          </div>
          <div className="container1">
            <lable className="label" htmlFor="side5">Side (E) mm</lable>
            <input className="input-field" id="side5" type="number" value={side5} onChange={side5Change} placeholder="Type something..." />
          </div>
          <div className="container1">
            <lable className="label" htmlFor="radius1">Radius (R1) mm</lable>
            <input className="input-field" id="radius1" type="number" value={radius1} onChange={radius1Change} placeholder="Type something..." />
          </div>
          <div className="container1">
            <lable className="label" htmlFor="radius">Radius (R2) mm</lable>
            <input className="input-field" id="radius" type="number" value={radius} onChange={radiusChange} placeholder="Type something..." />
          </div>
          <div className="container1">
            <lable className="label" htmlFor="thickness">Thickness (t) mm</lable>
            <input className="input-field" id="thickness" type="number" value={thickness} onChange={thicknessChange} placeholder="Type something..." />
          </div>
          <div className="container1">
            <lable className="label" htmlFor="outerRadius">Outer Radius (r) mm</lable>
            <input className="input-field" id="outerRadius" type="number" value={outerRadius} onChange={outerRadiusChange} placeholder="Type something..." />
          </div>
          <div className="container1">
            <lable className="label" htmlFor="length">Length (L) m</lable>
            <input className="input-field" id="length" type="number" value={length} onChange={lengthChange} placeholder="Type something..." />
          </div>
          <button type="button" className="btn btn mx-2" onClick={submitClick} style={{ color: 'white', backgroundColor: '#1b065c'}}>Submit</button>
          <button type="button" className="btn btn mx-2" onClick={resetClick} style={{ color: 'white', backgroundColor: '#1b065c'}}>Reset</button>
        </div>
        <div className='box'>
          <div ref={GraphRef}><L_t_cabin_section_graph side11 = {side1} side22 = {side2} side33 = {side3} side44 = {side4} side55 = {side5} radius22 = {radius} radius11 = {radius1} angle1 = {angle} thickness1={thickness} outerRadius1={outerRadius} sendValue={handleData}/></div>
        </div>
        <div className='box'>
        <Result weightPerLength={weightPerLength} length={length} totalWeight={totalWeight} stripWidth={stripWidth} outLine={outLine} area={area} inertiax={inertiax} inertiay={inertiay}/>
        </div>
      </div>
    </div>
  );
}

export default L_t_cabin_section;
