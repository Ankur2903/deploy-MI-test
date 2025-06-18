import { useState,useRef ,useEffect } from 'react';
import * as THREE from 'three';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import logo from '../Image/logo.192.jpg';
import '../../App.css'
import 'jspdf-autotable';
import Result from './Result';
import Cat_a_piller_graph from '../Graph/Cat-a-piller';

function Cat_a_piller() {
  const [length, setLength] = useState(1);
  const lengthChange = (event) => {
    setLength(parseFloat(event.target.value));
  };

  const [thickness, setThickness] = useState(2);
  const thicknessChange = (event) => {
    setThickness(parseFloat(event.target.value));
    setOuterRadius(2*parseFloat(event.target.value));
  };

  const [side1, setSide1] = useState(81);
  const side1Change = (event) => {
    setSide1(parseFloat(event.target.value));
  };

  const [side2, setSide2] = useState(70);
  const side2Change = (event) => {
    setSide2(parseFloat(event.target.value));
  };

  const [side3, setSide3] = useState(25);
  const side3Change = (event) => {
    setSide3(parseFloat(event.target.value));
  };

  const [side4, setSide4] = useState(15);
  const side4Change = (event) => {
    setSide4(parseFloat(event.target.value));
  };

  const [side5, setSide5] = useState(103);
  const side5Change = (event) => {
    setSide5(parseFloat(event.target.value));
  };

  const [side6, setSide6] = useState(33);
  const side6Change = (event) => {
    setSide6(parseFloat(event.target.value));
  };

  const [side7, setSide7] = useState(33);
  const side7Change = (event) => {
    setSide7(parseFloat(event.target.value));
  };

  const [side8, setSide8] = useState(6);
  const side8Change = (event) => {
    setSide8(parseFloat(event.target.value));
  };

  const [angle1, setAngle1] = useState(150);
  const angle1Change = (event) => {
    setAngle1(parseFloat(event.target.value));
  };

  const [angle2, setAngle2] = useState(155);
  const angle2Change = (event) => {
    setAngle2(parseFloat(event.target.value));
  };

   const [radius1, setRadius1] = useState(6);
  const radius1Change = (event) => {
    setRadius1(parseFloat(event.target.value));
  };

  const [radius2, setRadius2] = useState(25);
  const radius2Change = (event) => {
    setRadius2(parseFloat(event.target.value));
  };

  const [radius3, setRadius3] = useState(15);
  const radius3Change = (event) => {
    setRadius3(parseFloat(event.target.value));
  };

  const [radius4, setRadius4] = useState(2);
  const radius4Change = (event) => {
    setRadius4(parseFloat(event.target.value));
  };

  const [radius5, setRadius5] = useState(10);
  const radius5Change = (event) => {
    setRadius5(parseFloat(event.target.value));
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

  const aa = Math.PI/180;
  const l2 = (side8 - thickness + radius5  + side2 - radius5/Math.tan(aa*angle1/2) - side5)/(Math.cos(aa*angle1)) 
  const l1 = side1 - radius4 - radius5 - l2*Math.sin(aa*angle1) + thickness - side3 - side4 
  const l3 = (radius3 - radius3*Math.sin(aa*angle2) + radius2*Math.sin(aa*angle2) + side7 - radius2/Math.tan(aa*angle2/2) + side6 - side5)/(Math.cos(aa*angle2))
  const l4 = side1 - radius4 + radius3*Math.cos(angle2*aa) - l3*Math.sin(aa*angle2) - radius2 - radius2*Math.cos(aa*angle2)

  const submitClick = () => {
    setWeightPerLenght((7850*((1.5*Math.PI)*(outerRadius - 0.596*thickness) + (Math.PI/2)*(radius1 - 0.596*thickness) + (Math.PI - aa*angle2)*(radius2 - 0.596*thickness) + (aa*angle2 - Math.PI/2)*(radius3 - 0.596*thickness) +  (Math.PI)*(radius4 - 0.596*thickness) + (Math.PI/2)*(radius5 - 0.596*thickness) + (side3 - 2* outerRadius) + (side4 - radius1 - outerRadius + thickness) + (side6 - outerRadius - radius1 + thickness) + (side7 - outerRadius - radius2/Math.tan(aa*angle2/2)) + l3 + l4 + l2 + l1 + (side2 - outLine - radius5/Math.tan(aa*angle1/2)))*thickness*0.000001).toFixed(3));

    setTotalWeight((7850*((1.5*Math.PI)*(outerRadius - 0.596*thickness) + (Math.PI/2)*(radius1 - 0.596*thickness) + (Math.PI - aa*angle2)*(radius2 - 0.596*thickness) + (aa*angle2 - Math.PI/2)*(radius3 - 0.596*thickness) +  (Math.PI)*(radius4 - 0.596*thickness) + (Math.PI/2)*(radius5 - 0.596*thickness) + (side3 - 2* outerRadius) + (side4 - radius1 - outerRadius + thickness) + (side6 - outerRadius - radius1 + thickness) + (side7 - outerRadius - radius2/Math.tan(aa*angle2/2)) + l3 + l4 + l2 + l1 + (side2 - outLine - radius5/Math.tan(aa*angle1/2)))*thickness*0.000001*length).toFixed(3));

    setStripWidth(((1.5*Math.PI)*(outerRadius - 0.596*thickness) + (Math.PI/2)*(radius1 - 0.596*thickness) + (Math.PI - aa*angle2)*(radius2 - 0.596*thickness) + (aa*angle2 - Math.PI/2)*(radius3 - 0.596*thickness) +  (Math.PI)*(radius4 - 0.596*thickness) + (Math.PI/2)*(radius5 - 0.596*thickness) + (side3 - 2* outerRadius) + (side4 - radius1 - outerRadius + thickness) + (side6 - outerRadius - radius1 + thickness) + (side7 - outerRadius - radius2/Math.tan(aa*angle2/2)) + l3 + l4 + l2 + l1 + (side2 - outLine - radius5/Math.tan(aa*angle1/2))).toFixed(3));

    setOutLine(((1.5*Math.PI)*(2*outerRadius - thickness) + (Math.PI/2)*(2*radius1 - thickness) + (Math.PI - aa*angle2)*(2*radius2 - thickness) + (aa*angle2 - Math.PI/2)*(2*radius3 - thickness) +  (Math.PI)*(2*radius4 - thickness) + (Math.PI/2)*(2*radius5 - thickness) + 2*(thickness +  (side3 - 2* outerRadius) + (side4 - radius1 - outerRadius + thickness) + (side6 - outerRadius - radius1 + thickness) + (side7 - outerRadius - radius2/Math.tan(aa*angle2/2)) + l3 + l4 + l2 + l1 + (side2 - outLine - radius5/Math.tan(aa*angle1/2)))).toFixed(3))

    setArea(((0.75*Math.PI)*(Math.pow(outerRadius,2) - Math.pow(outerRadius - thickness,2)) + (Math.PI/4)*(Math.pow(radius1,2) - Math.pow(radius1 - thickness,2)) + (Math.PI/2 - aa*angle2/2)*(Math.pow(radius2,2) - Math.pow(radius2 - thickness,2)) + (aa*angle2/2 - Math.PI/4)*(Math.pow(radius3,2) - Math.pow(radius3 - thickness,2)) + (Math.PI/2)*(Math.pow(radius4,2) - Math.pow(radius4 - thickness,2)) + (Math.PI/4)*(Math.pow(radius5,2) - Math.pow(radius5 - thickness,2)) + thickness*( (side3 - 2* outerRadius) + (side4 - radius1 - outerRadius + thickness) + (side6 - outerRadius - radius1 + thickness) + (side7 - outerRadius - radius2/Math.tan(aa*angle2/2)) + l3 + l4 + l2 + l1 + (side2 - outLine - radius5/Math.tan(aa*angle1/2)))).toFixed(3))
  }

  const resetClick = () => {
    setLength(0);
    setThickness(0);
    setOuterRadius(parseFloat(0))
    setSide1(0);
    setSide2(0);
    setSide3(0);
    setSide4(0);
    setSide5(0);
    setSide6(0);
    setSide7(0);
    setSide8(0);
    setRadius1(0);
    setRadius2(0);
    setRadius3(0);
    setRadius4(0);
    setRadius5(0);
    setAngle1(0);
    setAngle2(0);
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
    shape1.moveTo(thickness, side5 - side8 + radius4)
    shape1.lineTo(0, side5 - side8 + radius4)
    shape1.absarc(radius4, side5 - radius4, radius4, Math.PI, Math.PI/2, true)
    shape1.absarc(radius4 + l4, side5 - radius3, radius3, Math.PI/2, Math.PI - aa*angle2, true)
    shape1.absarc(side1 - radius2, side6 + side7 - radius2/Math.tan(aa*angle2/2), radius2, Math.PI - aa*angle2, 0, true)
    shape1.absarc(side1 - outerRadius, side6 + outerRadius, outerRadius, 0, 3*Math.PI/2, true)
    shape1.absarc(side1 - side4 + radius1 - thickness, side6 - radius1 + thickness, radius1 - thickness, Math.PI/2, Math.PI, false)
    shape1.absarc(side1 - side4 - outerRadius, outerRadius, outerRadius, 0, 3*Math.PI/2, true)
    shape1.absarc(side1 - side4 - side3 + outerRadius, outerRadius, outerRadius, 3*Math.PI/2, Math.PI, true)
    shape1.absarc(side1 - side4 - side3 - radius5 + thickness, side2 - radius5/Math.tan(aa*angle1/2), radius5 - thickness, 0,  Math.PI - aa*angle1, false)
    shape1.absarc(radius4 + l1, side5 - side8 + thickness - radius5, radius5 - thickness,  Math.PI - aa*angle1, Math.PI/2, false)
    shape1.lineTo(radius4, side5 - side8)
    shape1.lineTo(radius4, side5 - side8 + thickness)
    shape1.absarc(radius4 + l1, side5 - side8 + thickness - radius5, radius5, Math.PI/2,  Math.PI - aa*angle1, true)
    shape1.absarc(side1 - side4 -side3 - radius5 + thickness, side2 - radius5/Math.tan(aa*angle1/2), radius5, Math.PI - aa*angle1, 0, true)
    shape1.absarc(side1 - side4 - side3 + outerRadius, outerRadius, outerRadius - thickness, Math.PI, 3*Math.PI/2, false)
    shape1.absarc(side1 - side4 - outerRadius, outerRadius, outerRadius - thickness, 3*Math.PI/2, 0, false)
    shape1.absarc(side1 - side4 + radius1 - thickness, side6 - radius1 + thickness, radius1, Math.PI, Math.PI/2, true)
    shape1.absarc(side1 - outerRadius, side6 + outerRadius, outerRadius - thickness, 3*Math.PI/2, 0, false)
    shape1.absarc(side1 - radius2, side6 + side7 - radius2/Math.tan(aa*angle2/2), radius2 - thickness, 0, Math.PI - aa*angle2, false)
    shape1.absarc(radius4 + l4, side5 - radius3, radius3 - thickness, Math.PI - aa*angle2, Math.PI/2, false)
    shape1.absarc(radius4, side5 - radius4, radius4 - thickness, Math.PI/2, Math.PI, false)
    shape1.lineTo(thickness, side5 - side8 + radius4)
    shapes.push(shape1)


    const shape2 = new THREE.Shape(); 
    shape2.moveTo(radius4, side5 - side8)
    shape2.lineTo(radius4, side5 - side8 + thickness)
    shape2.absarc( radius4, side5 - side8 + radius4, radius4 - thickness, 3*Math.PI/2, Math.PI, true)
    shape2.lineTo(0,side5 - side8 +  radius4)
    shape2.absarc(radius4,side5 - side8 +  radius4, radius4, Math.PI, 3*Math.PI/2, false)
    shape2.lineTo(radius4, side5 - side8)
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
  }, [side1,side2 ,side3,side4, side5, side6,side7, side8, radius1, radius2, radius3, radius4, radius5, angle1, angle2, outerRadius, thickness, length]);
  
  const GraphRef = useRef()

  const handleDownload = () => {
    const doc = new jsPDF();
    html2canvas(GraphRef.current).then((canvas) => {
    doc.setDrawColor("black").setLineWidth(.2).line(4,0,4,300);
    doc.addImage(logo, 'PNG', 75, 2, 60, 10);
    doc.setFont('helvetica',"bold").setFontSize(16).setTextColor('blue').text('Section Characteristics Report', 70, 17);
    doc.setDrawColor("black").setLineWidth(.2).line(0,20,210,20);
    doc.setFont('helvetica',"bold").setFontSize(12).setTextColor('blue').text('Inputs: ', 6, 25);
    doc.setFontSize(10).setTextColor('black').text(`side(A): ${side1}   side(B): ${side2}   side(C): ${side3}   side(D): ${side4}   side(E): ${side5}   side(F): ${side6}   side(G): ${side7}   side(H): ${side8}   Radius(R1): ${radius1}   Radius(R2): ${radius2}   Radius(R3): ${radius3}   Radius(R4): ${radius4}   Radius(R5): ${radius5}   Angle(D): ${angle1}   Angle(D): ${angle2}Thickness(t): ${thickness}   Length(L): ${length}`, 6, 30);
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
        <h1 className="heading">Cat A-Piller</h1>
        <div className="btn-group" role="group" style={{marginLeft: 'auto', transform: 'translateX(-35%)'}}>
          <button type="button"  className="btn btn dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" style={{ color: 'white', backgroundColor: '#1b065c'}}><i className="fa-solid fa-download"></i>
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
            <lable className="label" htmlFor="side1"> Side (A) mm</lable>
            <input className="input-field" id="side1" type="number" value={side1} onChange={side1Change} placeholder="Type something..." />
          </div>
          <div className="container1">
            <lable className="label" htmlFor="side1"> Side (B) mm</lable>
            <input className="input-field" id="side1" type="number" value={side2} onChange={side2Change} placeholder="Type something..." />
          </div>
          <div className="container1">
            <lable className="label" htmlFor="side1"> Side (C) mm</lable>
            <input className="input-field" id="side1" type="number" value={side3} onChange={side3Change} placeholder="Type something..." />
          </div>
          <div className="container1">
            <lable className="label" htmlFor="side4"> Side (D) mm</lable>
            <input className="input-field" id="side4" type="number" value={side4} onChange={side4Change} placeholder="Type something..." />
          </div>
          <div className="container1">
            <lable className="label" htmlFor="side5"> Side (E) mm</lable>
            <input className="input-field" id="side5" type="number" value={side5} onChange={side5Change} placeholder="Type something..." />
          </div>
          <div className="container1">
            <lable className="label" htmlFor="side6"> Side (F) mm</lable>
            <input className="input-field" id="side6" type="number" value={side6} onChange={side6Change} placeholder="Type something..." />
          </div>
          <div className="container1">
            <lable className="label" htmlFor="side7"> Side (G) mm</lable>
            <input className="input-field" id="side7" type="number" value={side7} onChange={side7Change} placeholder="Type something..." />
          </div>
          <div className="container1">
            <lable className="label" htmlFor="side8"> Side (H) mm</lable>
            <input className="input-field" id="side8" type="number" value={side8} onChange={side8Change} placeholder="Type something..." />
          </div>
          <div className="container1">
            <lable className="label" htmlFor="angle1"> Angle (θ1) degree</lable>
            <input className="input-field" id="angle1" type="number" value={angle1} onChange={angle1Change} placeholder="Type something..." />
          </div>
          <div className="container1">
            <lable className="label" htmlFor="angle2"> Angle (θ2) degree</lable>
            <input className="input-field" id="angle2" type="number" value={angle2} onChange={angle2Change} placeholder="Type something..." />
          </div>
          <div className="container1">
            <lable className="label" htmlFor="radius1">Radius (R1) mm</lable>
            <input className="input-field" id="radius1" type="number" value={radius1} onChange={radius1Change} placeholder="Type something..." />
          </div>
          <div className="container1">
            <lable className="label" htmlFor="radius2">Radius (R2) mm</lable>
            <input className="input-field" id="radius2" type="number" value={radius2} onChange={radius2Change} placeholder="Type something..." />
          </div>
          <div className="container1">
            <lable className="label" htmlFor="radius3">Radius (R3) mm</lable>
            <input className="input-field" id="radius3" type="number" value={radius3} onChange={radius3Change} placeholder="Type something..." />
          </div>
          <div className="container1">
            <lable className="label" htmlFor="radius4">Radius (R4) mm</lable>
            <input className="input-field" id="radius4" type="number" value={radius4} onChange={radius4Change} placeholder="Type something..." />
          </div>
          <div className="container1">
            <lable className="label" htmlFor="radius5">Radius (R5) mm</lable>
            <input className="input-field" id="radius5" type="number" value={radius5} onChange={radius5Change} placeholder="Type something..." />
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
          <button type="button" className="btn btn mx-2" style={{ color: 'white', backgroundColor: '#1b065c'}} onClick={submitClick}>Submit</button>
          <button type="button" className="btn btn mx-2" style={{ color: 'white', backgroundColor: '#1b065c'}} onClick={resetClick}>Reset</button>
        </div>
        <div className='box'>
        <div ref={GraphRef}><Cat_a_piller_graph side11 = {side1} side22={side2} side33={side3} side44={side4} side55={side5} side66={side6} side77={side7} side88={side8} angle11={angle1} angle22={angle2} radius11={radius1} radius22={radius2} radius33={radius3} radius44={radius4} radius55={radius5} thickness1={thickness} outerRadius1={outerRadius} sendValuey={handleComy}/></div>
        </div>
        <div className='box'>
        <Result weightPerLength={weightPerLength} length={length} totalWeight={totalWeight} stripWidth={stripWidth} outLine={outLine} area={area} inertiax={inertiax} inertiay={inertiay}/>
        </div>
      </div>
    </div>
  );
}

export default Cat_a_piller;
