import React, { useState,useRef ,useEffect } from 'react';
import * as THREE from 'three';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import logo from '../Image/logo.192.jpg';
import Flat_oval_graph from '../Graph/Flat-oval';
import '../../App.css'
import 'jspdf-autotable';
import { matchRoutes } from 'react-router-dom';
import Result from './Result';

function Flat_oval() {
  const [side1, setSide1] = useState(40);
  const side1Change = (event) => {
    setSide1(parseFloat(event.target.value));
  };
  const [side2, setSide2] = useState(20);
  const side2Change = (event) => {
    setSide2(parseFloat(event.target.value));
  };

  const [thickness, setThickness] = useState(2);
  const thicknessChange = (event) => {
    setThickness(parseFloat(event.target.value));
  };

  const [length, setLength] = useState(1);
  const lengthChange = (event) => {
    setLength(parseFloat(event.target.value));
  };

  const [weightPerLength, setWeightPerLength] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);
  const [stripWidth,setStripWidth] = useState(0);
  const [outLine, setOutLine] = useState(0);
  const [area, setArea] = useState(0)
  const [inertiax, setInertiaX] = useState(0);
  const [inertiay, setInertiaY] = useState(0);

  const submitClick = () => {
    setWeightPerLength(((2*Math.PI*(side2/2 - thickness/2) +  2*(side1 - side2))*thickness*7850*0.000001).toFixed(3));

    setTotalWeight(((2*Math.PI*(side2/2 - thickness/2) +  2*(side1 - side2))*thickness*7850*0.000001*length).toFixed(3));

    setStripWidth((2*Math.PI*(side2/2 - thickness/2) +  2*(side1 - side2)).toFixed(3));

    setArea((2*(side1 - side2)*thickness + Math.PI*(Math.pow(side2/2,2) - Math.pow(side2/2 - thickness,2))).toFixed(3))

    setOutLine((2*Math.PI*(side2/2) +  4*(side1 - side2) + 2*Math.PI*(side2/2 - thickness) + 2*thickness).toFixed(3))

    // setInertiaX(((((Math.PI/4)*(Math.pow(side2/2,4) - Math.pow((side2-2*thickness)/2,4))) + ((side1 - side2)*thickness*(Math.pow(thickness,2) + Math.pow(-thickness + side2/2,2)))/6)*0.0001).toFixed(2))

    // setInertiaY(((  2*((Math.pow(side2/2,4) - Math.pow(side2/2 - thickness),4)*(Math.PI/8 - 8/(9*Math.PI)) + ((Math.PI*side2/2)/2)*Math.pow(side1/2 - side2/2 + (4*side2/2)/(3*Math.PI),2) + ((Math.PI*(side2-2*thickness)/2)/2)*Math.pow(side1/2 - (side2-2*thickness)/2 + (4*(side2-2*thickness)/2)/(3*Math.PI),2))  +  (thickness*Math.pow(side1 - side2,3))/6)*0.0001).toFixed(2))
  };

  const resetClick = () => {
    setLength(parseFloat(0));
    setThickness(parseFloat(0));
    setSide1(parseFloat(0));
    setSide2(parseFloat(0));
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
    shape1.moveTo(side2/2, thickness);
    shape1.lineTo(side1 - side2/2, thickness);
    shape1.lineTo(side1 - side2/2, 0)
    shape1.lineTo(side2/2, 0)
    shape1.lineTo(side2/2, thickness)
    shapes.push(shape1)

    const shape2 = new THREE.Shape();
    shape2.moveTo(side2/2, side2);
    shape2.lineTo(side2/2, side2 - thickness);
    shape2.absarc(side2/2,side2/2,side2/2 - thickness,1*Math.PI/2,3*Math.PI/2,false)
    shape2.lineTo(side2/2, 0)
    shape2.absarc(side2/2,side2/2,side2/2,3*Math.PI/2,1*Math.PI/2,true)
    shapes.push(shape2)

    const shape3 = new THREE.Shape();
    shape3.moveTo(side2/2, side2 - thickness);
    shape3.lineTo(side2/2, side2);
    shape3.lineTo(side1 - side2/2, side2)
    shape3.lineTo(side1 - side2/2, side2 - thickness)
    shape3.lineTo(side2/2, side2 - thickness)
    shapes.push(shape3)

    const shape4 = new THREE.Shape();
    shape4.moveTo(side1 - side2/2, 0);
    shape4.lineTo(side1 - side2/2, thickness);
    shape4.absarc(side1 - side2/2, side2/2,side2/2 - thickness,3*Math.PI/2,1*Math.PI/2,false)
    shape4.lineTo(side1 - side2/2, side2)
    shape4.absarc(side1 - side2/2, side2/2,side2/2,1*Math.PI/2,3*Math.PI/2,true)
    shapes.push(shape4)

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
  }, [side1, side2, thickness, length]);

  const flatOvalGraphRef = useRef()

  const handleDownload = () => {
    const doc = new jsPDF();
    html2canvas(flatOvalGraphRef.current).then((canvas) => {
    doc.setDrawColor("black").setLineWidth(.2).line(4,0,4,300);
    doc.addImage(logo, 'PNG', 75, 2, 60, 10);
    doc.setFont('helvetica',"bold").setFontSize(16).setTextColor('blue').text('Section Characteristics Report', 70, 17);
    doc.setDrawColor("black").setLineWidth(.2).line(0,20,210,20);
    doc.setFont('helvetica',"bold").setFontSize(12).setTextColor('blue').text('Inputs: ', 6, 25);
    doc.setFontSize(10).setTextColor('black').text(`Width(w): ${side1}   Height(h): ${side2}   Thickness(t): ${thickness}   Length(L): ${length}`, 6, 30);
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
    <>
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative'}}>
      <h1 className="heading">Flat oval</h1>
      <div className="btn-group" role="group" style={{marginLeft: 'auto', transform: 'translateX(-35%)'}}>
        <button type="button"  className="btn btn-dark dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
        <i className="fa-solid fa-download"></i>
        </button>
        <ul className="dropdown-menu">
          <li><a className="dropdown-item" onClick={handleDownload}>export as PDF</a></li>
          <li><a className="dropdown-item" onClick={exportToSTL}>Export as STL</a></li>
        </ul>
      </div>
    </div>
      <div className = "container">
        <div className='box'>
          <div style={{ fontWeight: 'bold' }}>Input</div>
           <div className="container1">
            <lable className="label" htmlFor="side1">Width (w) mm</lable>
             <input className="input-field" id="side1" type="number" value={side1} onChange={side1Change} placeholder="Type something..." />
          </div>
           <div className="container1">
            <lable className="label" htmlFor="side2">Height (h) mm</lable>
             <input className="input-field" id="side2" type="number" value={side2} onChange={side2Change} placeholder="Type something..." />
          </div>
           <div className="container1">
            <lable className="label" htmlFor="thickness">Thickness (t) mm</lable>
             <input className="input-field" id="thickness" type="number" value={thickness} onChange={thicknessChange} placeholder="Type something..." />
          </div>
           <div className="container1">
            <lable className="label" htmlFor="length">Length (L) m</lable>
             <input className="input-field" id="length" type="number" value={length} onChange={lengthChange} placeholder="Type something..." />
          </div>
          <button type="button" className="btn btn-dark mx-2" onClick={submitClick}>Submit</button>
          <button type="button" className="btn btn-dark mx-2" onClick={resetClick}>Reset</button>
        </div>
        <div className='box'>
          <div ref={flatOvalGraphRef}><Flat_oval_graph side1={side1} outerRadius1={side2/2} thickness1={thickness}/></div>
        </div>
        <div className='box'>
        <Result weightPerLength={weightPerLength} length={length} totalWeight={totalWeight} stripWidth={stripWidth} outLine={outLine} area={area} inertiax={inertiax} inertiay={inertiay}/>
        </div>
      </div>
    </>
  );
}

export default Flat_oval;
