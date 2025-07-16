import { useState,useRef ,useEffect } from 'react';
import * as THREE from 'three';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import logo from '../Image/logo.192.jpg';
import '../../App.css'
import 'jspdf-autotable';
import Result from './Result';
import Frame_profile_graph from '../Graph/Frame-profile';
import Feasibility from '../Feasibility';

function Frame_profile() {
  const [parameters, setParameters] = useState(0)
  const [length, setLength] = useState(1);
  const lengthChange = (event) => {
    setLength(parseFloat(event.target.value));
  };

  const [thickness, setThickness] = useState(2);
  const thicknessChange = (event) => {
    setThickness(parseFloat(event.target.value));
  };

  const [side1, setSide1] = useState(100);
  const side1Change = (event) => {
    setSide1(parseFloat(event.target.value));
  };

  const [side2, setSide2] = useState(23);
  const side2Change = (event) => {
    setSide2(parseFloat(event.target.value));
  };

  const [side3, setSide3] = useState(60);
  const side3Change = (event) => {
    setSide3(parseFloat(event.target.value));
  };

  const [side4, setSide4] = useState(8);
  const side4Change = (event) => {
    setSide4(parseFloat(event.target.value));
  };

   const [side5, setSide5] = useState(22);
  const side5Change = (event) => {
    setSide5(parseFloat(event.target.value));
  };

  const [outerRadius1, setOuterRadius1] = useState(4);
  const outerRadius1Change = (event) => {
    setOuterRadius1(parseFloat(event.target.value));
  };

  const [outerRadius2, setOuterRadius2] = useState(5);
  const outerRadius2Change = (event) => {
    setOuterRadius2(parseFloat(event.target.value));
  };

  const [outerRadius3, setOuterRadius3] = useState(5);
  const outerRadius3Change = (event) => {
    setOuterRadius3(parseFloat(event.target.value));
  };
  
  const [outerRadius4, setOuterRadius4] = useState(2);
  const outerRadius4Change = (event) => {
    setOuterRadius4(parseFloat(event.target.value));
  };

  const [angle1, setAngle1] = useState(140);
  const angle1Change = (event) => {
    setAngle1(parseFloat(event.target.value));
  };

  const [angle2, setAngle2] = useState(80);
  const angle2Change = (event) => {
    setAngle2(parseFloat(event.target.value));
  };

  const [angle3, setAngle3] = useState(40);
  const angle3Change = (event) => {
    setAngle3(parseFloat(event.target.value));
  };

  const [angle4, setAngle4] = useState(85);
  const angle4Change = (event) => {
    setAngle4(parseFloat(event.target.value));
  };

  const aa = Math.PI/180;

  const l1 = (side4 - (outerRadius1 + outerRadius2 - thickness)*(1 + Math.cos(aa*angle1)))/Math.sin(aa*angle1)

  const x1 = side3 - outerRadius1/Math.tan(aa*angle1/2) + outerRadius1*Math.sin(aa*angle1) - l1*Math.cos(aa*angle1) + (outerRadius2 - thickness)*Math.sin(aa*angle1)
  const y1 = side2 - thickness - side4  + outerRadius2

  const l2 = (side4 + side5 - side2 - (outerRadius1 + outerRadius2 - thickness)*(1 - Math.cos(aa*(angle1 - angle2))))/Math.sin(aa*(angle1 - angle2))

  const x2 = x1 + outerRadius2*Math.sin(aa*(angle1 - angle2)) + l2*Math.cos(aa*(angle1 - angle2)) + (outerRadius1 - thickness)*Math.sin(aa*(angle1 - angle2))
  const y2 = side5 - outerRadius1

  const angle5 = 180 + angle2 - angle1 - angle3

  const l3 = (side5 - (outerRadius1 + outerRadius3)*(1 - Math.cos(aa*angle5)) - thickness*(1 + Math.cos(aa*angle5)))/Math.sin(aa*angle5)

  const x3 = x2 + outerRadius1*Math.sin(aa*angle5) + l3*Math.cos(aa*angle5) + (outerRadius3 - thickness)*Math.sin(aa*angle5)
  const y3 = thickness + outerRadius3

  const l4 = (side1 - x3 - outerRadius4*(1 + Math.sin(aa*(angle4 + angle5))) - (outerRadius3 - thickness)*Math.sin(aa*(angle4 + angle5)))/Math.cos(aa*(180 - angle4 - angle5))

  const l5 = outerRadius3 + outerRadius3*Math.cos(aa*(angle4 + angle5)) + l4*Math.sin(aa*(angle4 + angle5)) + (outerRadius4 - thickness)*Math.cos(aa*(angle4 + angle5)) + outerRadius4 + thickness

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
    setWeightPerLenght((7850*((3*Math.PI - aa*angle1 - aa*angle3)*(outerRadius1 - 0.596*thickness) + (Math.PI)*(outerRadius4 - 0.596*thickness) +  (Math.PI - aa*angle4)*(outerRadius3 - 0.596*thickness) + (Math.PI - aa*angle2)*(outerRadius2 - 0.596*thickness) +  l1 + l2 + l3 + l4 + (l5 - 2*outerRadius4)  + (side1 - outerRadius1 - outerRadius4) + (side4 - 2*outerRadius1) + (side3 - outerRadius1*(1 + 1/Math.tan(aa*angle1))))*thickness*0.000001).toFixed(3));

    setTotalWeight((7850*((3*Math.PI - aa*angle1 - aa*angle3)*(outerRadius1 - 0.596*thickness) + (Math.PI)*(outerRadius4 - 0.596*thickness) +  (Math.PI - aa*angle4)*(outerRadius3 - 0.596*thickness) + (Math.PI - aa*angle2)*(outerRadius2 - 0.596*thickness) +  l1 + l2 + l3 + l4 + (l5 - 2*outerRadius4)  + (side1 - outerRadius1 - outerRadius4) + (side4 - 2*outerRadius1) + (side3 - outerRadius1*(1 + 1/Math.tan(aa*angle1))))*thickness*0.000001*length).toFixed(3));

    setStripWidth(((3*Math.PI - aa*angle1 - aa*angle3)*(outerRadius1 - 0.596*thickness) + (Math.PI)*(outerRadius4 - 0.596*thickness) +  (Math.PI - aa*angle4)*(outerRadius3 - 0.596*thickness) + (Math.PI - aa*angle2)*(outerRadius2 - 0.596*thickness) +  l1 + l2 + l3 + l4 + (l5 - 2*outerRadius4)  + (side1 - outerRadius1 - outerRadius4) + (side4 - 2*outerRadius1) + (side3 - outerRadius1*(1 + 1/Math.tan(aa*angle1)))).toFixed(3));

    setOutLine(((3*Math.PI - aa*angle1 - aa*angle3)*(2*outerRadius1 - thickness) + (Math.PI)*(2*outerRadius4 - thickness) +  (Math.PI - aa*angle4)*(2*outerRadius3 - thickness) + (Math.PI - aa*angle2)*(2*outerRadius2 - thickness) + 2*(l1 + l2 + l3 + l4 + (l5 - 2*outerRadius4)  + (side1 - outerRadius1 - outerRadius4) + (side4 - 2*outerRadius1) + (side3 - outerRadius1*(1 + 1/Math.tan(aa*angle1)))) + 2* thickness).toFixed(3))

    setArea(((3*Math.PI/2 - aa*angle1/2 - aa*angle3/2)*(Math.pow(outerRadius1,2) - Math.pow(outerRadius1 - thickness,2)) + (Math.PI/2)*(Math.pow(outerRadius4,2) - Math.pow(outerRadius2 - thickness,2)) + (Math.PI/2 - aa*angle4/2)*(Math.pow(outerRadius3,2) - Math.pow(outerRadius3 - thickness,2)) + (Math.PI/2 - aa*angle2/2)*(Math.pow(outerRadius2,2) - Math.pow(outerRadius2 - thickness,2)) + thickness*(l1 + l2 + l3 + l4 + (l5 - 2*outerRadius4)  + (side1 - outerRadius1 - outerRadius4) + (side4 - 2*outerRadius1) + (side3 - outerRadius1*(1 + 1/Math.tan(aa*angle1))))).toFixed(3))
  }

  const resetClick = () => {
    setLength(0);
    setThickness(0);
    setOuterRadius3(parseFloat(0))
    setOuterRadius1(parseFloat(0))
    setOuterRadius2(parseFloat(0))
    setOuterRadius4(parseFloat(0))
    setSide1(0);
    setSide2(0);
    setSide3(0);
    setSide4(0);
    setSide5(0);
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
    shape1.moveTo(outerRadius1, thickness)
    shape1.lineTo(outerRadius1, 0)
    shape1.absarc(outerRadius1, outerRadius1, outerRadius1, 3*Math.PI/2, Math.PI, true)
    shape1.absarc(outerRadius1, side2 - outerRadius1, outerRadius1, Math.PI, Math.PI/2, true)
    shape1.absarc(side3 - outerRadius1/Math.tan(aa*angle1/2), side2 - outerRadius1, outerRadius1, Math.PI/2, aa*angle1 - Math.PI/2, true)
    shape1.absarc(x1, y1, outerRadius2 - thickness, Math.PI/2 + aa*angle1, 3*Math.PI/2 + aa*(angle1 - angle2), false)
    shape1.absarc(x2, y2, outerRadius1, Math.PI/2 + aa*(angle1 - angle2), Math.PI/2 - aa*angle5, true)
    shape1.absarc(x3, y3, outerRadius3 - thickness, 3*Math.PI/2 - aa*angle5, Math.PI/2 - aa*(angle4 + angle5), false)
    shape1.absarc(side1 - outerRadius4, l5 - outerRadius4, outerRadius4, 3*Math.PI/2 - aa*(angle4 + angle5), 0, true)
    shape1.absarc(side1 - outerRadius4, outerRadius4, outerRadius4, 0, 3*Math.PI/2, true)

    shape1.absarc(side1 - outerRadius4, outerRadius4, outerRadius4 - thickness, 3*Math.PI/2, 0, false)
    shape1.absarc(side1 - outerRadius4, l5 - outerRadius4, outerRadius4 - thickness, 0, 3*Math.PI/2 - aa*(angle4 + angle5), false)
    shape1.absarc(x3, y3, outerRadius3, Math.PI/2 - aa*(angle4 + angle5), 3*Math.PI/2 - aa*angle5, true)
    shape1.absarc(x2, y2, outerRadius1 - thickness, Math.PI/2 - aa*angle5, Math.PI/2 + aa*(angle1 - angle2), false)
    shape1.absarc(x1, y1, outerRadius2, 3*Math.PI/2 + aa*(angle1 - angle2), Math.PI/2 + aa*angle1, true)
    shape1.absarc(side3 - outerRadius1/Math.tan(aa*angle1/2), side2 - outerRadius1, outerRadius1 - thickness, aa*angle1 - Math.PI/2, Math.PI/2, false)
    shape1.absarc(outerRadius1, side2 - outerRadius1, outerRadius1 - thickness, Math.PI/2, Math.PI, false)
    shape1.absarc(outerRadius1, outerRadius1, outerRadius1 - thickness, Math.PI, 3*Math.PI/2, false)
    shapes.push(shape1)

    const shape2 = new THREE.Shape();
    shape2.moveTo(outerRadius1, thickness)
    shape2.lineTo(outerRadius1, 0)
    shape2.lineTo(side1 - outerRadius4, 0)
    shape2.lineTo(side1 - outerRadius4, thickness)
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
  }, [side1,side2 ,side3, side4, side5, outerRadius1, outerRadius2, outerRadius3, outerRadius4, angle1, angle2, angle3, angle4, thickness, length]);
  
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
      ["Area of cross-section", `${(stripWidth*thickness).toFixed(2)} mm^2`, "Inner bend radius(r)", `${outerRadius2 - thickness} mm`],
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
      <h1 className="heading">Frame Profile</h1>
      <div className="btn-group" role="group" style={{marginLeft: 'auto', transform: 'translateX(-35%)'}}>
        <button title='Download PDF or STL' type="button"  className="btn btn dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" style={{ color: 'white', backgroundColor: '#1b065c'}}>
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
            <lable className="label" htmlFor="outerRadius1">Outer Radius (r1) mm</lable>
            <input className="input-field" id="outerRadius1" type="number" value={outerRadius1} onChange={outerRadius1Change} placeholder="Type something..." />
          </div>
          <div className="container1">
            <lable className="label" htmlFor="outerRadius2">Outer Radius (r2) mm</lable>
            <input className="input-field" id="outerRadius2" type="number" value={outerRadius2} onChange={outerRadius2Change} placeholder="Type something..." />
          </div>
          <div className="container1">
            <lable className="label" htmlFor="outerRadius3">Outer Radius (r3) mm</lable>
            <input className="input-field" id="outerRadius3" type="number" value={outerRadius3} onChange={outerRadius3Change} placeholder="Type something..." />
          </div>
          <div className="container1">
            <lable className="label" htmlFor="outerRadius4">Outer Radius (r4) mm</lable>
            <input className="input-field" id="outerRadius4" type="number" value={outerRadius4} onChange={outerRadius4Change} placeholder="Type something..." />
          </div>
          <div className="container1">
            <lable className="label" htmlFor="length">Length (L) m</lable>
            <input className="input-field" id="length" type="number" value={length} onChange={lengthChange} placeholder="Type something..." />
          </div>
          <button type="button" className="btn btn mx-2" style={{ color: 'white', backgroundColor: '#1b065c'}} onClick={submitClick}>Submit</button>
          <button type="button" className="btn btn mx-2" style={{ color: 'white', backgroundColor: '#1b065c'}} onClick={resetClick}>Reset</button>
        </div>
        <div className='box'>
        <div ref={GraphRef}><Frame_profile_graph side11 = {side1} side22={side2} side33={side3} side44={side4} side55={side5} thickness1={thickness} outerRadius11={outerRadius1} outerRadius22={outerRadius2} outerRadius33={outerRadius3} outerRadius44={outerRadius4} angle1={angle1} angle2={angle2} angle3={angle3} angle4={angle4} sendValuey={handleComy}/></div>
        </div>
        <div className='box'>
        <Result weightPerLength={weightPerLength} length={length} totalWeight={totalWeight} stripWidth={stripWidth} outLine={outLine} area={area} inertiax={inertiax} inertiay={inertiay}/>
        </div>
      </div>
    </div>
  );
}

export default Frame_profile;
