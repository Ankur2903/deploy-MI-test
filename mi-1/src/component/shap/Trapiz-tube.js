import React, { useState,useRef ,useEffect } from 'react';
import * as THREE from 'three';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import logo from '../Image/logo.192.jpg';
import Triangular_slit_graph from '../Graph/Triangular-slit';
import '../../App.css'
import 'jspdf-autotable';
import Result from './Result';
import Trapiz_tube_graph from '../Graph/Trapiz-tube';
import { abs } from 'three/webgpu';

function Trapiz_tube() {
  const [length, setLength] = useState(1);
  const lengthChange = (event) => setLength(parseFloat(event.target.value));

  const [thickness, setThickness] = useState(2);
  const thicknessChange = (event) =>{
    setThickness(parseFloat(event.target.value));
    setOuterRadius(2*parseFloat(event.target.value));
  }

  const [side1, setSide1] = useState(65);
  const side1Change = (event) => setSide1(parseFloat(event.target.value));

  const [side2, setSide2] = useState(54);
  const side2Change = (event) => setSide2(parseFloat(event.target.value));

  const [side3, setSide3] = useState(60);
  const side3Change = (event) => setSide3(parseFloat(event.target.value));

  const [side4, setSide4] = useState(22);
  const side4Change = (event) => setSide4(parseFloat(event.target.value));

  const [side5, setSide5] = useState(14);
  const side5Change = (event) => setSide5(parseFloat(event.target.value));

  const [outerRadius, setOuterRadius] = useState(4);
  const outerRadiusChange = (event) => setOuterRadius(parseFloat(event.target.value));

  const [weightPerLength, setWeightPerLenght] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);
  const [stripWidth, setStripWidth] = useState(0);
  const [outLine, setOutLine] = useState(0);
  const [area, setArea] = useState(0);
  const [comy, setComy] = useState(0);
  const [inertiax, setInertiax] = useState(0);
  const [inertiay, setInertiay] = useState(0);

  

  const handleComy = (e) => {
    setComy(e);
  };

  const angle1 = Math.asin((side1 - side2)/side5);
  const angle2 = Math.atan((2*side2)/(side3 - side4));
  const angle3 = angle1 + angle2;
  const aa = 180/Math.PI;

  const l1 = side5 - outerRadius*(Math.tan(angle1/2) + 1/Math.tan(angle3/2));
  const l2 = side3 - 2*outerRadius*(Math.tan(angle1/2)) - 2*side5*Math.cos(angle1);
  const l3 = side4 - 2*outerRadius*(Math.tan(angle2/2));
  const l4 = side2/Math.sin(angle2) - outerRadius*(Math.tan(angle2/2) + 1/Math.tan(angle3/2))

  const x1 = outerRadius;
  const y1 = side1 - side2 + outerRadius*Math.sin(angle3/2 - angle1)/Math.sin(angle3/2);

  const x2 = x1 + l1*Math.cos(angle1)
  const y2 = y1 - l1*Math.sin(angle1)

  const x3 = x2 + l2;
  const y3 = y2;

  const x4 = x3 +  l1*Math.cos(angle1);
  const y4 = y1;

  const x6 = x1 - outerRadius*Math.cos(angle3/2 - angle1)/Math.sin(angle3/2) + side3/2 - side4/2 + outerRadius*Math.tan(angle2/2);
  const y6 = side1 - outerRadius;

  const x5 = x6 + side4 - 2*outerRadius*Math.tan(angle2/2);
  const y5 = y6


  const submitClick = () => {
    setWeightPerLenght((7850*(2*Math.PI*(outerRadius - 0.596*thickness) + 2*l1 + l2 + l3 + 2*l4)*thickness*0.000001).toFixed(3));

    setTotalWeight((7850*(2*Math.PI*(outerRadius - 0.596*thickness) + 2*l1 + l2 + l3 + 2*l4)*thickness* 0.000001*length).toFixed(3));

    setStripWidth((2*Math.PI*(outerRadius - 0.596*thickness) + 2*l1 + l2 + l3 + 2*l4).toFixed(3));

    setOutLine((2*Math.PI*(2*outerRadius - thickness) + 4*l1 + 2*l2 + 2*l3 + 4*l4).toFixed(3))

    setArea((Math.PI*(Math.pow(outerRadius, 2) - Math.pow(outerRadius  - thickness,2)) + thickness(2*l1 + l2 + l3 + 2*l4)).toFixed(3))
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
    setWeightPerLenght(0);
    setTotalWeight(0);
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
    shape1.moveTo(x2,  thickness)
    shape1.lineTo(x2, 0)
    shape1.absarc(x3,y3, outerRadius, 3*Math.PI/2, 3*Math.PI/2 + angle1, false)
    shape1.absarc(x4,y4, outerRadius, 3*Math.PI/2 + angle1, Math.PI/2 + angle1 - angle3, false)
    shape1.absarc(x5, y5, outerRadius, Math.PI/2 + angle1 - angle3, Math.PI/2, false)
    shape1.lineTo(x6, side1)
    shape1.lineTo(x6, side1 - thickness)
    shape1.absarc(x5, y5, outerRadius - thickness, Math.PI/2, Math.PI/2 + angle1 - angle3, true)
    shape1.absarc(x4,y4, outerRadius - thickness, Math.PI/2 + angle1 - angle3, 3*Math.PI/2 + angle1, true)
    shape1.absarc(x3,y3, outerRadius - thickness, 3*Math.PI/2 + angle1, 3*Math.PI/2, true)
    shape1.lineTo(x2, thickness)
    shapes.push(shape1)

    const shape2 = new THREE.Shape();
    shape2.moveTo(x6, side1 - thickness)
    shape2.lineTo(x6, side1)
    shape2.absarc(x6,y6, outerRadius, Math.PI/2, Math.PI/2 + angle2, false)
    shape2.absarc(x1, y1, outerRadius, Math.PI/2 + angle2, 3*Math.PI/2 + angle2 - angle3, false)
    shape2.absarc(x2, y2, outerRadius, 3*Math.PI/2 + angle2 - angle3, 3*Math.PI/2, false)
    shape2.lineTo(x2, thickness)
    shape2.absarc(x2, y2, outerRadius - thickness, 3*Math.PI/2, 3*Math.PI/2 + angle2 - angle3, true)
    shape2.absarc(x1, y1, outerRadius - thickness, 3*Math.PI/2 + angle2 - angle3, Math.PI/2 + angle2, true)
    shape2.absarc(x6,y6, outerRadius - thickness, Math.PI/2 + angle2, Math.PI/2, true)
    shape2.lineTo(x6, side1)
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
  }, [side1,side2,side3, side4, side5, outerRadius, thickness, length]);


  const triangularSlitGraphRef = useRef()

  const handleDownload = () => {
    const doc = new jsPDF();
    html2canvas(triangularSlitGraphRef.current).then((canvas) => {
    doc.setDrawColor("black").setLineWidth(.2).line(4,0,4,300);
    doc.addImage(logo, 'PNG', 75, 2, 60, 10);
    doc.setFont('helvetica',"bold").setFontSize(16).setTextColor('blue').text('Section Characteristics Report', 70, 17);
    doc.setDrawColor("black").setLineWidth(.2).line(0,20,210,20);
    doc.setFont('helvetica',"bold").setFontSize(12).setTextColor('blue').text('Inputs: ', 6, 25);
    doc.setFontSize(10).setTextColor('black').text(`Side(A): ${side1}   Side(B): ${side2}   Side(C): ${side3}   Side(D): ${side5}   Side(E): ${side5}   Thickness(t): ${thickness}   Length(L): ${length}`, 6, 30);
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
     <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative'}}>
      <h1 className="heading">Trapiz Tube</h1>
      <div className="btn-group" role="group" style={{marginLeft: 'auto', transform: 'translateX(-35%)'}}>
        <button type="button"  className="btn btn-dark dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" style={{ color: 'white', backgroundColor: '#1b065c'}}>
        <i className="fa-solid fa-download"></i>
        </button>
        <ul className="dropdown-menu">
          <li><a className="dropdown-item" onClick={handleDownload}>Export as PDF</a></li>
          <li><a className="dropdown-item" onClick={exportToSTL}>Export as STL</a></li>
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
          <div>
          <button type="button" className="btn btn mx-2" onClick={submitClick} style={{ color: 'white', backgroundColor: '#1b065c'}}>Submit</button>
          <button type="button" className="btn btn mx-2" onClick={resetClick} style={{ color: 'white', backgroundColor: '#1b065c'}}>Reset</button>
          </div>
        </div>
        <div className='box'>
        <div ref={triangularSlitGraphRef}><Trapiz_tube_graph side11={side1} side22 = {side2} side33 = {side3} side44 = {side4} side55 = {side5} thickness1={thickness} outerRadius1={outerRadius} sendValuey={handleComy}/></div>
        </div>
        <div className='box'>
        <Result weightPerLength={weightPerLength} length={length} totalWeight={totalWeight} stripWidth={stripWidth} outLine={outLine} area={area} inertiax={inertiax} inertiay={inertiay}/>
        </div>
      </div>
    </div>
  );
}

export default Trapiz_tube;
