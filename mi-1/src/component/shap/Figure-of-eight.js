import React, { useState,useRef ,useEffect } from 'react';
import * as THREE from 'three';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import logo from '../Image/logo.192.jpg';
import '../../App.css'
import Figure_of_eight_graph from '../Graph/Figure-of-eight';
import 'jspdf-autotable';
import Result from './Result';

function Figure_of_eight() {
  const [length, setLength] = useState(1);
  const lengthChange = (event) => {
    setLength(parseFloat(event.target.value));
  };

  const [thickness, setThickness] = useState(3);
  const thicknessChange = (event) => {
    setThickness(parseFloat(event.target.value));
    setOuterRadius(2*parseFloat(event.target.value));
  };

  const [side1, setSide1] = useState(40);
  const side1Change = (event) => {
    setSide1(parseFloat(event.target.value));
  };

  const [side2, setSide2] = useState(40);
  const side2Change = (event) => {
    setSide2(parseFloat(event.target.value));
  };

  const [side3, setSide3] = useState(50);
  const side3Change = (event) => {
    setSide3(parseFloat(event.target.value));
  };

  const [angle, setAngle] = useState(90);
  const angleChange = (event) => {
    setAngle(parseFloat(event.target.value));
  };

  const [r1, setr1] = useState(20);
  const r1Change = (event) => {
    setr1(parseFloat(event.target.value));
  };

  const [r2, setr2] = useState(20);
  const r2Change = (event) => {
    setr2(parseFloat(event.target.value));
  };

  const [outerRadius, setOuterRadius] = useState(6);
  const outerRadiusChange = (event) => {
    setOuterRadius(parseFloat(event.target.value));
  };

  

  const aa = Math.PI/180
  const angle1 = 180 - angle

  const x1 = side1  + side3 - r1*Math.sin(Math.min(Math.PI/2, (aa)*angle1)) + r1*Math.sin((aa)*angle1);
  const y1 = r1 -  r1*Math.cos((aa)*angle1);

  const x2 = x1 + (side3 - r1*Math.sin(Math.min(Math.PI/2, (aa)*angle1)) - outerRadius)*Math.cos((aa)*angle1) - outerRadius*Math.sin((aa)*angle1);
  const y2 = y1 + (side3 - r1*Math.sin(Math.min(Math.PI/2, (aa)*angle1)) - outerRadius)*Math.sin((aa)*angle1) + outerRadius*Math.cos((aa)*angle1)

  const x3 = x2 + outerRadius*Math.cos(aa*angle1);
  const y3 = y2 + outerRadius*Math.sin(aa*angle1);

  const x4 = x3 - (side2 - 2*outerRadius + thickness)*Math.sin(aa*angle1) + (outerRadius - thickness)*Math.cos(aa*angle1);
  const y4 = y3 + (side2 - 2*outerRadius + thickness)*Math.cos(aa*angle1) + (outerRadius - thickness)*Math.sin(aa*angle1);

  const x5 = x4 - (outerRadius - thickness)*Math.sin(aa*angle1);
  const y5 = y4 + (outerRadius - thickness)*Math.cos(aa*angle1);

  const x6 = x5 + (side1 - 2*outerRadius + thickness)*Math.cos(aa*angle1)  - outerRadius*Math.sin((aa)*angle1);
  const y6 = y5 + (side1 - 2*outerRadius + thickness)*Math.sin(aa*angle1)  + outerRadius*Math.cos((aa)*angle1);

  const x7 = x6 + outerRadius*Math.cos(aa*angle1);
  const y7 = y6 + outerRadius*Math.sin(aa*angle1);

  const len = (x7 - r2 - r2*Math.cos(aa*angle1))/(Math.sin(aa*angle1))

  const x8 = x7 - (len)*Math.sin(aa*angle1) - r2*Math.cos(aa*angle1);
  const y8 = y7 + (len)*Math.cos(aa*angle1) - r2*Math.sin(aa*angle1);

  const x9 = x8 - r2;
  const y9 = y8 - (len);

  
  const len1 = ((1-Math.cos(aa*angle))*(side1 + side3 - r2 - r1*Math.sin(Math.min(Math.PI/2, (aa)*angle)) + (Math.sin(aa*angle))*(r1 - side2 - outerRadius)))/(Math.sin(aa*angle));
  const len2 = side3 - r1*Math.sin(Math.min(Math.PI/2, (aa)*angle)) - outerRadius;

  const [weightPerLength, setWeightPerLenght] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);
  const [stripWidth, setStripWidth] = useState(0);
  const [outLine, setOutLine] = useState(0);
  const [area, setArea] = useState(0);
  const [comy, setComy] = useState(0);
  const [inertiax, setInertiax] = useState(0);
  const [inertiay, setInertiay] = useState(0);

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
    console.log(len)
    const shape1 = new THREE.Shape();
    shape1.moveTo(outerRadius,-side2);
    shape1.lineTo(side1 - outerRadius + thickness,-side2)
    shape1.absarc(side1 - outerRadius + thickness,outerRadius - thickness-side2,outerRadius - thickness,3*Math.PI/2,0*Math.PI/2,false)
    shape1.lineTo(side1,-outerRadius)
    shape1.absarc(side1 + outerRadius, - outerRadius,outerRadius,2*Math.PI/2,1*Math.PI/2,true)
    shape1.lineTo(side1 + outerRadius + side3 - r1*Math.sin(Math.min(Math.PI/2, (aa)*angle1)) - outerRadius,0)
    shape1.absarc(side1 + (side3 - r1*Math.sin(Math.min(Math.PI/2, (aa)*angle1))), - r1,r1,1*Math.PI/2,1*Math.PI/2 - aa*angle1,true)
    shape1.lineTo(x1 + (side3 - r1*Math.sin(Math.min(Math.PI/2, (aa)*angle1)) - outerRadius)*Math.cos(aa*angle1),- y1 -(side3 - r1*Math.sin(Math.min(Math.PI/2, (aa)*angle1)) - outerRadius)*Math.sin(aa*angle1))
    shape1.absarc(x2,-y2,outerRadius,Math.PI/2 - aa*angle1,2*Math.PI-aa*angle1,true)
    shape1.lineTo(x3 - (side2 - 2*outerRadius + thickness)*Math.sin(aa*angle1),- (side2 - 2*outerRadius + thickness)*Math.cos(aa*angle1) - y3)
    shape1.absarc(x4,-y4,outerRadius - thickness,Math.PI - aa*angle1,3*Math.PI/2 - aa*angle1,false)
    shape1.lineTo(x5 + (side1 - 2*outerRadius + thickness)*Math.cos(aa*angle1),-y5 - (side1 - 2*outerRadius + thickness)*Math.sin(aa*angle1))
    shape1.absarc(x6,-y6,outerRadius, Math.PI/2  - aa*angle1,4*Math.PI/2 - aa*angle1,true)
    shape1.lineTo(x7 - len*Math.sin(aa*angle1),-y7 - len*Math.cos(aa*angle1))
    shape1.absarc(x8,-y8,r2,2*Math.PI - aa*angle1,2*Math.PI/2,true)
    shape1.lineTo(0, -side2 - outerRadius)
    shape1.lineTo(thickness,-side2 - outerRadius)
    shape1.lineTo(thickness,-side2 - outerRadius - len)
    shape1.absarc(x8,-y8,r2 - thickness,2*Math.PI/2,2*Math.PI - aa*angle1,false)
    shape1.lineTo(x7 - thickness*Math.cos(aa*angle1),thickness*Math.sin(aa*angle1) - y7)
    shape1.absarc(x6,-y6,outerRadius - thickness,4*Math.PI/2 - aa*angle1,Math.PI/2  - aa*angle1,false)
    // shape1.lineTo(x5 - thickness*Math.sin(aa*angle1),-y5 - thickness*Math.sin(aa*angle1))
    shape1.absarc(x4,-y4,outerRadius,3*Math.PI/2 - aa*angle1,Math.PI - aa*angle1,true)
    shape1.lineTo(x3- thickness*Math.cos(aa*angle1),thickness*Math.sin(aa*angle1) - y3)
    shape1.absarc(x2,-y2,outerRadius - thickness,2*Math.PI-aa*angle1,Math.PI/2 - aa*angle1,false)
    // shape1.lineTo(x1- thickness*Math.sin(aa*angle1),-y1- thickness*Math.sin(aa*angle1))
    shape1.absarc(side1 + (side3 - r1*Math.sin(Math.min(Math.PI/2, (aa)*angle1))), - r1,r1 - thickness,1*Math.PI/2 - aa*angle1,1*Math.PI/2,false)
    shape1.lineTo(side1 + outerRadius,-thickness)
    shape1.absarc(side1 + outerRadius, - outerRadius,outerRadius - thickness,1*Math.PI/2,2*Math.PI/2,false)
    shape1.lineTo(side1 + thickness, outerRadius - side2)
    shape1.absarc(side1 - outerRadius + thickness,outerRadius - thickness-side2,outerRadius,0*Math.PI/2,3*Math.PI/2,true)
    shape1.lineTo(outerRadius,-side2 - thickness)
    shapes.push(shape1)
    console.log("x7")
    console.log(x7 - len*Math.sin(aa*angle1))
    console.log("y7")
    console.log(-y7 - len*Math.cos(aa*angle1))
    

    const shape2 = new THREE.Shape();
    shape2.moveTo(outerRadius, -side2);
    shape2.lineTo(outerRadius, -side2 - thickness);
    shape2.absarc(outerRadius,-outerRadius -side2,outerRadius - thickness,1*Math.PI/2,2*Math.PI/2,false)
    shape2.lineTo(0, -side2 - outerRadius)
    shape2.arc(outerRadius, 0,outerRadius,2*Math.PI/2,1*Math.PI/2,true)
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
  }, [side1, side2,side3,r1,r2,angle,angle1, outerRadius, thickness, length]);


  const Figure_of_eightGraphRef = useRef()
  const handleDownload = () => {
    const doc = new jsPDF();
    html2canvas(Figure_of_eightGraphRef.current).then((canvas) => {
    doc.setDrawColor("black").setLineWidth(.2).line(4,0,4,300);
    doc.addImage(logo, 'PNG', 75, 2, 60, 10);
    doc.setFont('helvetica',"bold").setFontSize(16).setTextColor('blue').text('Section Characteristics Report', 70, 17);
    doc.setDrawColor("black").setLineWidth(.2).line(0,20,210,20);
    doc.setFont('helvetica',"bold").setFontSize(12).setTextColor('blue').text('Inputs: ', 6, 25);
    doc.setFontSize(10).setTextColor('black').text(`Side(A): ${side1}   Side(B): ${side2}   Side(C): ${side3}   Angle(Theta): ${angle}   Radius(R1): ${r1}   Radius(R2): ${r2}   Thickness(t): ${thickness}   Length(L): ${length}`, 6, 30);
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
      ["Moment of inertia I(x)", `inertia cm^4`, "Polar moment of inertia Ip", "___ cm^4"],
      ["Moment of inertia I(y)", `inertia cm^4`, "Centrifugal moment I(xy)", "___ cm^4"],
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



  const handleComy = (e) => {
    setComy(e);
  };

  const submitClick = () => {
    setWeightPerLenght((7850*(3*Math.PI*(outerRadius - 0.596*thickness) + aa*(180 - angle)*(r1 - thickness/2) + aa*(angle)*(r2 - thickness/2) + 2*(side1 - 2*outerRadius + thickness) + 2*(side2 - 2*outerRadius + thickness) + 2*(len1) + 2*(len2))*thickness*0.000001).toFixed(3));

    setTotalWeight((7850*(3*Math.PI*(outerRadius - 0.596*thickness) + aa*(180 - angle)*(r1 - thickness/2) + aa*(angle)*(r2 - thickness/2) + 2*(side1 - 2*outerRadius + thickness) + 2*(side2 - 2*outerRadius + thickness) + 2*(len1) + 2*(len2))*thickness*0.000001*length).toFixed(3));

    setStripWidth((3*Math.PI*(outerRadius - 0.596*thickness) + aa*(180 - angle)*(r1 - thickness/2) + aa*(angle)*(r2 - thickness/2) + 2*(side1 - 2*outerRadius + thickness) + 2*(side2 - 2*outerRadius + thickness) + 2*(len1) + 2*(len2)).toFixed(3));    

    setOutLine((3*Math.PI*(2*outerRadius - thickness) + aa*(180 - angle)*(2*r1 - thickness) + aa*(angle)*(2*r2 - thickness) + 4*(side1 - 2*outerRadius + thickness) + 4*(side2 - 2*outerRadius + thickness) + 4*(len1) + 4*(len2) + 2* thickness).toFixed(3))
    
    setArea((1.5*Math.PI*(Math.pow(outerRadius,2) - Math.pow(outerRadius - thickness,2)) + aa*(90 - angle/2)*(Math.pow(r1,2) - Math.pow(r1 - thickness,2)) + aa*(angle/2)*(Math.pow(r2,2) - Math.pow(r2 - thickness,2)) + (2*(side1 - 2*outerRadius + thickness) + 2*(side2 - 2*outerRadius + thickness) + 2*(len1) + 2*(len2))*thickness).toFixed(3))

    // setInertiax(((1)*0.0001).toFixed(2))

    // setInertiay(((1)*0.0001).toFixed(2));

  }

  const resetClick = () => {
    setLength(0);
    setThickness(0);
    setOuterRadius(parseFloat(0))
    setSide1(0);
    setSide2(0);
    setSide3(0);
    setr1(0);
    setr2(0);
    setWeightPerLenght(0);
    setTotalWeight(0);
  }
  

  return (
    <div style={{transform: 'translateY(-30px)'}}>
       <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative'}}>
      <h1 className="heading">Butterfly  Section</h1>
      <div className="btn-group" role="group" style={{marginLeft: 'auto', transform: 'translateX(-35%)'}}>
        <button type="button"  className="btn btn-dark dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" style={{ color: 'white', backgroundColor: '#1b065c'}}>
        <i className="fa-solid fa-download"></i>
        </button>
        <ul className="dropdown-menu">
          <li><a className="dropdown-item"  onClick={handleDownload}>Export as PDF</a></li> 
          <li><a className="dropdown-item" onClick={exportToSTL}>Export as STL</a></li>
        </ul>
      </div>
    </div>
      <div className = "container">
        <div className='box'>
          <div style={{ color: 'white', backgroundColor: '#1b065c', fontWeight: 'bold'}}>Input</div>
          <div className="container1">
            <lable className="label" htmlFor="side1"> side (A) mm</lable>
            <input className="input-field" id="side1" type="number" value={side1} onChange={side1Change} placeholder="Type something..." />
          </div>
          <div className="container1">
            <lable className="label" htmlFor="side1"> side (B) mm</lable>
            <input className="input-field" id="side1" type="number" value={side2} onChange={side2Change} placeholder="Type something..." />
          </div>
          <div className="container1">
            <lable className="label" htmlFor="side1"> side (C) mm</lable>
            <input className="input-field" id="side1" type="number" value={side3} onChange={side3Change} placeholder="Type something..." />
          </div>
          <div className="container1">
            <lable className="label" htmlFor="angle"> Angle (θ) degree</lable>
            <input className="input-field" id="angle" type="number" value={angle} onChange={angleChange} placeholder="Type something..." />
          </div>
          <div className="container1">
            <lable className="label" htmlFor="side1"> Radius (R1) mm</lable>
            <input className="input-field" id="side1" type="number" value={r1} onChange={r1Change} placeholder="Type something..." />
          </div>
          <div className="container1">
            <lable className="label" htmlFor="side1"> Radius (R2) mm</lable>
            <input className="input-field" id="side1" type="number" value={r2} onChange={r2Change} placeholder="Type something..." />
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
        <div ref={Figure_of_eightGraphRef}><Figure_of_eight_graph side11 = {side1} side22={side2} side33={side3} angle1={angle} r11={r1} r22 = {r2} thickness1={thickness} outerRadius1={outerRadius} sendValuey={handleComy}/></div>
        </div>
        <div className='box'>
        <Result weightPerLength={weightPerLength} length={length} totalWeight={totalWeight} stripWidth={stripWidth} outLine={outLine} area={area} inertiax={inertiax} inertiay={inertiay}/>
        </div>
      </div>
    </div>
  );
}

export default Figure_of_eight;
