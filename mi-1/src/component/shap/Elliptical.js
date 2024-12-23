import React, { useState,useRef ,useEffect } from 'react';
import * as THREE from 'three';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import logo from '../Image/logo.192.jpg';
import Elliptical_graph from '../Graph/Elliptical';
import '../../App.css'
import 'jspdf-autotable';
import Result from './Result';

function Elliptical() {
  const [length, setLength] = useState(1);
  const [thickness, setThickness] = useState(2);
  const [side1, setside1] = useState(40);
  const [side2, setside2] = useState(20);
  const [weightPerLength, setWeightPerLength] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);
  const [stripWidth,setStripWidth] = useState(0);
  const [outLine, setOutLine] = useState(0);
  const [area, setArea] = useState(0)
  const [inertiax, setInertiaX] = useState(0);
  const [inertiay, setInertiaY] = useState(0);




  const submitClick = () => {
    setWeightPerLength((7850*(Math.PI*(3*(side1/2 + side2/2 - thickness) - Math.sqrt((3*side1/2 + side2/2 - 2*thickness)*(side1/2 + 3*side2/2 - 2*thickness))))*thickness* 0.000001).toFixed(3));

    setTotalWeight((7850*(Math.PI*(3*(side1/2 + side2/2 - thickness) - Math.sqrt((3*side1/2 + side2/2 - 2*thickness)*(side1/2 + 3*side2/2 - 2*thickness))))*thickness* 0.000001*length).toFixed(3))

    setStripWidth((Math.PI*(3*(side1/2 + side2/2 - thickness) - Math.sqrt((3*side1/2 + side2/2 - 2*thickness)*(side1/2 + 3*side2/2 - 2*thickness)))).toFixed(3));

    setOutLine((Math.PI*(3*(side1/2 + side2/2) - Math.sqrt((3*side1/2 + side2/2)*(side1/2 + 3*side2/2))) + Math.PI*(3*(side1/2 + side2/2 - 2*thickness) - Math.sqrt((3*side1/2 + side2/2 - 4*thickness)*(side1/2 + 3*side2/2 - 4*thickness))) + 2*thickness).toFixed(3))

    setArea((Math.PI*(side1/2)*(side2/2) - Math.PI*(side1/2 - thickness)*(side2/2 - thickness)).toFixed(3))

    // setInertiaX((((Math.PI/4)*(((side1/2)*(Math.pow(side2/2,3))) - (((side1 - 2*thickness)/2)*(Math.pow((side2 - 2*thickness)/2,3)))))*0.0001).toFixed(2))

    // setInertiaY((((Math.PI/4)*(((side2/2)*(Math.pow(side1/2,3))) - (((side2 - 2*thickness)/2)*(Math.pow((side1 - 2*thickness)/2,3)))))*0.0001).toFixed(2))

  };

  const resetClick = () => {
    setLength(0);
    setside1(0);
    setside2(0)
    setThickness(0);
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

    const outerEllipse = new THREE.EllipseCurve(
      0, 0,            // Center of the ellipse (X, Y)
      side1,         // X radius
      side2,         // Y radius
      0, 2 * Math.PI,  // Start angle, end angle (full ellipse)
      false            // Clockwise or not
    );
    const innerEllipse = new THREE.EllipseCurve(
      0, 0,
      side1 - thickness, // X radius reduced by thickness
      side2 - thickness, // Y radius reduced by thickness
      0, 2 * Math.PI,
      true                 // Reverse the direction for proper winding
    );

    // Get points to create outer and inner paths for the elliptical shape
    const outerPoints = outerEllipse.getPoints(1000);
    const innerPoints = innerEllipse.getPoints(1000);

    // Create a shape from the outer and inner ellipse paths
    const shape = new THREE.Shape(outerPoints);
    const holePath = new THREE.Path(innerPoints);
    shape.holes.push(holePath); // Subtract the inner ellipse from the outer ellipse

    shapes.push(shape);

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


  const ellipticalGraphRef = useRef()

  const handleDownload = () => {
    const doc = new jsPDF();
    html2canvas(ellipticalGraphRef.current).then((canvas) => {
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
      <h1 className="heading">Elliptical</h1>
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
            <lable className="label" htmlFor="width">Width (w) mm</lable>
             <input className="input-field" id="width" type="number" value={side1} onChange={(e) => setside1(parseFloat(e.target.value))} placeholder="Type something..." />
          </div>
         <div className="container1">
            <lable className="label" htmlFor="width">Height (h) mm</lable>
             <input className="input-field" id="width" type="number" value={side2} onChange={(e) => setside2(parseFloat(e.target.value))} placeholder="Type something..." />
          </div>
         <div className="container1">
            <lable className="label" htmlFor="width">Thickness (t) mm</lable>
             <input className="input-field" id="width" type="number" value={thickness} onChange={(e) => setThickness(parseFloat(e.target.value))} placeholder="Type something..." />
          </div>
         <div className="container1">
            <lable className="label" htmlFor="length">Length (L) m</lable>
             <input className="input-field" id="length" type="number" value={length} onChange={(e) => setLength(e.target.value)} placeholder="Type something..." />
          </div>
          <button type="button" className="btn btn-primary mx-2" onClick={submitClick}>Submit</button>
          <button type="button" className="btn btn-primary mx-2" onClick={resetClick}>Reset</button>
        </div>
         <div className='box'>
          <div ref={ellipticalGraphRef}><Elliptical_graph side11={side1} side22 = {side2}  thickness1={thickness}/></div>
        </div>
         <div className='box'>
         <Result weightPerLength={weightPerLength} length={length} totalWeight={totalWeight} stripWidth={stripWidth} outLine={outLine} area={area} inertiax={inertiax} inertiay={inertiay}/>
        </div>
      </div>
    </>
  );
}

export default Elliptical;

