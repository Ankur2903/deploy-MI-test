import { useState,useRef ,useEffect } from 'react';
import * as THREE from 'three';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import logo from '../Image/logo.192.jpg';
import '../../App.css'
import 'jspdf-autotable';
import Result from './Result';
import Front_st_a_pillar_graph from '../Graph/Front-st-a-pillar';
import Feasibility from '../Feasibility';

function Front_st_a_pillar() {
  const [parameters, setParameters] = useState(0)
  const aa = Math.PI/180;
  const [radius1, setRadius1] = useState(100);
  const radius1Change = (event) => {
    setRadius1(parseFloat(event.target.value));
  };

  const [radius2, setRadius2] = useState(140);
  const radius2Change = (event) => {
    setRadius2(parseFloat(event.target.value));
  };

  const [angle1, setAngle1] = useState(10);
  const angle1Change = (event) => {
    setAngle1(parseFloat(event.target.value));
  };

   const [angle2, setAngle2] = useState(20);
  const angle2Change = (event) => {
    setAngle2(parseFloat(event.target.value));
  };

  const [thickness, setThickness] = useState(2);
  const thicknessChange = (event) => {
    setThickness(parseFloat(event.target.value));
    setOuterRadius(parseFloat(2*event.target.value));
  };

  const [length, setLength] = useState(1);
  const lengthChange = (event) => {
    setLength(parseFloat(event.target.value));
  };

  const [outerRadius, setOuterRadius] = useState(4);
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

  const x1 = outerRadius - (radius1 + outerRadius)*Math.cos(aa*angle1)
  const angle3 = (180/Math.PI)*Math.atan(((radius2 - outerRadius)*Math.sin(aa*angle2) - (radius1 + outerRadius)*Math.sin(aa*angle1))/((radius2 - outerRadius)*Math.cos(aa*angle2) - (radius1 + outerRadius)*Math.cos(aa*angle1)))
  const l = ((radius2 - outerRadius)*Math.cos(aa*angle2) - (radius1 + outerRadius)*Math.cos(aa*angle1))/Math.cos(aa*angle3)

  const submitClick = () => {
    setWeightPerLenght(((aa*(angle1)*((radius1 - thickness*0.596) + aa*(angle2)*(radius2 - thickness*0.596)) + (2*Math.PI + aa*(angle1 - angle2))*(outerRadius - thickness*0.596) + (radius2 - radius1) + l)*thickness*7850*0.000001).toFixed(3));

    setTotalWeight(((aa*(angle1)*((radius1 - thickness*0.596) + aa*(angle2)*(radius2 - thickness*0.596)) + (2*Math.PI + aa*(angle1 - angle2))*(outerRadius - thickness*0.596) + (radius2 - radius1) + l)*thickness*7850*0.000001* length).toFixed(3));

    setStripWidth((aa*(angle1)*((radius1 - thickness*0.596) + aa*(angle2)*(radius2 - thickness*0.596)) + (2*Math.PI + aa*(angle1 - angle2))*(outerRadius - thickness*0.596) + (radius2 - radius1) + l).toFixed(3))

    setOutLine((aa*(angle1)*((2*radius1 - thickness) + aa*(angle2)*(2*radius2 - thickness)) + (2*Math.PI + aa*(angle1 - angle2))*(2*outerRadius - thickness) + 2*((radius2 - radius1) + l) + 2*thickness).toFixed(3))

    setArea((aa*(angle1/2)*(Math.pow(radius1,2) - Math.pow(radius1 - thickness, 2)) + aa*(angle2/2)*(Math.pow(radius2,2) - Math.pow(radius2 - thickness, 2)) + (Math.PI + aa*(angle1 - angle2)/2)*(Math.pow(outerRadius,2) - Math.pow(outerRadius - thickness, 2)) + thickness*((radius2 - radius1) + l)).toFixed(3))
  }

  const resetClick = () => {
    setLength(0);
    setThickness(0);
    setRadius1(0);
    setRadius2(0);
    setAngle1(0);
    setAngle2(0);
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
    shape1.moveTo(radius1 + outerRadius, thickness)
    shape1.lineTo(radius1 + outerRadius, 0)
    shape1.absarc(radius1 + outerRadius, outerRadius, outerRadius, 3*Math.PI/2, Math.PI, true)
    shape1.absarc(0, outerRadius, radius1, 0, angle1*aa, false)
    shape1.absarc((radius1 + outerRadius)*Math.cos(aa*angle1), outerRadius + (radius1 + outerRadius)*Math.sin(aa*angle1), outerRadius, Math.PI + aa*angle1, Math.PI/2 + aa*angle3, true)
    shape1.absarc((radius2 - outerRadius)*Math.cos(aa*angle2),outerRadius + (radius2 - outerRadius)*Math.sin(aa*angle2), outerRadius, Math.PI/2 + aa*angle3, aa*angle2, true)
    shape1.absarc(0,outerRadius,radius2, aa*angle2, 0, true)
    shape1.absarc(radius2 - outerRadius,outerRadius, outerRadius, 0, 3*Math.PI/2, true)

    shape1.absarc(radius2 - outerRadius,outerRadius, outerRadius - thickness, 3*Math.PI/2, 0, false)
    shape1.absarc(0, outerRadius,radius2 - thickness, 0, aa*angle2, false)
    shape1.absarc((radius2 - outerRadius)*Math.cos(aa*angle2),outerRadius + (radius2 - outerRadius)*Math.sin(aa*angle2), outerRadius - thickness, aa*angle2, Math.PI/2+ aa*angle3, false)
    shape1.absarc((radius1 + outerRadius)*Math.cos(aa*angle1), outerRadius + (radius1 + outerRadius)*Math.sin(aa*angle1), outerRadius - thickness, Math.PI/2 + aa*angle3, Math.PI + aa*angle1, false)
    shape1.absarc(0, outerRadius, radius1 + thickness, angle1*aa, 0, true)
    shape1.absarc(radius1 + outerRadius, outerRadius, outerRadius - thickness, Math.PI, 3*Math.PI/2, false)
    shapes.push(shape1)

    const shape2 = new THREE.Shape();
    shape2.moveTo(radius1 + outerRadius, thickness)
    shape2.lineTo(radius1 + outerRadius, 0)
    shape2.lineTo(radius2 - outerRadius, 0)
    shape2.lineTo(radius2 - outerRadius, thickness)
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
  }, [radius1, radius2, angle1, angle2, outerRadius, thickness, length]);

  const GraphRef = useRef()

  const handleDownload = () => {
    const doc = new jsPDF();
    html2canvas(GraphRef.current).then((canvas) => {
    doc.setDrawColor("black").setLineWidth(.2).line(4,0,4,300);
    doc.addImage(logo, 'PNG', 75, 2, 60, 10);
    doc.setFont('helvetica',"bold").setFontSize(16).setTextColor('blue').text('Section Characteristics Report', 70, 17);
    doc.setDrawColor("black").setLineWidth(.2).line(0,20,210,20);
    doc.setFont('helvetica',"bold").setFontSize(12).setTextColor('blue').text('Inputs: ', 6, 25);
    doc.setFontSize(10).setTextColor('black').text(`Radius(R1): ${radius1}   Radius(R2): ${radius2}   Angle(1): ${angle1}   Angle(2): ${angle2}`, 6, 30);
    doc.setFontSize(10).setTextColor('black').text(`Thickness(t): ${thickness}   Length(L): ${length}`, 6, 35);
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
      <h1 className="heading">Front ST A-Pillar</h1>
      <div className="btn-group" role="group" style={{marginLeft: 'auto', transform: 'translateX(-35%)'}}>
        <button type="button"  className="btn btn-dark dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" style={{ color: 'white', backgroundColor: '#1b065c'}}>
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
            <lable className="label" htmlFor="radius1">Radius (R1) mm</lable>
            <input className="input-field" id="radius1" type="number" value={radius1} onChange={radius1Change} placeholder="Type something..." />
          </div>
          <div className="container1">
            <lable className="label" htmlFor="radius2">Radius (R2) mm</lable>
            <input className="input-field" id="radius2" type="number" value={radius2} onChange={radius2Change} placeholder="Type something..." />
          </div>
          <div className="container1">
            <lable className="label" htmlFor="angle1">Angle (θ1) degree</lable>
            <input className="input-field" id="angle1" type="number" value={angle1} onChange={angle1Change} placeholder="Type something..." />
          </div>
          <div className="container1">
            <lable className="label" htmlFor="angle2">Angle (θ2) degree</lable>
            <input className="input-field" id="angle2" type="number" value={angle2} onChange={angle2Change} placeholder="Type something..." />
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
          <div ref={GraphRef}><Front_st_a_pillar_graph radius11 = {radius1} radius22 = {radius2} angle1 = {angle1} angle2={angle2} thickness1={thickness} outerRadius1={outerRadius}/></div>
        </div>
        <div className='box'>
        <Result weightPerLength={weightPerLength} length={length} totalWeight={totalWeight} stripWidth={stripWidth} outLine={outLine} area={area} inertiax={inertiax} inertiay={inertiay}/>
        </div>
      </div>
    </div>
  );
}

export default Front_st_a_pillar;
