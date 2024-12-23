import React, { useState,useRef ,useEffect } from 'react';
import * as THREE from 'three';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import logo from '../Image/logo.192.jpg';
import Square_graph from '../Graph/Square';
import '../../App.css'
import 'jspdf-autotable';
import Result from './Result';


function Square() {
  const [side, setSide] = useState(100);
  const sideChange = (event) => {
    setSide(parseFloat(event.target.value));
  };

  const [thickness, setThickness] = useState(10);
  const thicknessChange = (event) => {
    setThickness(parseFloat(event.target.value));
    setOuterRadius(parseFloat(2*event.target.value));
  };

  const [length, setLength] = useState(1);
  const lengthChange = (event) => {
    setLength(parseFloat(event.target.value));
  };

  const [outerRadius, setOuterRadius] = useState(20);
  const outerRadiusChange = (event) => {
    setOuterRadius(parseFloat(event.target.value));
  };

  const [weightPerLength, setWeightPerLenght] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);
  const [stripWidth, setStripWidth] = useState(0);
  const [area, setArea] = useState(0);
  const [outLine, setOutLine] = useState(0);
  const [inertia, setInertia] = useState(0);
  const [inertiax, setInertiax] = useState(0);
  const [inertiay, setInertiay] = useState(0);

  


  const submitClick = () => {
    setWeightPerLenght(((2*Math.PI*(outerRadius - thickness*0.6) + 4*(side - 2*outerRadius))*thickness*7850*0.000001).toFixed(3));

    setTotalWeight(((2*Math.PI*(outerRadius - thickness*0.6) + 4*(side - 2*outerRadius))*thickness*7850*0.000001* length).toFixed(3));

    setStripWidth((2*Math.PI*(outerRadius - thickness*0.596) + 4*(side - 2*outerRadius)).toFixed(3))

    setOutLine((2*Math.PI*(outerRadius) + 2*Math.PI*(outerRadius - thickness) + 8*(side - 2*outerRadius) + 2*thickness).toFixed(3))

    setArea((thickness*4*(side - 2*outerRadius) + Math.PI*Math.pow(outerRadius,2) - Math.PI*Math.pow(outerRadius - thickness,2)).toFixed(3))

    setInertia(((4*((Math.pow(outerRadius,4) - Math.pow(outerRadius-thickness,4))*((Math.PI/16) - (4/(9*Math.PI))) + ((Math.PI*(outerRadius - thickness))/4)*(Math.pow((((side-2*outerRadius)/2) + ((4*(outerRadius-thickness))/(3*Math.PI))),2)) +  ((Math.PI*outerRadius)/4)*(Math.pow((((side-2*outerRadius)/2) + ((4*outerRadius)/(3*Math.PI))),2)))  +  2*((side - 2*outerRadius)*(thickness)*((Math.pow(thickness,2)/12) + (Math.pow((side/2 - thickness/2),2))))  +  2*((side - 2*outerRadius)*(thickness)*(Math.pow((side-2*outerRadius),2)/12)))*0.0001).toFixed(3))

  }

  const resetClick = () => {
    setLength(0);
    setThickness(0);
    setSide(0);
    setOuterRadius(0);
    setWeightPerLenght(0);
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
    shape1.moveTo(outerRadius, thickness);
    shape1.lineTo(side - outerRadius, thickness);
    shape1.lineTo(side - outerRadius, 0)
    shape1.lineTo(outerRadius, 0)
    shape1.lineTo(outerRadius, thickness)
    shapes.push(shape1)

    const shape2 = new THREE.Shape();
    shape2.moveTo(0, outerRadius);
    shape2.lineTo(thickness, outerRadius);
    shape2.arc(outerRadius - thickness,0,outerRadius - thickness,2*Math.PI/2,3*Math.PI/2,false)
    shape2.lineTo(outerRadius, 0)
    shape2.arc(0,outerRadius,outerRadius,3*Math.PI/2,2*Math.PI/2,true)
    shapes.push(shape2)

    const shape3 = new THREE.Shape();
    shape3.moveTo(0, outerRadius);
    shape3.lineTo(0,side - outerRadius);
    shape3.lineTo(thickness, side - outerRadius)
    shape3.lineTo(thickness, outerRadius)
    shape3.lineTo(0, outerRadius)
    shapes.push(shape3)

    const shape4 = new THREE.Shape();
    shape4.moveTo(outerRadius, side);
    shape4.lineTo(outerRadius, side - thickness);
    shape4.arc(0,-outerRadius + thickness,outerRadius - thickness,1*Math.PI/2,2*Math.PI/2,false)
    shape4.lineTo(0, side - outerRadius)
    shape4.arc(outerRadius, 0,outerRadius,2*Math.PI/2,1*Math.PI/2,true)
    shapes.push(shape4)

    const shape5 = new THREE.Shape();
    shape5.moveTo(outerRadius, side - thickness);
    shape5.lineTo(outerRadius, side);
    shape5.lineTo(side - outerRadius, side)
    shape5.lineTo(side - outerRadius, side - thickness)
    shape5.lineTo(outerRadius, side - thickness)
    shapes.push(shape5)

    const shape6 = new THREE.Shape();
    shape6.moveTo(side, side - outerRadius);
    shape6.lineTo(side - thickness, side - outerRadius);
    shape6.arc(thickness- outerRadius, 0,outerRadius - thickness,0*Math.PI/2,1*Math.PI/2,false)
    shape6.lineTo(side - outerRadius, side)
    shape6.arc(0, - outerRadius,outerRadius,1*Math.PI/2,0*Math.PI/2,true)
    shapes.push(shape6)

    const shape7 = new THREE.Shape();
    shape7.moveTo(side - thickness,side - outerRadius);
    shape7.lineTo(side,side - outerRadius);
    shape7.lineTo(side,outerRadius)
    shape7.lineTo(side - thickness, outerRadius)
    shape7.lineTo(side - thickness,side - outerRadius)
    shapes.push(shape7)

    const shape8 = new THREE.Shape();
    shape8.moveTo(side - outerRadius, 0);
    shape8.lineTo(side - outerRadius, thickness);
    shape8.arc(0, outerRadius - thickness,outerRadius - thickness,3*Math.PI/2,0*Math.PI/2,false)
    shape8.lineTo(side, outerRadius)
    shape8.arc( -outerRadius,0,outerRadius,0*Math.PI/2,3*Math.PI/2,true)
    shapes.push(shape8)

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
  }, [side, outerRadius, thickness, length]);



  const squareGraphRef = useRef()

  const handleDownload = () => {
    const doc = new jsPDF();
    html2canvas(squareGraphRef.current).then((canvas) => {
    doc.setDrawColor("black").setLineWidth(.2).line(4,0,4,300);
    doc.addImage(logo, 'PNG', 75, 2, 60, 10);
    doc.setFont('helvetica',"bold").setFontSize(16).setTextColor('blue').text('Section Characteristics Report', 70, 17);
    doc.setDrawColor("black").setLineWidth(.2).line(0,20,210,20);
    doc.setFont('helvetica',"bold").setFontSize(12).setTextColor('blue').text('Inputs: ', 6, 25);
    doc.setFontSize(10).setTextColor('black').text(`Side(A): ${side}   Thickness(t): ${thickness}   Length(L): ${length}`, 6, 30);
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
      ["Moment of inertia I(x)", `${inertia} cm^4`, "Polar moment of inertia Ip", "___ cm^4"],
      ["Moment of inertia I(y)", `${inertia} cm^4`, "Centrifugal moment I(xy)", "___ cm^4"],
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
      <h1 className="heading">Square Tube</h1>
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
            <lable className="label" htmlFor="side">Side (A) mm</lable>
            <input className="input-field" id="side" type="number" value={side} onChange={sideChange} placeholder="Type something..." />
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
          <button type="button" className="btn btn-primary mx-2" onClick={submitClick}>Submit</button>
          <button type="button" className="btn btn-primary mx-2" onClick={resetClick}>Reset</button>
        </div>
        <div className='box'>
          <div ref={squareGraphRef}><Square_graph side1 = {side} thickness1={thickness} outerRadius1={outerRadius}/></div>
        </div>
        <div className='box'>
        <Result weightPerLength={weightPerLength} length={length} totalWeight={totalWeight} stripWidth={stripWidth} outLine={outLine} area={area} inertiax={inertiax} inertiay={inertiay}/>
        </div>
      </div>
    </>
  );
}

export default Square;

