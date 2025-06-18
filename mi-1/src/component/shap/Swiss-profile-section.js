import { useState,useRef ,useEffect } from 'react';
import * as THREE from 'three';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import logo from '../Image/logo.192.jpg';
import '../../App.css'
import 'jspdf-autotable';
import Result from './Result';
import Swiss_profile_section_graph from '../Graph/Swiss-profile-section';

function Swiss_profile_section() {
  const aa = Math.PI/180;
  const [radius1, setRadius1] = useState(40);
  const radius1Change = (event) => {
    setRadius1(parseFloat(event.target.value));
  };

  const [radius2, setRadius2] = useState(80);
  const radius2Change = (event) => {
    setRadius2(parseFloat(event.target.value));
  };

  const [angle, setAngle] = useState(65);
  const angleChange = (event) => {
    setAngle(parseFloat(event.target.value));
  };

  const [thickness, setThickness] = useState(2);
  const thicknessChange = (event) => {
    setThickness(parseFloat(event.target.value));
    setOuterRadius1(parseFloat(2*event.target.value));
    setOuterRadius2(parseFloat(2*event.target.value));
  };

  const [length, setLength] = useState(1);
  const lengthChange = (event) => {
    setLength(parseFloat(event.target.value));
  };

  const [outerRadius1, setOuterRadius1] = useState(8.5);
  const outerRadius1Change = (event) => {
    setOuterRadius1(parseFloat(event.target.value));
  };

  const [outerRadius2, setOuterRadius2] = useState(4);
  const outerRadius2Change = (event) => {
    setOuterRadius2(parseFloat(event.target.value));
  };

  const [weightPerLength, setWeightPerLenght] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);
  const [stripWidth, setStripWidth] = useState(0);
  const [area, setArea] = useState(0);
  const [outLine, setOutLine] = useState(0);
  const [inertia, setInertia] = useState(0);
  const [inertiax, setInertiax] = useState(0);
  const [inertiay, setInertiay] = useState(0);

  const angle2 = (180/Math.PI)*Math.asin(outerRadius2/(radius2 - outerRadius2))
  const angle1 = (180/Math.PI)*Math.asin(outerRadius1/(radius1 - thickness + outerRadius1))

  const x1 = 100 + (radius1 - thickness + outerRadius1)*Math.sin(aa*(angle/2 - angle1))
  const y1 = 0 -  radius2 + (radius1 - thickness + outerRadius1)*Math.cos(aa*(angle/2 - angle1))

  const x2 = 100 - (radius1 - thickness + outerRadius1)*Math.sin(aa*(angle/2 - angle1))
  const y2 = 0 - radius2 + (radius1 - thickness + outerRadius1)*Math.cos(aa*(angle/2 - angle1))

  const x3 = 100 + (radius2 - outerRadius2)*Math.sin(aa*(angle/2 - angle2))
  const y3 = 0 - radius2 + (radius2 - outerRadius2)*Math.cos(aa*(angle/2 - angle2))

  const x4 = 100 - (radius2 - outerRadius2)*Math.sin(aa*(angle/2 - angle2))
  const y4 = 0 - radius2 + (radius2 - outerRadius2)*Math.cos(aa*(angle/2 - angle2))

  const l = radius2/Math.cos(aa*angle2) - (radius1 - thickness)/Math.cos(aa*angle1)  - radius2*Math.tan(aa*angle2) - (radius1 - thickness)*Math.tan(aa*angle1)

  const submitClick = () => {
    setWeightPerLenght(((aa*(angle - 2*angle2)*((radius1 - thickness*0.596) + (radius2 - thickness*0.596)) + 2*aa*(90 - angle1)*(outerRadius1 - thickness*0.596)  + 2*aa*(90 + angle2)*(outerRadius2 - thickness*0.596)  + 2*l)*thickness*7850*0.000001).toFixed(3));

    setTotalWeight(((aa*(angle - 2*angle2)*((radius1 - thickness*0.596) + (radius2 - thickness*0.596)) + 2*aa*(90 - angle1)*(outerRadius1 - thickness*0.596)  + 2*aa*(90 + angle2)*(outerRadius2 - thickness*0.596)  + 2*l)*thickness*7850*0.000001* length).toFixed(3));

    setStripWidth((aa*(angle - 2*angle2)*((radius1 - thickness*0.596) + (radius2 - thickness*0.596)) + 2*aa*(90 - angle1)*(outerRadius1 - thickness*0.596)  + 2*aa*(90 + angle2)*(outerRadius2 - thickness*0.596)  + 2*l).toFixed(3))

    setOutLine((aa*(angle - 2*angle2)*((2*radius1 - thickness) + (2*radius2 - thickness)) + 2*aa*(90 - angle1)*(2*outerRadius1 - thickness)  + 2*aa*(90 + angle2)*(2*outerRadius2 - thickness) + 2*l + 2*thickness).toFixed(3))

    setArea(((aa/2)*(angle - 2*angle2)*(Math.pow(radius1,2) + Math.pow(radius2,2) - Math.pow(radius1 - thickness,2) - Math.pow(radius2 - thickness, 2)) + aa*(90 - angle1)*(Math.pow(outerRadius1,2) - Math.pow(outerRadius1 - thickness, 2)) + aa*(90 + angle2)*(Math.pow(outerRadius2,2) - Math.pow(outerRadius2 - thickness, 2)) + thickness*l*2).toFixed(3))
  }

  const resetClick = () => {
    setLength(0);
    setThickness(0);
    setRadius1(0);
    setRadius2(0);
    setAngle(0);
    setOuterRadius1(0);
    setOuterRadius2(0);
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
    shape1.moveTo(100 - (radius2 - outerRadius2)*Math.sin(aa*(angle/2 - angle2)) - (outerRadius2 - thickness)*Math.cos(aa*angle/2), 0 - radius2 + (radius2 - outerRadius2)*Math.cos(aa*(angle/2 - angle2)) -  (outerRadius2 - thickness)*Math.sin(aa*angle/2))
    shape1.lineTo(100 - (radius2 - outerRadius2)*Math.sin(aa*(angle/2 - angle2)) - outerRadius2*Math.cos(aa*angle/2), 0 - radius2 + (radius2 - outerRadius2)*Math.cos(aa*(angle/2 - angle2)) - outerRadius2*Math.sin(aa*angle/2))
    shape1.absarc(x4, y4, outerRadius2, Math.PI + aa*angle/2, Math.PI/2 + aa*angle/2 - aa*angle2, true)
    shape1.absarc(100, 0 - radius2, radius2, Math.PI/2 + aa*angle/2 - aa*angle2, Math.PI/2 - aa*angle/2 + aa*angle2, true)
    shape1.absarc(x3, y3, outerRadius2, Math.PI/2 - aa*angle/2 + aa*angle2, 0 - aa*angle/2, true)
    shape1.absarc(x1, y1, outerRadius1, 0 - aa*angle/2, aa*angle1 - Math.PI/2 - aa*angle/2, true)
    shape1.absarc(100,0 - radius2, radius1 - thickness, Math.PI/2 - aa*angle/2 + aa*angle1, Math.PI/2 + aa*angle/2 - aa*angle1, false)
    shape1.absarc(x2, y2, outerRadius1, 3*Math.PI/2 + aa*angle/2 - aa*angle1, Math.PI + aa*angle/2, true)
    // shape1.lineTo(100 - (radius2 - outerRadius2)*Math.sin(aa*(angle/2 - angle2)) - (outerRadius2 - thickness)*Math.cos(aa*angle/2) + l*Math.sin(aa*angle/2), 0 - radius2 + (radius2 - outerRadius2)*Math.cos(aa*(angle/2 - angle2)) -  (outerRadius2 - thickness)*Math.sin(aa*angle/2) - l*Math.cos(aa*angle/2))
    shape1.absarc(x2, y2, outerRadius1 - thickness, Math.PI + aa*angle/2, 3*Math.PI/2 + aa*angle/2 - aa*angle1, false)
     shape1.absarc(100,0 - radius2, radius1, Math.PI/2 + aa*angle/2 - aa*angle1, Math.PI/2 - aa*angle/2 + aa*angle1, true)
     shape1.absarc(x1, y1, outerRadius1 - thickness, aa*angle1 - Math.PI/2 - aa*angle/2, 0 - aa*angle/2, false)
     shape1.absarc(x3, y3, outerRadius2 - thickness, 0 - aa*angle/2, Math.PI/2 - aa*angle/2 + aa*angle2, false)
     shape1.absarc(100, 0 - radius2, radius2 - thickness, Math.PI/2 - aa*angle/2 + aa*angle2, Math.PI/2 + aa*angle/2 - aa*angle2, false)
     shape1.absarc(x4, y4, outerRadius2 - thickness, Math.PI/2 + aa*angle/2 - aa*angle2, Math.PI + aa*angle/2, false)
    shapes.push(shape1)

    const shape2 = new THREE.Shape();
    shape2.moveTo(100 - (radius2 - outerRadius2)*Math.sin(aa*(angle/2 - angle2)) - (outerRadius2 - thickness)*Math.cos(aa*angle/2), 0 - radius2 + (radius2 - outerRadius2)*Math.cos(aa*(angle/2 - angle2)) -  (outerRadius2 - thickness)*Math.sin(aa*angle/2))
    shape2.lineTo(100 - (radius2 - outerRadius2)*Math.sin(aa*(angle/2 - angle2)) - outerRadius2*Math.cos(aa*angle/2), 0 - radius2 + (radius2 - outerRadius2)*Math.cos(aa*(angle/2 - angle2)) - outerRadius2*Math.sin(aa*angle/2))
    shape2.lineTo(100 - (radius2 - outerRadius2)*Math.sin(aa*(angle/2 - angle2)) - outerRadius2*Math.cos(aa*angle/2) + l*Math.sin(aa*angle/2), 0 - radius2 + (radius2 - outerRadius2)*Math.cos(aa*(angle/2 - angle2)) - outerRadius2*Math.sin(aa*angle/2)- l*Math.cos(aa*angle/2))
    shape2.lineTo(100 - (radius2 - outerRadius2)*Math.sin(aa*(angle/2 - angle2)) - (outerRadius2 - thickness)*Math.cos(aa*angle/2) + l*Math.sin(aa*angle/2), 0 - radius2 + (radius2 - outerRadius2)*Math.cos(aa*(angle/2 - angle2)) -  (outerRadius2 - thickness)*Math.sin(aa*angle/2)- l*Math.cos(aa*angle/2))
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
  }, [radius1, radius2, angle, outerRadius2, outerRadius1, thickness, length]);

  const GraphRef = useRef()

  const handleDownload = () => {
    const doc = new jsPDF();
    html2canvas(GraphRef.current).then((canvas) => {
    doc.setDrawColor("black").setLineWidth(.2).line(4,0,4,300);
    doc.addImage(logo, 'PNG', 75, 2, 60, 10);
    doc.setFont('helvetica',"bold").setFontSize(16).setTextColor('blue').text('Section Characteristics Report', 70, 17);
    doc.setDrawColor("black").setLineWidth(.2).line(0,20,210,20);
    doc.setFont('helvetica',"bold").setFontSize(12).setTextColor('blue').text('Inputs: ', 6, 25);
    doc.setFontSize(10).setTextColor('black').text(`Radius(R1): ${radius1}   Radius(R2): ${radius2}   Angle(): ${angle}   Outer Radius(r1): ${outerRadius1}   Outer Radius(r2): ${outerRadius1}`, 6, 30);
    doc.setFontSize(10).setTextColor('black').text(`Thickness(t): ${thickness}   Length(L): ${length}`, 6, 35);
    doc.setFontSize(12).setTextColor('blue').text('Image: ', 6, 40);
    const imgData = canvas.toDataURL('image/png');
    doc.addImage(imgData, 'PNG', 70, 50, 70, 70); // Adjust dimensions as needed
    doc.setFontSize(12).setTextColor('blue').text('Standard Output: ', 90,130);
    const rows1 = [
      ["Weight per meter", `${weightPerLength} Kg/m`, "Weight of 6m length", `${totalWeight} kg`],
      ["Calculated strip width", `${stripWidth} mm`, "Outline length", `${outLine} mm`],
      ["Area of cross-section", `${(stripWidth*thickness).toFixed(3)} mm^2`, "Inner bend radius(r)", `${outerRadius1 - thickness} mm`],
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
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative'}}>
      <h1 className="heading">Swiss Profile Section</h1>
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
            <lable className="label" htmlFor="radius1">Radius (R1) mm</lable>
            <input className="input-field" id="radius1" type="number" value={radius1} onChange={radius1Change} placeholder="Type something..." />
          </div>
          <div className="container1">
            <lable className="label" htmlFor="radius2">Radius (R2) mm</lable>
            <input className="input-field" id="radius2" type="number" value={radius2} onChange={radius2Change} placeholder="Type something..." />
          </div>
          <div className="container1">
            <lable className="label" htmlFor="angle">Angle (θ) degree</lable>
            <input className="input-field" id="angle" type="number" value={angle} onChange={angleChange} placeholder="Type something..." />
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
            <lable className="label" htmlFor="length">Length (L) m</lable>
            <input className="input-field" id="length" type="number" value={length} onChange={lengthChange} placeholder="Type something..." />
          </div>
          <button type="button" className="btn btn mx-2" onClick={submitClick} style={{ color: 'white', backgroundColor: '#1b065c'}}>Submit</button>
          <button type="button" className="btn btn mx-2" onClick={resetClick} style={{ color: 'white', backgroundColor: '#1b065c'}}>Reset</button>
        </div>
        <div className='box'>
          <div ref={GraphRef}><Swiss_profile_section_graph radius11 = {radius1} radius22 = {radius2} angle = {angle} thickness1={thickness} outerRadius11={outerRadius1} outerRadius22={outerRadius2}/></div>
        </div>
        <div className='box'>
        <Result weightPerLength={weightPerLength} length={length} totalWeight={totalWeight} stripWidth={stripWidth} outLine={outLine} area={area} inertiax={inertiax} inertiay={inertiay}/>
        </div>
      </div>
    </div>
  );
}

export default Swiss_profile_section;
