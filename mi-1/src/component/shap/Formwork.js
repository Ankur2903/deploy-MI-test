import { useState,useRef ,useEffect } from 'react';
import * as THREE from 'three';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import logo from '../Image/logo.192.jpg';
import '../../App.css'
import 'jspdf-autotable';
import Result from './Result';
import Formwork_graph from '../Graph/Formwork';
import Feasibility from '../Feasibility';

function Formwork() {
  const [parameters, setParameters] = useState(0)
  const [length, setLength] = useState(1);
  const lengthChange = (event) => {
    setLength(parseFloat(event.target.value));
  };

  const [thickness, setThickness] = useState(2);
  const thicknessChange = (event) => {
    setThickness(parseFloat(event.target.value));
    setOuterRadius(2*parseFloat(event.target.value));
  };

  const [side1, setSide1] = useState(100);
  const side1Change = (event) => {
    setSide1(parseFloat(event.target.value));
  };

  const [side2, setSide2] = useState(25);
  const side2Change = (event) => {
    setSide2(parseFloat(event.target.value));
  };

  const [side3, setSide3] = useState(20);
  const side3Change = (event) => {
    setSide3(parseFloat(event.target.value));
  };

  const [side4, setSide4] = useState(5);
  const side4Change = (event) => {
    setSide4(parseFloat(event.target.value));
  };

  const [side5, setSide5] = useState(19);
  const side5Change = (event) => {
    setSide5(parseFloat(event.target.value));
  };

  const [side6, setSide6] = useState(6);
  const side6Change = (event) => {
    setSide6(parseFloat(event.target.value));
  };

  const [side7, setSide7] = useState(25);
  const side7Change = (event) => {
    setSide7(parseFloat(event.target.value));
  };

  const [side8, setSide8] = useState(10);
  const side8Change = (event) => {
    setSide8(parseFloat(event.target.value));
  };

  const [side9, setSide9] = useState(15);
  const side9Change = (event) => {
    setSide9(parseFloat(event.target.value));
  };

  const [side10, setSide10] = useState(30);
  const side10Change = (event) => {
    setSide10(parseFloat(event.target.value));
  };

  const [side11, setSide11] = useState(3);
  const side11Change = (event) => {
    setSide11(parseFloat(event.target.value));
  };

  const [outerRadius, setOuterRadius] = useState(4);
  const outerRadiusChange = (event) => {
    setOuterRadius(parseFloat(event.target.value));
  };

  const [angle1, setAngle1] = useState(140);
  const angle1Change = (event) => {
    setAngle1(parseFloat(event.target.value));
  };

  const [angle2, setAngle2] = useState(150);
  const angle2Change = (event) => {
    setAngle2(parseFloat(event.target.value));
  };

  const [angle3, setAngle3] = useState(70);
  const angle3Change = (event) => {
    setAngle3(parseFloat(event.target.value));
  };

  const [angle4, setAngle4] = useState(140);
  const angle4Change = (event) => {
    setAngle4(parseFloat(event.target.value));
  };

   const aa = Math.PI/180;
  const l1 = (side11 - 2*outerRadius - (2*outerRadius - thickness)*Math.cos(aa*angle4))/Math.sin(aa*angle4)
  const l2 = side1 - side9 - side10 + 2*outerRadius/Math.tan(aa*angle4/2) - 2*(2*outerRadius - thickness)*Math.sin(aa*angle4) + 2*l1*Math.cos(aa*angle4)
  const l3 = ( - outerRadius*(1/Math.tan(aa*angle1/2) + 1/Math.tan(aa*angle2/2))*Math.cos(aa*angle1) - side4)/Math.cos(aa*angle1)
  const l4 = (-side4*Math.tan(aa*angle1) - side5)/Math.sin(aa*(angle1 + angle2))  + (outerRadius - thickness)*Math.tan(aa*(angle1 + angle2)/2) - outerRadius/Math.tan(aa*angle2/2)
  const l8 = (side8 - outerRadius - outerRadius/Math.tan(aa*angle3/2) - thickness + (2*outerRadius - thickness)*Math.sin(aa*angle3))/Math.cos(aa*angle3)
  const l7 = ( - outerRadius*(1/Math.tan(aa*angle1/2) + 1/Math.tan(aa*angle2/2))*Math.cos(aa*angle1) - side6)/Math.cos(aa*angle1)
  const l6 = (-side6*Math.tan(aa*angle1) - side5)/Math.sin(aa*(angle1 + angle2))  + (outerRadius - thickness)*Math.tan(aa*(angle1 + angle2)/2) - outerRadius/Math.tan(aa*angle2/2)

  const x1 = side9 - outerRadius/Math.tan(aa*angle4/2) + (2*outerRadius - thickness)*Math.sin(aa*angle4) - l1*Math.cos(aa*angle4)

  const x2 = side3 - outerRadius/Math.tan(aa*angle1/2)
  const y2 = side2 - outerRadius

  const x3 = x2 - l3*Math.cos(aa*angle1)
  const y3 = y2 - l3*Math.sin(aa*angle1)

  const x4 = x3 + l4*Math.cos(aa*(angle1 + angle2)) - (2*outerRadius - thickness)*Math.sin(aa*(angle1 + angle2))
  const y4 = side2 - side5 + outerRadius - thickness

  const x5 = side1 - outerRadius - (2*outerRadius - thickness)*Math.cos(aa*angle3) - l8*Math.sin(aa*angle3)

  const x6 = x5 - 2*outerRadius + thickness

  const x7 = x6 + outerRadius - side7 + outerRadius/Math.tan(aa*angle1/2)

  const x8 = x7 + l7*Math.cos(aa*angle1)
  const y8 = y2 - l7*Math.sin(aa*angle1)

  const x9 = x8 - l6*Math.cos(aa*(angle1 + angle2)) + (2*outerRadius - thickness)*Math.sin(aa*(angle1 + angle2))
  const y9 = side2 - side5 + outerRadius - thickness

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
    setWeightPerLenght((7850*((14*Math.PI - aa*(4*angle1 + 4*angle2 + 2*angle3 + 4*angle4))*(outerRadius - 0.596*thickness) + (side2 - 2*outerRadius) + (side3 - outerRadius - outerRadius/Math.tan(aa*angle1/2)) + l3 + l4 + (x9 - x4) + l6 + l7 + (side7 - outerRadius - outerRadius/Math.tan(aa*angle1/2)) + (side2 - 2*outerRadius - thickness) + l8 + (side8 - outerRadius - outerRadius/Math.tan(aa*angle3/2)) + (side10 - outerRadius - outerRadius/Math.tan(aa*angle4/2)) + (side9 - outerRadius - outerRadius/Math.tan(aa*angle4/2)) + l2 + 2*l1)*thickness*0.000001).toFixed(3));

    setTotalWeight((7850*((14*Math.PI - aa*(4*angle1 + 4*angle2 + 2*angle3 + 4*angle4))*(outerRadius - 0.596*thickness) + (side2 - 2*outerRadius) + (side3 - outerRadius - outerRadius/Math.tan(aa*angle1/2)) + l3 + l4 + (x9 - x4) + l6 + l7 + (side7 - outerRadius - outerRadius/Math.tan(aa*angle1/2)) + (side2 - 2*outerRadius - thickness) + l8 + (side8 - outerRadius - outerRadius/Math.tan(aa*angle3/2)) + (side10 - outerRadius - outerRadius/Math.tan(aa*angle4/2)) + (side9 - outerRadius - outerRadius/Math.tan(aa*angle4/2)) + l2 + 2*l1)*thickness*0.000001*length).toFixed(3));

    setStripWidth(((14*Math.PI - aa*(4*angle1 + 4*angle2 + 2*angle3 + 4*angle4))*(outerRadius - 0.596*thickness) + (side2 - 2*outerRadius) + (side3 - outerRadius - outerRadius/Math.tan(aa*angle1/2)) + l3 + l4 + (x9 - x4) + l6 + l7 + (side7 - outerRadius - outerRadius/Math.tan(aa*angle1/2)) + (side2 - 2*outerRadius - thickness) + l8 + (side8 - outerRadius - outerRadius/Math.tan(aa*angle3/2)) + (side10 - outerRadius - outerRadius/Math.tan(aa*angle4/2)) + (side9 - outerRadius - outerRadius/Math.tan(aa*angle4/2)) + l2 + 2*l1).toFixed(3));

    setOutLine(((14*Math.PI - aa*(4*angle1 + 4*angle2 + 2*angle3 + 4*angle4))*(2*outerRadius - thickness) + 2*((side2 - 2*outerRadius) + (side3 - outerRadius - outerRadius/Math.tan(aa*angle1/2)) + l3 + l4 + (x9 - x4) + l6 + l7 + (side7 - outerRadius - outerRadius/Math.tan(aa*angle1/2)) + (side2 - 2*outerRadius - thickness) + l8 + (side8 - outerRadius - outerRadius/Math.tan(aa*angle3/2)) + (side10 - outerRadius - outerRadius/Math.tan(aa*angle4/2)) + (side9 - outerRadius - outerRadius/Math.tan(aa*angle4/2)) + l2 + 2*l1) + 2* thickness).toFixed(3))

    setArea(((14*Math.PI - aa*(4*angle1 + 4*angle2 + 2*angle3 + 4*angle4))*(Math.pow(outerRadius, 2) - Math.pow(outerRadius - thickness, 2)) + thickness*((side2 - 2*outerRadius) + (side3 - outerRadius - outerRadius/Math.tan(aa*angle1/2)) + l3 + l4 + (x9 - x4) + l6 + l7 + (side7 - outerRadius - outerRadius/Math.tan(aa*angle1/2)) + (side2 - 2*outerRadius - thickness) + l8 + (side8 - outerRadius - outerRadius/Math.tan(aa*angle3/2)) + (side10 - outerRadius - outerRadius/Math.tan(aa*angle4/2)) + (side9 - outerRadius - outerRadius/Math.tan(aa*angle4/2)) + l2 + 2*l1)).toFixed(3))
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
    setSide9(0);
    setSide10(0);
    setSide11(0);
    setAngle1(0)
    setAngle2(0)
    setAngle3(0)
    setAngle4(0)
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
    shape1.moveTo(outerRadius, thickness)
    shape1.lineTo(outerRadius, 0)
    shape1.absarc(outerRadius, outerRadius, outerRadius, 3*Math.PI/2, Math.PI, true)
    shape1.absarc(outerRadius, side2 - outerRadius, outerRadius, Math.PI, Math.PI/2, true)
    shape1.absarc(x2, y2, outerRadius, Math.PI/2, aa*angle1 - Math.PI/2, true)
    shape1.absarc(x3, y3, outerRadius, aa*angle1 - Math.PI/2, aa*(angle1 + angle2) - 3*Math.PI/2, true)
    shape1.absarc(x4, y4, outerRadius - thickness, aa*(angle1 + angle2) - Math.PI/2, 3*Math.PI/2, false)
    shape1.absarc(x9, y9, outerRadius - thickness, 3*Math.PI/2, 3*Math.PI/2 - aa*(angle1 + angle2), false)
    shape1.absarc(x8, y8, outerRadius, Math.PI/2 - aa*(angle1 + angle2), 3*Math.PI/2 - aa*angle1, true)
    shape1.absarc(x7, y2, outerRadius, 3*Math.PI/2 - aa*angle1, Math.PI/2, true)
    shape1.absarc(x6, y2, outerRadius, Math.PI/2, 0, true)
    shape1.absarc(x5, outerRadius + thickness, outerRadius - thickness, Math.PI, -aa*angle3, false)
    shape1.absarc(side1 - outerRadius, side8 - outerRadius/Math.tan(aa*angle3/2), outerRadius, Math.PI - aa*angle3, 0, true)
    shape1.absarc(side1 - outerRadius, outerRadius, outerRadius, 0, 3*Math.PI/2, true)
    shape1.absarc(side1 - side10 + outerRadius/Math.tan(aa*angle4/2), outerRadius, outerRadius, 3*Math.PI/2, Math.PI/2 + aa*angle4, true)
    shape1.absarc(x1 + l2, side11 - outerRadius, outerRadius - thickness, aa*angle4 - Math.PI/2, Math.PI/2, false)
    shape1.absarc(x1, side11 - outerRadius, outerRadius - thickness, Math.PI/2, 3*Math.PI/2 - aa*angle4 , false)
    shape1.absarc(side9 - outerRadius/Math.tan(aa*angle4/2), outerRadius, outerRadius, Math.PI/2 - aa*angle4, 3*Math.PI/2 , true)

    shape1.absarc(side9 - outerRadius/Math.tan(aa*angle4/2), outerRadius, outerRadius - thickness, 3*Math.PI/2, Math.PI/2 - aa*angle4 , false)
    shape1.absarc(x1, side11 - outerRadius, outerRadius, 3*Math.PI/2 - aa*angle4, Math.PI/2 , true)
    shape1.absarc(x1 + l2, side11 - outerRadius, outerRadius, Math.PI/2, aa*angle4 - Math.PI/2, true)
    shape1.absarc(side1 - side10 + outerRadius/Math.tan(aa*angle4/2), outerRadius, outerRadius - thickness, Math.PI/2 + aa*angle4, 3*Math.PI/2, false)
    shape1.absarc(side1 - outerRadius, outerRadius, outerRadius - thickness, 3*Math.PI/2, 0, false)
    shape1.absarc(side1 - outerRadius, side8 - outerRadius/Math.tan(aa*angle3/2), outerRadius - thickness, 0, Math.PI - aa*angle3, false)
    shape1.absarc(x5, outerRadius + thickness, outerRadius, -aa*angle3, Math.PI, true)
    shape1.absarc(x6, y2, outerRadius - thickness, 0, Math.PI/2, false)
    shape1.absarc(x7, y2, outerRadius - thickness, Math.PI/2, 3*Math.PI/2 - aa*angle1, false)
    shape1.absarc(x8, y8, outerRadius - thickness, 3*Math.PI/2 - aa*angle1, Math.PI/2 - aa*(angle1 + angle2), false)
    shape1.absarc(x9, y9, outerRadius, 3*Math.PI/2 - aa*(angle1 + angle2), 3*Math.PI/2, true)
    shape1.absarc(x4, y4, outerRadius, 3*Math.PI/2, aa*(angle1 + angle2) - Math.PI/2, true)
    shape1.absarc(x3, y3, outerRadius - thickness, aa*(angle1 + angle2) - 3*Math.PI/2, aa*angle1 - Math.PI/2, false)
    shape1.absarc(x2, y2, outerRadius - thickness, aa*angle1 - Math.PI/2, Math.PI/2, false)
    shape1.absarc(outerRadius, side2 - outerRadius, outerRadius - thickness, Math.PI/2, Math.PI, false)
    shape1.absarc(outerRadius, outerRadius, outerRadius - thickness, Math.PI, 3*Math.PI/2, false)
    shapes.push(shape1)

    const shape2 = new THREE.Shape();
    shape2.moveTo(outerRadius, thickness)
    shape2.lineTo(outerRadius, 0)
    shape2.lineTo(side9 - outerRadius/Math.tan(aa*angle4/2), 0)
    shape2.lineTo(side9 - outerRadius/Math.tan(aa*angle4/2), thickness)
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
  }, [side1,side2 ,side3, side4, side5, side6, side7, side8, side9, side10, side11, outerRadius, angle1, angle2, angle3, angle4, thickness, length]);
  
  const GraphRef = useRef()

  const handleDownload = () => {
    const doc = new jsPDF();
    html2canvas(GraphRef.current).then((canvas) => {
    doc.setDrawColor("black").setLineWidth(.2).line(4,0,4,300);
    doc.addImage(logo, 'PNG', 75, 2, 60, 10);
    doc.setFont('helvetica',"bold").setFontSize(16).setTextColor('blue').text('Section Characteristics Report', 70, 17);
    doc.setDrawColor("black").setLineWidth(.2).line(0,20,210,20);
    doc.setFont('helvetica',"bold").setFontSize(12).setTextColor('blue').text('Inputs: ', 6, 25);
    doc.setFontSize(10).setTextColor('black').text(`side1(A): ${side1}   side1(B): ${side2}   side1(C): ${side3}   side1(D): ${side4}   side(E): ${side5}   Thickness(t): ${thickness}   Length(L): ${length}`, 6, 30);
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
      <h1 className="heading">Formwork</h1>
      <div className="btn-group" role="group" style={{marginLeft: 'auto', transform: 'translateX(-35%)'}}>
        <button type="button"  className="btn btn dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" style={{ color: 'white', backgroundColor: '#1b065c'}}>
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
            <lable className="label" htmlFor="side1"> Side (D) mm</lable>
            <input className="input-field" id="side1" type="number" value={side4} onChange={side4Change} placeholder="Type something..." />
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
            <lable className="label" htmlFor="side9"> Side (I) mm</lable>
            <input className="input-field" id="side9" type="number" value={side9} onChange={side9Change} placeholder="Type something..." />
          </div>
          <div className="container1">
            <lable className="label" htmlFor="side10"> Side (J) mm</lable>
            <input className="input-field" id="side10" type="number" value={side10} onChange={side10Change} placeholder="Type something..." />
          </div>
          <div className="container1">
            <lable className="label" htmlFor="side11"> Side (K) mm</lable>
            <input className="input-field" id="side11" type="number" value={side11} onChange={side11Change} placeholder="Type something..." />
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
            <lable className="label" htmlFor="angle3"> Angle (θ3) degree</lable>
            <input className="input-field" id="angle3" type="number" value={angle3} onChange={angle3Change} placeholder="Type something..." />
          </div>
          <div className="container1">
            <lable className="label" htmlFor="angle4"> Angle (θ4) degree</lable>
            <input className="input-field" id="angle4" type="number" value={angle4} onChange={angle4Change} placeholder="Type something..." />
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
        <div ref={GraphRef}><Formwork_graph side11 = {side1} side22={side2} side33={side3} side44={side4} side55={side5} side66={side6} side77={side7} side88={side8} side99={side9} side1010={side10} side1212={side11} thickness1={thickness} outerRadius1={outerRadius} angle1={angle1} angle2={angle2} angle3={angle3} angle4={angle4} sendValuey={handleComy}/></div>
        </div>
        <div className='box'>
        <Result weightPerLength={weightPerLength} length={length} totalWeight={totalWeight} stripWidth={stripWidth} outLine={outLine} area={area} inertiax={inertiax} inertiay={inertiay}/>
        </div>
      </div>
    </div>
  );
}

export default Formwork;
