import { useState,useRef ,useEffect } from 'react';
import * as THREE from 'three';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import logo from '../Image/logo.192.jpg';
import 'jspdf-autotable';
import '../../App.css'
import L_angle_2_graph from '../Graph/L-angle-2';
import Result from './Result';

function L_angle_2() {
  const [length, setLength] = useState(1);
  const [thickness, setThickness] = useState(2);
  const [side1, setSide1] = useState(60);
  const [side2, setSide2] = useState(60);
  const [side3, setSide3] = useState(30);
  const [side4, setSide4] = useState(30);
  const [side5, setSide5] = useState(27);
  const [side6, setSide6] = useState(27);
  const [outerRadius, setOuterRadius] = useState(4);
  const [weightPerLength, setWeightPerLength] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);
  const [comx, setComx] = useState(0);
  const [comy, setComy] = useState(0);
  const [stripWidth, setStripWidth] = useState(0);
  const [area, setArea] = useState(0);
  const [outLine, setOutLine] = useState(0);
  const [inertiax, setInertiax] = useState(0);
  const [inertiay, setInertiay] = useState(0);

  const handleComx = (e) => {
    setComx(e);
  };

  const handleComy = (e) => {
    setComy(e);
  };

  const lengthChange = (event) => setLength(parseFloat(event.target.value));
  const thicknessChange = (event) =>{
    setThickness(parseFloat(event.target.value));
    setOuterRadius(parseFloat(2*event.target.value));
  }
  const side1Change = (event) => setSide1(parseFloat(event.target.value));
  const side2Change = (event) => setSide2(parseFloat(event.target.value));
  const side3Change = (event) => setSide3(parseFloat(event.target.value));
  const side4Change = (event) => setSide4(parseFloat(event.target.value));
  const side5Change = (event) => setSide5(parseFloat(event.target.value));
  const side6Change = (event) => setSide6(parseFloat(event.target.value));
  const outerRadiusChange = (event) => setOuterRadius(parseFloat(event.target.value));

  const submitClick = () => {
    setWeightPerLength(((5*Math.PI*(outerRadius - 0.596*thickness)/2+ (side2 - 2*outerRadius) + (side3 - 2*outerRadius) + (side4 - 2*outerRadius) + (side5 - outerRadius) + (side6 - outerRadius) +  (side1 - 2*outerRadius))*thickness*7850*0.000001).toFixed(3));

    setTotalWeight(((5*Math.PI*(outerRadius - 0.596*thickness)/2+ (side2 - 2*outerRadius) + (side3 - 2*outerRadius) + (side4 - 2*outerRadius) + (side5 - outerRadius) + (side6 - outerRadius) +  (side1 - 2*outerRadius))*thickness*7850*0.000001 * length).toFixed(2));

    setStripWidth((5*Math.PI*(outerRadius - 0.596*thickness)/2 + (side2 - 2*outerRadius) + (side3 - 2*outerRadius) + (side4 - 2*outerRadius) + (side5 - outerRadius) + (side6 - outerRadius) +  (side1 - 2*outerRadius)).toFixed(3))

    setOutLine((5*Math.PI*(2*outerRadius - thickness)/2 + 2*(side2 - 2*outerRadius) +  2*(side1 - 2*outerRadius) + 2*(side3 - 2*outerRadius) +  2*(side4 - 2*outerRadius) + 2*(side5 - outerRadius) + 2*(side6 - outerRadius) + 2* thickness).toFixed(3));

    setArea((thickness*((side2 - 2*outerRadius) +  (side1 - 2*outerRadius) + (side3 - 2*outerRadius) +  (side4 - 2*outerRadius) + (side5 - outerRadius) + (side6 - outerRadius)) + 5*(Math.PI/4)*(Math.pow(outerRadius,2) - Math.pow(outerRadius - thickness,2))).toFixed(3))

    // setInertiax((((Math.pow(outerRadius,4) - Math.pow(outerRadius - thickness,4))*(Math.PI/16 - 4/(9*Math.PI)) +  ((Math.PI*outerRadius)/4)*Math.pow(comx + thickness/2 - outerRadius + (4*outerRadius)/(3*Math.PI),2) - ((Math.PI*(outerRadius - thickness))/4)*Math.pow(comx + thickness/2 - outerRadius + (4*(outerRadius - thickness))/(3*Math.PI),2)    +   ((side2 - outerRadius)*Math.pow(thickness,3))/12 + (side2-outerRadius)*(thickness)*Math.pow(comx,2)  +  ((side1 - outerRadius)*Math.pow(side1-outerRadius,3))/12 + (side1 - outerRadius)*thickness*Math.pow(side1/2 + outerRadius -comx -thickness/2,2))*0.0001).toFixed(2));

    // setInertiay((((Math.pow(outerRadius,4) - Math.pow(outerRadius - thickness,4))*(Math.PI/16 - 4/(9*Math.PI)) +  ((Math.PI*outerRadius)/4)*Math.pow(comy + thickness/2 - outerRadius + (4*outerRadius)/(3*Math.PI),2) - ((Math.PI*(outerRadius - thickness))/4)*Math.pow(comy + thickness/2 - outerRadius + (4*(outerRadius - thickness))/(3*Math.PI),2)    +   ((side1 - outerRadius)*Math.pow(thickness,3))/12 + (side1-outerRadius)*(thickness)*Math.pow(comy,2)  +  ((side2 - outerRadius)*Math.pow(side2-outerRadius,3))/12 + (side2 - outerRadius)*thickness*Math.pow(side2/2 + outerRadius -comy -thickness/2,2))*0.0001).toFixed(2))
  };

  const resetClick = () => {
    setLength(0);
    setThickness(0);
    setSide1(0);
    setSide2(0);
    setSide3(0);
    setSide4(0);
    setSide5(0);
    setSide6(0);
    setOuterRadius(0);
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
    shape1.moveTo(side3 - thickness ,side1 - side5);
    shape1.lineTo(side3 ,side1 - side5);
    shape1.absarc(side3 - outerRadius,side1 - outerRadius,outerRadius,0*Math.PI/2,1*Math.PI/2,false);
    shape1.absarc(outerRadius,side1 - outerRadius,outerRadius,1*Math.PI/2,2*Math.PI/2,false);
    shape1.absarc(outerRadius,outerRadius,outerRadius,2*Math.PI/2,3*Math.PI/2,false);
    shape1.absarc(side2 - outerRadius,outerRadius,outerRadius,3*Math.PI/2,0*Math.PI/2,false);
    shape1.absarc(side2 - outerRadius,side4 - outerRadius,outerRadius,0*Math.PI/2,1*Math.PI/2,false);
    shape1.lineTo(side2 - side6,side4)
    shape1.lineTo(side2 - side6,side4 - thickness)
    shape1.absarc(side2 - outerRadius,side4 - outerRadius,outerRadius - thickness,1*Math.PI/2,0*Math.PI/2,true);
    shape1.absarc(side2 - outerRadius,outerRadius,outerRadius - thickness,0*Math.PI/2,3*Math.PI/2,true);
    shape1.absarc(outerRadius,outerRadius,outerRadius - thickness,3*Math.PI/2,2*Math.PI/2,true);
    shape1.absarc(outerRadius,side1 - outerRadius,outerRadius - thickness,2*Math.PI/2,1*Math.PI/2,true);
    shape1.absarc(side3 - outerRadius,side1 - outerRadius,outerRadius - thickness,1*Math.PI/2,0*Math.PI/2,true);
    shape1.lineTo(side3 - thickness ,side1 - side5)
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
  }, [side1, side2, side3, side4, side5, side6, outerRadius, thickness, length]);

  const GraphRef = useRef()

  const handleDownload = () => {
    const doc = new jsPDF();
    html2canvas(GraphRef.current).then((canvas) => {
    doc.setDrawColor("black").setLineWidth(.2).line(4,0,4,300);
    doc.addImage(logo, 'PNG', 75, 2, 60, 10);
    doc.setFont('helvetica',"bold").setFontSize(16).setTextColor('blue').text('Section Characteristics Report', 70, 17);
    doc.setDrawColor("black").setLineWidth(.2).line(0,20,210,20);
    doc.setFont('helvetica',"bold").setFontSize(12).setTextColor('blue').text('Inputs: ', 6, 25);
    doc.setFontSize(10).setTextColor('black').text(`Side(A): ${side1}   Side(B): ${side2}   Side(C): ${side3}   Side(D): ${side4}   Side(E): ${side5}   Side(F): ${side6}   Thickness(t): ${thickness}   Length(L): ${length}`, 6, 30);
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
      <h1 className="heading">Double U-Channel</h1>
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
            <lable className="label" htmlFor="side">Side (A) mm</lable>
            <input className="input-field" id="side1" type="number" value={side1} onChange={side1Change} placeholder="Enter side" />
          </div>
          <div className="container1">
            <lable className="label" htmlFor="side2">Side (B) mm</lable>
            <input className="input-field" id="side2" type="number" value={side2} onChange={side2Change} placeholder="Enter side" />
          </div>
          <div className="container1">
            <lable className="label" htmlFor="side">Side (C) mm</lable>
            <input className="input-field" id="side3" type="number" value={side3} onChange={side3Change} placeholder="Enter side" />
          </div>
          <div className="container1">
            <lable className="label" htmlFor="side2">Side (D) mm</lable>
            <input className="input-field" id="side4" type="number" value={side4} onChange={side4Change} placeholder="Enter side" />
          </div>
          <div className="container1">
            <lable className="label" htmlFor="side">Side (E) mm</lable>
            <input className="input-field" id="side5" type="number" value={side5} onChange={side5Change} placeholder="Enter side" />
          </div>
          <div className="container1">
            <lable className="label" htmlFor="side2">Side (F) mm</lable>
            <input className="input-field" id="side6" type="number" value={side6} onChange={side6Change} placeholder="Enter side" />
          </div>
          <div className="container1">
            <lable className="label" htmlFor="thickness">Thickness (t) mm</lable>
            <input className="input-field" id="thickness" type="number" value={thickness} onChange={thicknessChange} placeholder="Enter thickness" />
          </div>
          <div className="container1">
            <lable className="label" htmlFor="outerRadius">Outer Radius (r) mm</lable>
            <input className="input-field" id="outerRadius" type="number" value={outerRadius} onChange={outerRadiusChange} placeholder="Enter radius" />
          </div>
          <div className="container1">
            <lable className="label" htmlFor="length">Length (L) m</lable>
            <input className="input-field" id="length" type="number" value={length} onChange={lengthChange} placeholder="Enter length" />
          </div>
          <button type="button" className="btn btn mx-2" onClick={submitClick} style={{ color: 'white', backgroundColor: '#1b065c'}}>Submit</button>
          <button type="button" className="btn btn mx-2" onClick={resetClick} style={{ color: 'white', backgroundColor: '#1b065c'}}>Reset</button>
        </div>
        <div className='box'>
          <div ref={GraphRef}><L_angle_2_graph side11={side1} thickness1={thickness} side22={side2} side33={side3} side44={side4} side55={side5} side66={side6} outerRadius1={outerRadius} sendValuex={handleComx} sendValuey={handleComy}/></div>
        </div>
        <div className='box'>
        <Result weightPerLength={weightPerLength} length={length} totalWeight={totalWeight} stripWidth={stripWidth} outLine={outLine} area={area} inertiax={inertiax} inertiay={inertiay}/>
        </div>
      </div>
    </div>
  );
}

export default L_angle_2;
