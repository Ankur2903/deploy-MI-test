import React, { useState,useRef ,useEffect } from 'react';
import * as THREE from 'three';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Round_graph from '../Graph/Round'
import '../../App.css'
import logo from '../Image/logo.192.jpg';
import 'jspdf-autotable';
import Result from './Result';

function Round() {
  const [isFormDirty, setIsFormDirty] = useState(true);
  const [length, setLength] = useState(1);
  const [thickness, setThickness] = useState(10);
  const [diameter, setDiameter] = useState(100);
  const [weightPerLength, setWeightPerLength] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);
  const [stripWidth, setStripWidth] = useState(0);
  const [outLine, setOutLine] = useState(0);
  const [inertia, setInertia] = useState(0);
  const [area, setArea] = useState(0);
  const [inertiax, setInertiax] = useState(0);
  const [inertiay, setInertiay] = useState(0);

  


  const submitClick = () => {
    setWeightPerLength((7850*((22/7)*((diameter*diameter)/4) - (22/7)*((diameter - 2*thickness)*(diameter - 2*thickness))/4)*0.000001).toFixed(3));

    setTotalWeight((7850*((22/7)*((diameter*diameter)/4) - (22/7)*((diameter - 2*thickness)*(diameter - 2*thickness))/4)*0.000001*length).toFixed(3));

    setStripWidth((Math.PI*(diameter - thickness)).toFixed(3));

    setArea((Math.PI*Math.pow(diameter/2,2) - Math.PI*Math.pow(diameter/2 - thickness,2)).toFixed(3))

    setOutLine((Math.PI*(diameter) + Math.PI*(diameter - 2*thickness) + 2*thickness).toFixed(3));

    setInertia(((Math.PI/4)*(Math.pow(diameter/2,4) - Math.pow((diameter-2*thickness)/2,4))*0.0001).toFixed(3))
  };

  const resetClick = () => {
    setLength(0);
    setThickness(0);
    setDiameter(0);
    setWeightPerLength(0);
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
    shape1.moveTo(0, diameter/2 - thickness);
    shape1.arc(0,thickness - diameter/2 ,diameter/2 - thickness,1*Math.PI/2,3*Math.PI/2,false)
    shape1.lineTo(0,-diameter/2)
    shape1.arc(0, diameter/2,diameter/2,3*Math.PI/2,1*Math.PI/2,true)
    shape1.lineTo(0,diameter/2 - thickness)
    shapes.push(shape1)

    const shape2 = new THREE.Shape();
    shape2.moveTo(0,thickness - diameter/2);
    shape2.arc(0, diameter/2 - thickness,diameter/2 - thickness,3*Math.PI/2,1*Math.PI/2, false)
    shape2.lineTo(0,diameter/2)
    shape2.arc(0, -diameter/2 , diameter/2, 1*Math.PI/2,3*Math.PI/2,true)
    shape2.lineTo(0,thickness - diameter/2)
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
  }, [diameter, thickness, length]);

  const roundGraphRef = useRef();

  const handleDownload = () => {
    const doc = new jsPDF();
    html2canvas(roundGraphRef.current).then((canvas) => {
    doc.setDrawColor("black").setLineWidth(.2).line(4,0,4,300);
    doc.addImage(logo, 'PNG', 75, 2, 60, 10);
    doc.setFont('helvetica',"bold").setFontSize(16).setTextColor('blue').text('Section Characteristics Report', 70, 17);
    doc.setDrawColor("black").setLineWidth(.2).line(0,20,210,20);
    doc.setFont('helvetica',"bold").setFontSize(12).setTextColor('blue').text('Inputs: ', 6, 25);
    doc.setFontSize(10).setTextColor('black').text(`Diameter(D): ${diameter}   Thickness(t): ${thickness}   Length(L): ${length}`, 6, 30);
    doc.setFontSize(12).setTextColor('blue').text('Image: ', 6, 40);
    const imgData = canvas.toDataURL('image/png');
    doc.addImage(imgData, 'PNG', 70, 50, 70, 70); // Adjust dimensions as needed
    doc.setFontSize(12).setTextColor('blue').text('Standard Output: ', 90,130);
    const rows1 = [
      ["Weight per meter", `${weightPerLength} Kg/m`, "Weight of 6m length", `${totalWeight} kg`],
      ["Calculated strip width", `${stripWidth} mm`, "Outline length", `${outLine} mm`],
      ["Area of cross-section", `${(stripWidth*thickness).toFixed(3)} mm^2`, "Inner bend radius(r)", `NA mm`],
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
      <h1 className="heading">Round Tube</h1>
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
            <lable className="label" htmlFor="diameter">Diameter (D) mm</lable>
            <input className="input-field"  id="diameter" type="number" value={diameter} onChange={(e) => setDiameter(e.target.value)} placeholder="Type something..." />
          </div>
          <div className="container1">
            <lable className="label" htmlFor="width">Thickness (t) mm</lable>
            <input className="input-field" id="width" type="number" value={thickness} onChange={(e) => setThickness(e.target.value)} placeholder="Type something..." />
          </div>
          <div className="container1">
            <lable className="label" htmlFor="length">Length (L) m</lable>
            <input className="input-field" id="length" type="number" value={length} onChange={(e) => setLength(e.target.value)} placeholder="Type something..." />
          </div>
          <button type="button" className="btn btn-primary mx-2" onClick={submitClick}>Submit</button>
          <button type="button" className="btn btn-primary mx-2" onClick={resetClick}>Reset</button>
        </div>
        <div className='box' >
          <div ref={roundGraphRef}><Round_graph radius1 = {diameter/2} thickness1={thickness}/></div>
        </div>
        <div className='box'>
        <Result weightPerLength={weightPerLength} length={length} totalWeight={totalWeight} stripWidth={stripWidth} outLine={outLine} area={area} inertiax={inertiax} inertiay={inertiay}/>
        </div>
      </div>
    </>
  );
}

export default Round;









