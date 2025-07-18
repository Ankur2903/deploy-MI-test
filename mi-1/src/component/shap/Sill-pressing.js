import React, { useState,useRef ,useEffect } from 'react';
import * as THREE from 'three';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import logo from '../Image/logo.192.jpg';
import '../../App.css'
import 'jspdf-autotable';
import Result from './Result';
import Sill_pressing_graph from '../Graph/Sill-pressing';
import Feasibility from '../Feasibility';
import * as Props from '../constant';

function Sill_pressing() {
  const [parameters, setParameters] = useState(0)
  const [side1, setSide1] = useState(70);
  const side1Change = (event) => {
    setSide1(parseFloat(event.target.value));
  };

  const [side2, setSide2] = useState(35);
  const side2Change = (event) => {
    setSide2(parseFloat(event.target.value));
  };

  const [side3, setSide3] = useState(26);
  const side3Change = (event) => {
    setSide3(parseFloat(event.target.value));
  };

  const [side4, setSide4] = useState(18);
  const side4Change = (event) => {
    setSide4(parseFloat(event.target.value));
  };

  const [side5, setSide5] = useState(44);
  const side5Change = (event) => {
    setSide5(parseFloat(event.target.value));
  };

  const [angle1, setAngle1] = useState(80);
  const angle1Change = (event) => {
    setAngle1(parseFloat(event.target.value));
  };

  const [angle2, setAngle2] = useState(87);
  const angle2Change = (event) => {
    setAngle2(parseFloat(event.target.value));
  };

  const [angle3, setAngle3] = useState(87);
  const angle3Change = (event) => {
    setAngle3(parseFloat(event.target.value));
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

  const aa =  Math.PI/180;
  const l1 = (side2 + thickness - 2*outerRadius + (2*outerRadius - thickness)*Math.cos(aa*angle1))/(Math.sin(aa*angle1))
  const l2 = (side2 + thickness - 2*outerRadius - (2*outerRadius - thickness)*Math.cos(aa*angle2))/(Math.sin(aa*angle2))
  const l3 = (side5 - outerRadius - outerRadius*Math.cos(angle3*aa))/Math.sin(aa*angle3)

  const x1 = side3 - outerRadius*Math.tan(aa*angle1/2);
  
  const x2 = x1 + outerRadius*Math.sin(aa*angle1) + l1*Math.cos(aa*angle1) + (outerRadius - thickness)*Math.sin(aa*angle1)
    
  const x3 = x2 + side4 - outerRadius*(Math.tan(aa*angle1/2) + 1/Math.tan(aa*angle2/2))
  
  const x4 = x3 + (2*outerRadius - thickness)*Math.sin(aa*angle2) - l2*Math.cos(aa*angle2)
  
  const x5 = side1 - outerRadius*Math.tan(aa*(90 - angle3/2))

  const [weightPerLength, setWeightPerLength] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);
  const [stripWidth,setStripWidth] = useState(0);
  const [outLine, setOutLine] = useState(0);
  const [area, setArea] = useState(0)
  const [inertiax, setInertiaX] = useState(0);
  const [inertiay, setInertiaY] = useState(0);

  const submitClick = () => {
    setWeightPerLength((((2*aa*angle1 + 2*aa*angle2 + aa*angle3)*(outerRadius - 0.596*thickness) + (side3 - outerRadius*Math.tan(aa*angle1/2)) + (l1) + (side4 - outerRadius*(Math.tan(aa*angle1/2) + 1/Math.tan(aa*angle2/2))) + (l2) + (x5 - x4) + (l3))*thickness*7850*0.000001).toFixed(3));

    setTotalWeight((((2*aa*angle1 + 2*aa*angle2 + aa*angle3)*(outerRadius - 0.596*thickness) + (side3 - outerRadius*Math.tan(aa*angle1/2)) + (l1) + (side4 - outerRadius*(Math.tan(aa*angle1/2) + 1/Math.tan(aa*angle2/2))) + (l2) + (x5 - x4) + (l3))*thickness*7850*0.000001*length).toFixed(3));

    setStripWidth(((2*aa*angle1 + 2*aa*angle2 + aa*angle3)*(outerRadius - 0.596*thickness) + (side3 - outerRadius*Math.tan(aa*angle1/2)) + (l1) + (side4 - outerRadius*(Math.tan(aa*angle1/2) + 1/Math.tan(aa*angle2/2))) + (l2) + (x5 - x4) + (l3)).toFixed(3))

    setOutLine(((2*aa*angle1 + 2*aa*angle2 + aa*angle3)*(2*outerRadius - thickness) + 2*(side3 - outerRadius*Math.tan(aa*angle1/2)) + 2*(l1) + 2*(side4 - outerRadius*(Math.tan(aa*angle1/2) + 1/Math.tan(aa*angle2/2))) + 2*(l2) + 2*(x5 - x4) + 2*(l3) + 2*thickness).toFixed(3))

    setArea((thickness*((side3 - outerRadius*Math.tan(aa*angle1/2)) + (l1) + (side4 - outerRadius*(Math.tan(aa*angle1/2) + 1/Math.tan(aa*angle2/2))) + (l2) + (x5 - x4) + (l3)) + (aa*angle1 + aa*angle2 + aa*angle3/2)*(Math.pow(outerRadius,2) - Math.pow(outerRadius - thickness, 2))).toFixed(3))
  };

  const resetClick = () => {
    setLength(parseFloat(0));
    setThickness(parseFloat(0));
    setSide1(parseFloat(0));
    setSide2(parseFloat(0));
    setSide3(parseFloat(0));
    setSide4(parseFloat(0));
    setSide5(parseFloat(0));
    setAngle1(parseFloat(0));
    setAngle2(parseFloat(0));
    setAngle3(parseFloat(0));
    setOuterRadius(parseFloat(0));
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
    const shapes = [];

    const shape1 = new THREE.Shape();
    shape1.moveTo(0, side2)
    shape1.lineTo(0, side2 + thickness);
    shape1.absarc(x1, side2 - outerRadius + thickness, outerRadius, Math.PI/2, Math.PI/2 - angle1*aa, true)
    shape1.absarc(x2, outerRadius, outerRadius - thickness, 3*Math.PI/2 - aa*angle1, 3*Math.PI/2, false)
    shape1.absarc(x3, outerRadius, outerRadius - thickness, 3*Math.PI/2 , 3*Math.PI/2 + Math.PI - aa*angle2, false)
    shape1.absarc(x4, side2 -outerRadius + thickness, outerRadius, Math.PI, aa*angle2, true)
    shape1.absarc(x5, side2 + outerRadius, outerRadius - thickness, 3*Math.PI/2, 3*Math.PI/2 + Math.PI - aa*angle3, false)
    shape1.lineTo(x5 + (outerRadius - thickness)*Math.sin(aa*angle3) - l3*Math.cos(aa*angle3), side2 + outerRadius + outerRadius*Math.cos(aa*angle3) + l3*Math.sin(aa*angle3))
    shape1.lineTo(x5 + outerRadius*Math.sin(aa*angle3) - l3*Math.cos(aa*angle3), side2 + outerRadius + outerRadius*Math.cos(aa*angle3) + l3*Math.sin(aa*angle3))
    shape1.absarc(x5, side2 + outerRadius, outerRadius, 3*Math.PI/2 + Math.PI - aa*angle3, 3*Math.PI/2, true)
    shape1.absarc(x4, side2 -outerRadius + thickness, outerRadius - thickness, aa*angle2, Math.PI, false)
    shape1.absarc(x3, outerRadius, outerRadius, 3*Math.PI/2 + Math.PI - aa*angle2, 3*Math.PI/2 , true)
    shape1.absarc(x2, outerRadius, outerRadius, 3*Math.PI/2, 3*Math.PI/2 - aa*angle1, true)
    shape1.absarc(x1, side2 - outerRadius + thickness, outerRadius - thickness, Math.PI/2 - angle1*aa, Math.PI/2, false)
    shape1.lineTo(0, side2)
    shapes.push(shape1)

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
  }, [side1, side2,side3, side4, side5, angle1, angle2, angle3, outerRadius, thickness, length]);

  const GraphRef = useRef()

  const handleDownload = () => {
    const doc = new jsPDF();
    html2canvas(GraphRef.current).then((canvas) => {
    doc.setDrawColor("black").setLineWidth(.2).line(4,0,4,300);
    doc.addImage(logo, 'PNG', 75, 2, 60, 10);
    doc.setFont('helvetica',"bold").setFontSize(16).setTextColor('blue').text('Section Characteristics Report', 70, 17);
    doc.setDrawColor("black").setLineWidth(.2).line(0,20,210,20);
    doc.setFont('helvetica',"bold").setFontSize(12).setTextColor('blue').text('Inputs: ', 6, 25);
    doc.setFontSize(10).setTextColor('black').text(`Side(A): ${side1}   Side(B): ${side2}   Side(C): ${side3}   Side(D): ${side4}   Side(E): ${side5}   Angle(1): ${angle1}   Angle(2): ${angle2}   Angle(3): ${angle3}   Thickness(t): ${thickness}   Length(L): ${length}`, 6, 30);
    doc.setFontSize(12).setTextColor('blue').text('Image: ', 6, 40);
    const imgData = canvas.toDataURL('image/png');
    doc.addImage(imgData, 'PNG', 70, 50, 70, 70); // Adjust dimensions as needed
    doc.setFontSize(12).setTextColor('blue').text('Standard Output: ', 90,130);
    const rows1 = [
      ["Weight per meter", `${weightPerLength} Kg/m`, "Weight of 6m length", `${totalWeight} kg`],
      ["Calculated strip width", `${stripWidth} mm`, "Outline length", `${outLine} mm`],
      ["Area of cross-section", `${(stripWidth*thickness).toFixed(2)} mm^2`, "Inner bend radius(r)", `${outerRadius - thickness} mm`],
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
      <h1 className="heading">Sill Pressing</h1>
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
            <lable className="label" htmlFor="angle1">Angle (1) mm</lable>
            <input className="input-field" id="angle1" type="number" value={angle1} onChange={angle1Change} placeholder="Type something..." />
          </div>
          <div className="container1">
            <lable className="label" htmlFor="angle2">Angle (2) mm</lable>
            <input className="input-field" id="angle2" type="number" value={angle2} onChange={angle2Change} placeholder="Type something..." />
          </div>
          <div className="container1">
            <lable className="label" htmlFor="angle3">Angle (3) mm</lable>
            <input className="input-field" id="angle3" type="number" value={angle3} onChange={angle3Change} placeholder="Type something..." />
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
          <div ref={GraphRef}><Sill_pressing_graph side11={side1} side22={side2} side33 = {side3} side44 = {side4} side55 = {side5} angle11 = {angle1} angle22 = {angle2} angle33 = {angle3} thickness1={thickness} outerRadius1={outerRadius}/></div>
        </div>
        <div className='box'>
        <Result weightPerLength={weightPerLength} length={length} totalWeight={totalWeight} stripWidth={stripWidth} outLine={outLine} area={area} inertiax={inertiax} inertiay={inertiay}/>
        </div>
      </div>
    </div>
  );
}

export default Sill_pressing;
