import React, { useState,useRef ,useEffect } from 'react';
import * as THREE from 'three';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import logo from '../Image/logo.192.jpg';
import U_channel_graph from '../Graph/U-channel';
import '../../App.css'
import 'jspdf-autotable';
import Result from './Result';

function U_channel() {
  const [length, setLength] = useState(1);
  const lengthChange = (event) => {
    setLength(parseFloat(event.target.value));
  };

  const [thickness, setThickness] = useState(2);
  const thicknessChange = (event) => {
    setThickness(parseFloat(event.target.value));
    setOuterRadius(2*parseFloat(event.target.value));
  };

  const [side1, setSide1] = useState(40);
  const side1Change = (event) => {
    setSide1(parseFloat(event.target.value));
  };

  const [side2, setSide2] = useState(20);
  const side2Change = (event) => {
    setSide2(parseFloat(event.target.value));
  };

  const [outerRadius, setOuterRadius] = useState(4);
  const outerRadiusChange = (event) => {
    setOuterRadius(parseFloat(event.target.value));
  };

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



  const submitClick = () => {
    setWeightPerLenght((7850*(Math.PI*(outerRadius - 0.596*thickness) + 2*(side2 - outerRadius) + (side1 - 2*outerRadius))*thickness*0.000001).toFixed(3));

    setTotalWeight(((7850*(Math.PI*(outerRadius - 0.596*thickness) + 2*(side2 - outerRadius) + (side1 - 2*outerRadius))*thickness*0.000001)*length).toFixed(3));

    setStripWidth((Math.PI*(outerRadius - 0.596*thickness) + 2*(side2 - outerRadius) + (side1 - 2*outerRadius)).toFixed(3));

    setOutLine((Math.PI*(2*outerRadius - thickness) + 4*(side2 - outerRadius) + 2*(side1 - 2*outerRadius) + 2*thickness).toFixed(3))

    setArea((thickness*(2*(side2 - outerRadius) + (side1 - 2*outerRadius)) + (Math.PI/2)*(Math.pow(outerRadius,2) - Math.pow(outerRadius - thickness,2))).toFixed(3))

    setInertiax(((2*((Math.pow(outerRadius,4) - Math.pow(outerRadius-thickness,4))*((Math.PI/16) - (4/(9*Math.PI))) + ((Math.PI*outerRadius)/4)*(Math.pow((side2-comy-outerRadius + ((4*outerRadius)/(3*Math.PI))),2)) + ((Math.PI*(outerRadius - thickness))/4)*(Math.pow((side2 - outerRadius -comy + ((4*(outerRadius-thickness))/(3*Math.PI))),2)))  +    2*((side2 - outerRadius)*(thickness)*(Math.pow(side2-outerRadius,2)/12))   +  ((side1 - 2*outerRadius)*(thickness)*(Math.pow(thickness,2)/12 + Math.pow(side2 - comy -thickness/2,2))))*0.0001).toFixed(2))

    setInertiay(((2*((Math.pow(outerRadius,4) - Math.pow(outerRadius-thickness,4))*((Math.PI/16) - (4/(9*Math.PI))) + ((Math.PI*(outerRadius - thickness))/4)*(Math.pow((((side2-2*outerRadius)/2) + ((4*(outerRadius-thickness))/(3*Math.PI))),2)) +  ((Math.PI*outerRadius)/4)*(Math.pow((((side2-2*outerRadius)/2) + ((4*outerRadius)/(3*Math.PI))),2)))  +  2*((side2 - outerRadius)*(thickness)*((Math.pow(thickness,2)/12) + (Math.pow((side1/2 - thickness/2),2))))   +   ((side1 - 2*outerRadius)*(thickness)*(Math.pow((side2-2*outerRadius),2)/12)))*0.0001).toFixed(2));


  };

  const resetClick = () => {
    setLength(parseFloat(0));
    setThickness(parseFloat(0));
    setOuterRadius(parseFloat(0))
    setSide1(parseFloat(0));
    setSide2(parseFloat(0));
    setWeightPerLenght(parseFloat(0));
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
    shape1.moveTo(thickness,side2);
    shape1.lineTo(thickness,outerRadius)
    shape1.absarc(outerRadius, outerRadius,outerRadius - thickness,2*Math.PI/2,3*Math.PI/2,false);
    shape1.lineTo(side1 - outerRadius,thickness)
    shape1.absarc(side1 - outerRadius, outerRadius,outerRadius - thickness,3*Math.PI/2,0*Math.PI/2,false);
    shape1.lineTo(side1 - thickness, side2)
    shape1.lineTo(side1, side2)
    shape1.lineTo(side1,outerRadius)
    shape1.absarc(side1 - outerRadius, outerRadius,outerRadius,0*Math.PI/2,3*Math.PI/2,true);
    shape1.lineTo(outerRadius,0)
    shape1.absarc(outerRadius, outerRadius,outerRadius,3*Math.PI/2,2*Math.PI/2,true);
    shape1.lineTo(0,side2)
    shape1.lineTo(thickness,side2)

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
  }, [side1, side2, outerRadius, thickness, length]);

  const uchannelGraphRef = useRef()

  const handleDownload = () => {
    const doc = new jsPDF();
    html2canvas(uchannelGraphRef.current).then((canvas) => {
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
    <>
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative'}}>
      <h1 className="heading">Round</h1>
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
            <lable className="label" htmlFor="outerRadius">Outer Radius (r) mm</lable>
            <input className="input-field" id="outerRadius" type="number" value={outerRadius} onChange={outerRadiusChange} placeholder="Type something..." />
          </div>
          <div className="container1">
            <lable className="label" htmlFor="length">Length (L) m</lable>
            <input className="input-field" id="length" type="number" value={length} onChange={lengthChange} placeholder="Type something..." />
          </div>
          <div>
          <button type="button" className="btn btn-primary mx-2" onClick={submitClick}>Submit</button>
          <button type="button" className="btn btn-primary mx-2" onClick={resetClick}>Reset</button>
          </div>
        </div>
        <div className='box'>
          <div ref={uchannelGraphRef}><U_channel_graph side1={side1} side2={side2} thickness1={thickness} outerRadius1={outerRadius}  sendValuey={handleComy}/></div>
        </div>
        <div className='box'>
        <Result weightPerLength={weightPerLength} length={length} totalWeight={totalWeight} stripWidth={stripWidth} outLine={outLine} area={area} inertiax={inertiax} inertiay={inertiay}/>
        </div>
      </div>
    </>
  );
}

export default U_channel;