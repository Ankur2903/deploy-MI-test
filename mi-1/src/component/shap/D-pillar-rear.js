import { useState,useRef ,useEffect } from 'react';
import * as THREE from 'three';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import logo from '../Image/logo.192.jpg';
import '../../App.css'
import 'jspdf-autotable';
import Result from './Result';
import D_pillar_rear_graph from '../Graph/D-pillar-rear';
import Feasibility from '../Feasibility';
import * as Props from '../constant';

function D_pillar_rear() {
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

  const [side1, setSide1] = useState(40);
  const side1Change = (event) => {
    setSide1(parseFloat(event.target.value));
  };

  const [side2, setSide2] = useState(35);
  const side2Change = (event) => {
    setSide2(parseFloat(event.target.value));
  };

  const [side3, setSide3] = useState(20);
  const side3Change = (event) => {
    setSide3(parseFloat(event.target.value));
  };

  const [side4, setSide4] = useState(30);
  const side4Change = (event) => {
    setSide4(parseFloat(event.target.value));
  };

  const [side5, setSide5] = useState(40);
  const side5Change = (event) => {
    setSide5(parseFloat(event.target.value));
  };

  const [angle1, setAngle1] = useState(60);
  const angle1Change = (event) => {
    setAngle1(parseFloat(event.target.value));
  };

  const [angle2, setAngle2] = useState(80);
  const angle2Change = (event) => {
    setAngle2(parseFloat(event.target.value));
  };

  const [angle3, setAngle3] = useState(100);
  const angle3Change = (event) => {
    setAngle3(parseFloat(event.target.value));
  };

  const [angle4, setAngle4] = useState(100);
  const angle4Change = (event) => {
    setAngle4(parseFloat(event.target.value));
  };

   const [radius1, setRadius1] = useState(30);
  const radius1Change = (event) => {
    setRadius1(parseFloat(event.target.value));
  };

  const [radius2, setRadius2] = useState(6);
  const radius2Change = (event) => {
    setRadius2(parseFloat(event.target.value));
  };

  const [radius3, setRadius3] = useState(5);
  const radius3Change = (event) => {
    setRadius3(parseFloat(event.target.value));
  };

  const [radius4, setRadius4] = useState(3);
  const radius4Change = (event) => {  
    setRadius4(parseFloat(event.target.value));
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

  const aa = Math.PI/180
  const angle5 = 270 - angle1 - angle2 + angle3 - angle4
  const l1 = side4/Math.sin(aa*angle1) - outerRadius*(1/Math.tan(aa*angle1/2) + 1/Math.tan(aa*angle2/2))

  const x1 = side1 + side2 - radius1 - (radius1 - radius4)*Math.cos(aa*angle5)
  const y1 = side5 + (radius1 - radius4)*Math.sin(aa*angle5)

  const x2 = outerRadius/Math.tan(aa*angle1/2) + l1*Math.cos(aa*angle1)
  const y2 = side3 + outerRadius + l1*Math.sin(aa*angle1)

  const  l2 = -(side1 + side2 - radius1 - (radius1 - radius4)*(Math.cos(aa*angle5) + Math.sin(aa*angle5)/Math.tan(aa*(angle1 + angle2 - angle3))) - radius4*(Math.sin(aa*(angle1 + angle2 - angle3)) + Math.cos(aa*(angle1 + angle2 - angle3))/Math.tan(aa*(angle1 + angle2 - angle3))) + side3/Math.tan(aa*(angle1 + angle2 - angle3)) - side5/Math.tan(aa*(angle1 + angle2 - angle3)) - (l1 + outerRadius*(1/Math.tan(aa*angle1/2) + 1/Math.tan(aa*angle2/2)))*(Math.cos(aa*angle1) - Math.sin(aa*angle1)/Math.tan(aa*(angle1 + angle2 - angle3))))/(Math.cos(aa*(angle1 + angle2)) - Math.sin(aa*(angle1 + angle2))/Math.tan(aa*(angle1 + angle2 - angle3))) - outerRadius/Math.tan(aa*angle2/2) - (radius3 - thickness)/Math.tan(aa*angle3/2) 

  const l3 = (side5 - side3  + (radius1 - radius4)*Math.sin(aa*angle5) + radius4*Math.cos(aa*(angle1 + angle2 - angle3)) + (l2 + outerRadius/Math.tan(aa*angle2/2) + (radius3 - thickness)/Math.tan(aa*angle3/2))*Math.sin(aa*(angle1 + angle2)) - (l1 + outerRadius*(1/Math.tan(aa*angle1/2) + 1/Math.tan(aa*angle2/2)))*Math.sin(aa*angle1))/(Math.sin(aa*(angle1 + angle2 - angle3))) - (radius3 - thickness)/Math.tan(aa*angle3/2)

  const x3 = x2 + outerRadius*Math.sin(aa*(angle1 + angle2)) - l2*Math.cos(aa*(angle1 + angle2)) + (radius3 - thickness)*Math.sin(aa*(angle1 + angle2))
  const y3 = y2 - outerRadius*Math.cos(aa*(angle1 + angle2)) - l2*Math.sin(aa*(angle1 + angle2)) - (radius3 - thickness)*Math.cos(aa*(angle1 + angle2))

  const submitClick = () => {
    setWeightPerLenght((7850*((3*Math.PI - aa*(angle1 + angle2))*(outerRadius - 0.596*thickness) + (Math.PI/2)*(radius2 - 0.596*thickness) + (Math.PI - aa*angle3)*(radius3 - 0.596*thickness) + (Math.PI - aa*angle4)*(radius4 - 0.596*thickness) +  (Math.PI - aa*angle5)*(radius1 - 0.596*thickness) + (side1 - 2*outerRadius + thickness) + (side2 - 2*outerRadius) + l1 + l2 + l3 + (side5 - outerRadius))*thickness*0.000001).toFixed(3));

    setTotalWeight((7850*((3*Math.PI - aa*(angle1 + angle2))*(outerRadius - 0.596*thickness) + (Math.PI/2)*(radius2 - 0.596*thickness) + (Math.PI - aa*angle3)*(radius3 - 0.596*thickness) + (Math.PI - aa*angle4)*(radius4 - 0.596*thickness) +  (Math.PI - aa*angle5)*(radius1 - 0.596*thickness) + (side1 - 2*outerRadius + thickness) + (side2 - 2*outerRadius) + l1 + l2 + l3 + (side5 - outerRadius))*thickness*0.000001*length).toFixed(3));

    setStripWidth(((3*Math.PI - aa*(angle1 + angle2))*(outerRadius - 0.596*thickness) + (Math.PI/2)*(radius2 - 0.596*thickness) + (Math.PI - aa*angle3)*(radius3 - 0.596*thickness) + (Math.PI - aa*angle4)*(radius4 - 0.596*thickness) +  (Math.PI - aa*angle5)*(radius1 - 0.596*thickness) + (side1 - 2*outerRadius + thickness) + (side2 - 2*outerRadius) + l1 + l2 + l3 + (side5 - outerRadius)).toFixed(3));

    setOutLine(((3*Math.PI - aa*(angle1 + angle2))*(2*outerRadius - thickness) + (Math.PI/2)*(2*radius2 - thickness) + (Math.PI - aa*angle3)*(2*radius3 - thickness) + (Math.PI - aa*angle4)*(2*radius4 - thickness) +  (Math.PI - aa*angle5)*(2*radius1 - thickness) + 2*(thickness + (side1 - 2*outerRadius + thickness) + (side2 - 2*outerRadius) + l1 + l2 + l3 + (side5 - outerRadius))).toFixed(3))

    setArea(((3*Math.PI/2 - aa*(angle1 + angle2)/2)*(Math.pow(outerRadius,2) - Math.pow(outerRadius - thickness,2)) + (Math.PI/4)*(Math.pow(radius2,2) - Math.pow(radius2 - thickness,2)) + (Math.PI/2 - aa*angle3/2)*(Math.pow(radius3,2) - Math.pow(radius3 - thickness,2)) + (Math.PI/2 - aa*angle4/2)*(Math.pow(radius4,2) - Math.pow(radius4 - thickness,2)) + (Math.PI/2 - aa*angle5/2)*(Math.pow(radius1,2) - Math.pow(radius1 - thickness,2)) + thickness*((side1 - 2*outerRadius + thickness) + (side2 - 2*outerRadius) + l1 + l2 + l3 + (side5 - outerRadius))).toFixed(3))
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
    setRadius1(0);
    setRadius2(0);
    setRadius3(0);
    setRadius4(0);
    setAngle1(0);
    setAngle2(0);
    setAngle3(0);
    setAngle4(0);
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
    shape1.moveTo(side1 + outerRadius, thickness)
    shape1.lineTo(side1 + outerRadius, 0)
    shape1.absarc(side1 + outerRadius, outerRadius, outerRadius, 3*Math.PI/2, Math.PI, true)
    shape1.absarc(side1 - radius2 + thickness, side3 - radius2 + thickness, radius2 - thickness, 0, Math.PI/2, false)
    shape1.absarc(outerRadius/Math.tan(aa*angle1), side3 + outerRadius, outerRadius, 3*Math.PI/2, Math.PI/2 + aa*angle1, true)
    shape1.absarc(x2, y2, outerRadius, Math.PI/2 + aa*angle1 , 3*Math.PI/2 + aa*(angle1 + angle2), true)
    shape1.absarc(x3, y3, radius3 - thickness, Math.PI/2 + aa*(angle1 + angle2), 3*Math.PI/2 + aa*(angle1 + angle2 - angle3, false))
    shape1.absarc(x1, y1, radius4, Math.PI/2 + aa*(angle1 + angle2 - angle3), 3*Math.PI/2 + aa*(angle1 + angle2 + angle4 - angle3), true)
    shape1.absarc(side1 + side2 - radius1, side5, radius1, 3*Math.PI/2 + aa*(angle1 + angle2 + angle4 - angle3), 0, true)
    shape1.absarc(side1 + side2 - outerRadius, outerRadius, outerRadius, 0, 3*Math.PI/2, true)

    shape1.absarc(side1 + side2 - outerRadius, outerRadius, outerRadius - thickness, 3*Math.PI/2, 0, false)
    shape1.absarc(side1 + side2 - radius1, side5, radius1 - thickness, 0, 3*Math.PI/2 + aa*(angle1 + angle2 + angle4 - angle3), false)
    shape1.absarc(x1, y1, radius4 - thickness, 3*Math.PI/2 + aa*(angle1 + angle2 + angle4 - angle3), Math.PI/2 + aa*(angle1 + angle2 - angle3), false)
    shape1.absarc(x3, y3, radius3, 3*Math.PI/2 + aa*(angle1 + angle2 - angle3), Math.PI/2 + aa*(angle1 + angle2), true)
    shape1.absarc(x2, y2, outerRadius - thickness, 3*Math.PI/2 + aa*(angle1 + angle2), Math.PI/2 + aa*angle1, false)
    shape1.absarc(outerRadius/Math.tan(aa*angle1), side3 + outerRadius, outerRadius - thickness, Math.PI/2 + aa*angle1, 3*Math.PI/2, false)
    shape1.absarc(side1 - radius2 + thickness, side3 - radius2 + thickness, radius2, Math.PI/2, 0, true)
    shape1.absarc(side1 + outerRadius, outerRadius, outerRadius - thickness, Math.PI, 3*Math.PI/2, false)
    shapes.push(shape1)

    const shape2 = new THREE.Shape(); 
    shape2.moveTo(side1 + outerRadius, thickness)
    shape2.lineTo(side1 + outerRadius, 0)
    shape2.lineTo(side1 + side2 - outerRadius, 0)
    shape2.lineTo(side1 + side2 - outerRadius, thickness)
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
  }, [side1, side2, side3, side4, side5, radius1, radius2, radius3, radius4, angle1, angle2, angle3, outerRadius, thickness, length]);
  
  const GraphRef = useRef()

  const handleDownload = () => {
    const doc = new jsPDF();
    html2canvas(GraphRef.current).then((canvas) => {
    doc.setDrawColor("black").setLineWidth(.2).line(4,0,4,300);
    doc.addImage(logo, 'PNG', 75, 2, 60, 10);
    doc.setFont('helvetica',"bold").setFontSize(16).setTextColor('blue').text('Section Characteristics Report', 70, 17);
    doc.setDrawColor("black").setLineWidth(.2).line(0,20,210,20);
    doc.setFont('helvetica',"bold").setFontSize(12).setTextColor('blue').text('Inputs: ', 6, 25);
    doc.setFontSize(10).setTextColor('black').text(`side(A): ${side1}   side(B): ${side2}   side(C): ${side3}   side(D): ${side4}   side(E): ${side5}   Radius(R1): ${radius1}   Radius(R2): ${radius2}   Radius(R3): ${radius3}   Radius(R4): ${radius4}   Angle(D): ${angle1}   Angle(D): ${angle2}Thickness(t): ${thickness}   Length(L): ${length}`, 6, 30);
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
        <h1 className="heading">D Pillar Rear</h1>
        <div className="btn-group" role="group" style={{marginLeft: 'auto', transform: 'translateX(-35%)'}}>
          <button title={Props.title2} type="button"  className="btn btn dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" style={{ color: 'white', backgroundColor: '#1b065c'}}>
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
            <lable className="label" htmlFor="side4"> Side (D) mm</lable>
            <input className="input-field" id="side4" type="number" value={side4} onChange={side4Change} placeholder="Type something..." />
          </div>
          <div className="container1">
            <lable className="label" htmlFor="side5"> Side (E) mm</lable>
            <input className="input-field" id="side5" type="number" value={side5} onChange={side5Change} placeholder="Type something..." />
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
        <div ref={GraphRef}><D_pillar_rear_graph side11 = {side1} side22={side2} side33={side3} side44={side4} side55={side5} angle1={angle1} angle2={angle2} angle3={angle3} angle4={angle4} radius11={radius1} radius22={radius2} radius33={radius3} radius44={radius4} thickness1={thickness} outerRadius1={outerRadius} sendValuey={handleComy}/></div>
        </div>
        <div className='box'>
        <Result weightPerLength={weightPerLength} length={length} totalWeight={totalWeight} stripWidth={stripWidth} outLine={outLine} area={area} inertiax={inertiax} inertiay={inertiay}/>
        </div>
      </div>
    </div>
  );
}

export default D_pillar_rear;
